'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      const redirect = encodeURIComponent(pathname)
      router.push(`/login?redirect=${redirect}`)
    }
  }, [user, loading, router, pathname])

  if (loading) return <div className="p-8 text-sm text-[var(--color-muted-foreground)]">Memuat...</div>
  if (!user) return null

  return <>{children}</>
}
