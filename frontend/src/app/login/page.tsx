'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMsg('')

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Gagal')
      if (mode === 'login') {
        localStorage.setItem('nutricerta_token', data.access_token)
        setMsg('Login berhasil!')
        window.location.href = '/assess'
      } else {
        setMsg('Registrasi berhasil! Silakan cek email untuk verifikasi.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 pt-16">
      <h1 className="text-xl font-bold text-emerald-900 text-center mb-6">
        {mode === 'login' ? 'Masuk' : 'Daftar Akun'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Email</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Password</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            required minLength={6}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition text-sm"
        >
          {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
        </button>

        {error && <p className="text-red-600 text-xs">{error}</p>}
        {msg && <p className="text-emerald-600 text-xs">{msg}</p>}

        <p className="text-xs text-gray-500 text-center">
          {mode === 'login' ? (
            <>Belum punya akun? <button type="button" onClick={() => setMode('register')} className="text-emerald-600 underline">Daftar</button></>
          ) : (
            <>Sudah punya akun? <button type="button" onClick={() => setMode('login')} className="text-emerald-600 underline">Masuk</button></>
          )}
        </p>
      </form>
    </div>
  )
}
