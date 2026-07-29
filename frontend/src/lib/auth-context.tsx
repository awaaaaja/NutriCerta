'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from './supabase'

type User = {
  id: string
  email: string
  nama?: string
  foto_url?: string
  institusi?: string
}

type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
}

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('nutricerta_token')
}

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('nutricerta_user')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: getStoredUser(),
    token: getStoredToken(),
    loading: true,
  })

  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      setState({ user: null, token: null, loading: false })
      return
    }
    fetchUser(token)
  }, [])

  const fetchUser = async (token: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (error || !user) throw new Error('Session invalid')
      const u: User = {
        id: user.id,
        email: user.email || '',
        nama: user.user_metadata?.nama || user.email?.split('@')[0] || '',
        foto_url: user.user_metadata?.foto_url,
        institusi: user.user_metadata?.institusi,
      }
      localStorage.setItem('nutricerta_user', JSON.stringify(u))
      setState({ user: u, token, loading: false })
    } catch {
      localStorage.removeItem('nutricerta_token')
      localStorage.removeItem('nutricerta_user')
      setState({ user: null, token: null, loading: false })
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Login gagal')

    localStorage.setItem('nutricerta_token', data.access_token)
    localStorage.setItem('nutricerta_user', JSON.stringify({
      id: data.user?.id || '',
      email: data.user?.email || email,
      nama: data.user?.user_metadata?.nama || email.split('@')[0],
    }))
    setState({
      user: { id: data.user?.id || '', email: data.user?.email || email },
      token: data.access_token,
      loading: false,
    })
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Registrasi gagal')
  }, [])

  const logout = useCallback(async () => {
    localStorage.removeItem('nutricerta_token')
    localStorage.removeItem('nutricerta_user')
    setState({ user: null, token: null, loading: false })
    window.location.href = '/login'
  }, [])

  const refreshSession = useCallback(async () => {
    const token = getStoredToken()
    if (token) await fetchUser(token)
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
