import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriCerta — Clinical Nutrition Assessment",
  description: "Sistem pakar gizi klinis berbasis PAGT Indonesia. Skrining MST, asesmen, diagnosis PES, preskripsi diet.",
};

function Navbar() {
  return (
    <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">NC</div>
          <span className="font-semibold text-emerald-900">NutriCerta</span>
        </a>
        <nav className="flex gap-4 text-sm items-center">
          <a href="/assess" className="text-gray-600 hover:text-emerald-700">Assessment</a>
          <a href="/foods" className="text-gray-600 hover:text-emerald-700">Makanan</a>
          <a href="/login" className="text-gray-600 hover:text-emerald-700">Login</a>
        </nav>
      </div>
    </header>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
