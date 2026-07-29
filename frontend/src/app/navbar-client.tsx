'use client'

import { ClipboardList, UtensilsCrossed, BookOpen, LayoutDashboard, LogIn, LogOut, Users, BarChart3 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Avatar } from '@/components/ui'

export function NavbarClient() {
  const { user, logout } = useAuth()
  const isLoggedIn = !!user

  return (
    <header className="border-b border-[var(--color-border)] bg-white/90 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm">
              NC
            </div>
            <span className="font-semibold text-base sm:text-lg text-[var(--color-foreground)]">
              NutriCerta
            </span>
          </a>
          <nav className="flex items-center gap-1 sm:gap-2">
            {isLoggedIn ? (
              <>
                <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavLink href="/patients" icon={Users} label="Pasien" />
                <NavLink href="/reports" icon={BarChart3} label="Laporan" />
                <NavLink href="/foods" icon={UtensilsCrossed} label="Makanan" />
                <NavLink href="/api-docs" icon={BookOpen} label="Dokumentasi" />
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[var(--color-border)]">
                  <a href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <Avatar name={user.nama || user.email} size="sm" />
                  </a>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive-light)] transition cursor-pointer"
                    title="Keluar"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink href="/" icon={undefined} label="Beranda" />
                <NavLink href="/login" icon={LogIn} label="Login" />
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, icon: Icon, label }: { href: string; icon?: any; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium
        text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]
        hover:bg-[var(--color-muted)] transition duration-150"
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span className="hidden sm:inline">{label}</span>
    </a>
  )
}
