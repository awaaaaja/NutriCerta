import type { Metadata } from "next";
import { ClipboardList, UtensilsCrossed, BookOpen, LayoutDashboard, LogIn, LogOut, Users } from 'lucide-react';
import { AuthProvider } from '@/lib/auth-context';
import { NavbarClient } from './navbar-client';
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriCerta | Clinical Nutrition Assessment",
  description: "Sistem pakar gizi klinis berbasis PAGT Indonesia. Skrining MST, asesmen, diagnosis PES, preskripsi diet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <NavbarClient />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
