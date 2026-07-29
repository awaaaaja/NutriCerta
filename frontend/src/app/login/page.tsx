'use client'

import { useState, useEffect } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { user, login, register, loading: authLoading } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/dashboard')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const r = params.get('redirect')
      if (r) setRedirectTo(r)
    }
  }, [])

  useEffect(() => {
    if (user && !authLoading) {
      window.location.href = redirectTo
    }
  }, [user, authLoading, redirectTo])

  if (authLoading) return null
  if (user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMsg('')
    try {
      if (mode === 'login') {
        await login(email, password)
        window.location.href = redirectTo
      } else {
        await register(email, password)
        setMsg('Registrasi berhasil! Silakan cek email untuk verifikasi.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">NC</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">
            {mode === 'login' ? 'Masuk' : 'Daftar Akun'}
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            {mode === 'login'
              ? 'Masuk ke dashboard NutriCerta'
              : 'Buat akun Ahli Gizi baru'}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              placeholder="ahligizi@rs.example.com" />

            <Input label="Password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={6}
              placeholder="Minimal 6 karakter" />

            <Button type="submit" loading={loading} className="w-full">
              {mode === 'login' ? <><LogIn className="w-4 h-4" /> Masuk</> : <><UserPlus className="w-4 h-4" /> Daftar</>}
            </Button>

            {error && <div className="p-3 rounded-lg bg-[var(--color-destructive-light)] text-[var(--color-destructive)] text-xs">{error}</div>}
            {msg && <div className="p-3 rounded-lg bg-[var(--color-success-light)] text-[var(--color-success)] text-xs">{msg}</div>}
          </form>

          <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-center">
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {mode === 'login' ? (
                <>Belum punya akun? <button type="button" onClick={() => setMode('register')} className="text-[var(--color-primary)] underline font-medium cursor-pointer">Daftar</button></>
              ) : (
                <>Sudah punya akun? <button type="button" onClick={() => setMode('login')} className="text-[var(--color-primary)] underline font-medium cursor-pointer">Masuk</button></>
              )}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
