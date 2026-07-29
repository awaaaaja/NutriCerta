'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function AssessPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard')
  }, [])

  return (
    <ProtectedRoute>
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-[var(--color-muted-foreground)]">Mengarahkan ke Dashboard...</p>
      </div>
    </ProtectedRoute>
  )
}
