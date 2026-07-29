'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  ClipboardList, Ruler, Zap, Search, Pill, Activity, ArrowRight,
  LogIn, Shield, BookOpen, ExternalLink, Newspaper, ChevronRight,
  BarChart3, Users, Database, Award
} from 'lucide-react'

const features = [
  { icon: ClipboardList, title: 'Skrining MST', desc: 'Malnutrition Screening Tool -- 2 pertanyaan, threshold >= 2, deteksi risiko malnutrisi dalam 3 menit.', color: 'from-cyan-500 to-blue-500' },
  { icon: Ruler, title: 'Antropometri IMT', desc: 'Kalkulasi IMT otomatis dengan 5 kategori populasi Asia. Hitung BEE Mifflin-St Jeor dan TEE.', color: 'from-emerald-500 to-teal-500' },
  { icon: Zap, title: 'Kebutuhan Gizi', desc: 'Estimasi kebutuhan energi dan protein berdasarkan usia, BB, TB, aktivitas, dan kondisi klinis.', color: 'from-violet-500 to-purple-500' },
  { icon: Search, title: 'Diagnosis PES', desc: '42 kode diagnosis PES domain Intake, Clinical, Behavioral -- format Problem-Etiology-Signs.', color: 'from-orange-500 to-amber-500' },
  { icon: Pill, title: 'Preskripsi Diet', desc: '11 jenis diet sesuai diagnosis medis: DM, jantung, ginjal, TETP, dan lainnya dengan rute pemberian.', color: 'from-rose-500 to-pink-500' },
  { icon: Activity, title: 'Monitoring & Evaluasi', desc: '6 parameter monitoring standar: BB, asupan, albumin, GDS, status hidrasi, keluhan GI.', color: 'from-sky-500 to-indigo-500' },
]

const statItems = [
  { icon: Database, value: 1146, suffix: '', label: 'Item Makanan TKPI', desc: 'Data real dari Tabel Komposisi Pangan Indonesia Kemenkes RI' },
  { icon: Award, value: 1232, suffix: '', label: 'Entitas Tervalidasi', desc: 'Knowledge entities tervalidasi Ahli Gizi dengan sitasi lengkap' },
  { icon: Shield, value: 86, suffix: '', label: 'Rule Klinis', desc: 'Aturan berbasis sumber Tier 1: Permenkes, PGRS, PAGT, IDNT' },
  { icon: BarChart3, value: 6, suffix: '', label: 'Modul PAGT', desc: 'Skrining, Asesmen, Diagnosis, Intervensi, Monitoring, Discharge' },
]

const heroImages = [
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&q=80',
]

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || counted.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(ease * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

function AnimatedStat({ icon: Icon, value, suffix, label, desc, delay }: {
  icon: any; value: number; suffix: string; label: string; desc: string; delay: number
}) {
  const { count, ref } = useCountUp(value)

  return (
    <div
      ref={ref}
      className="group relative bg-white rounded-2xl border border-[var(--color-border)] p-6 sm:p-8 text-center hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-500 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[var(--color-primary-light)] to-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-[var(--color-primary)]" />
      </div>
      <div className="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-1 tabular-nums">
        {count.toLocaleString('id-ID')}{suffix}
      </div>
      <div className="text-sm font-medium text-[var(--color-foreground)] mb-1">{label}</div>
      <div className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">{desc}</div>
    </div>
  )
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!els.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [news, setNews] = useState<any[] | null>(null)

  useScrollReveal()

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch('/api/news').then(r => r.json()).then(setNews).catch(() => {})
  }, [])

  const heroBg = heroImages[heroIndex]

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
        {heroImages.map((img, i) => (
          <div
            key={img}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIndex ? 1 : 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{
                backgroundImage: `url(${img})`,
                transform: i === heroIndex ? 'scale(1)' : 'scale(1.05)',
                transition: 'transform 6s ease-out',
              }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/70 to-[#0F172A]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F0F9FF]/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-medium mb-6 border border-white/20 animate-fade-in-up">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
              Berbasis Standar PAGT Indonesia
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-[1.1] tracking-tight animate-fade-in-up stagger-1">
              Clinical Nutrition
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300">
                Assessment System
              </span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed animate-fade-in-up stagger-2">
              Sistem pakar gizi klinis untuk skrining MST, asesmen 5 domain, diagnosis PES,
              kalkulasi kebutuhan energi, preskripsi diet, dan monitoring. Semua bersitasi
              dari sumber resmi Kemenkes RI.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[var(--color-primary)]/25 transition-all duration-300 active:scale-[0.98]"
              >
                Masuk ke Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-md text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <BookOpen className="w-4 h-4" />
                Lihat Modul Klinis
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-background)] to-transparent pointer-events-none" />
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 relative z-10 pb-16 sm:pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statItems.map((s, i) => (
            <AnimatedStat key={s.label} {...s} delay={i * 100} />
          ))}
        </div>
      </section>

      {/* Trusted */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-10" data-reveal style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-medium mb-4">
            <Shield className="w-3 h-3" />
            Berstandar & Tervalidasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] mb-3">
            Dibangun di Atas Standar Resmi
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] max-w-xl mx-auto">
            Setiap modul, rule, dan rekomendasi dikutip dari dokumen resmi Kemenkes RI
            dan standar profesi dietisien Indonesia.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-reveal style={{ opacity: 0 }}>
          {[
            { initials: 'AKG', name: 'Permenkes No. 28/2019', desc: 'Angka Kecukupan Gizi' },
            { initials: 'PGRS', name: 'Permenkes No. 78/2013', desc: 'Pedoman Gizi RS' },
            { initials: 'PAGT', name: 'PAGT 2014', desc: 'Proses Asuhan Gizi Terstandar' },
            { initials: 'TKPI', name: 'TKPI 2018', desc: 'Tabel Komposisi Pangan Indonesia' },
          ].map((s, i) => (
            <div key={s.initials} className="clinical-card text-center py-4 sm:py-5 hover:border-[var(--color-primary)]/30 transition-all duration-300">
              <div className="text-lg sm:text-xl font-bold text-[var(--color-primary)] mb-1">{s.initials}</div>
              <div className="text-xs font-medium text-[var(--color-foreground)]">{s.name}</div>
              <div className="text-[10px] sm:text-xs text-[var(--color-muted-foreground)] mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white border-y border-[var(--color-border)] py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12" data-reveal style={{ opacity: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-medium mb-4">
              <ClipboardList className="w-3 h-3" />
              Modul Klinis PAGT
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] mb-3">
              6 Langkah Proses Asuhan Gizi Terstandar
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] max-w-xl mx-auto">
              Dari skrining hingga discharge -- seluruh alur PAGT didukung oleh rule engine
              berbasis sumber resmi dengan sitasi otomatis.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="group relative bg-white rounded-2xl border border-[var(--color-border)] p-6 hover:shadow-xl hover:border-transparent transition-all duration-500"
                  data-reveal
                  style={{ opacity: 0, animationDelay: `${i * 100}ms` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-white to-[var(--color-primary-light)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-[1]">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-[var(--color-foreground)] mb-2">{f.title}</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12" data-reveal style={{ opacity: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-medium mb-4">
              <Newspaper className="w-3 h-3" />
              Berita & Artikel Gizi
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] mb-3">
              Update Riset & Kebijakan Gizi Klinis
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] max-w-xl mx-auto">
              Kurasi berita dan artikel terbaru seputar gizi klinis, kebijakan kesehatan,
              dan riset nutrisi dari sumber terpercaya.
            </p>
          </div>
          {news === null ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {news.map((item: any, i: number) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-2xl border border-[var(--color-border)] p-5 hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-300"
                  data-reveal
                  style={{ opacity: 0, animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)] mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-[var(--color-muted)] font-medium">{item.source || 'Sumber'}</span>
                    <span>{item.published_at}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-[var(--color-foreground)] mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-[var(--color-primary)] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Baca selengkapnya <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center" data-reveal style={{ opacity: 0 }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Siap Mengoptimalkan Asuhan Gizi Pasien?
          </h2>
          <p className="text-base text-white/80 mb-8 max-w-lg mx-auto">
            Mulai skrining, asesmen, diagnosis, intervensi, monitoring, dan discharge
            dengan sistem yang terstandar, bersitasi, dan tervalidasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[var(--color-primary)] rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <LogIn className="w-4 h-4" />
              Masuk ke Dashboard
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-md text-white rounded-xl font-medium border border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              Pelajari Modul
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[var(--color-border)] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-8 pb-8 border-b border-[var(--color-border)]">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold">NC</div>
                <span className="font-bold text-[var(--color-foreground)]">NutriCerta</span>
              </div>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                Sistem pakar gizi klinis untuk membantu Ahli Gizi dan Dietisien
                dalam memberikan asuhan gizi terstandar di fasilitas kesehatan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[var(--color-foreground)] mb-3">Sumber Data</h4>
              <ul className="space-y-1.5 text-xs text-[var(--color-muted-foreground)]">
                <li>Permenkes AKG No. 28/2019</li>
                <li>PGRS No. 78/2013</li>
                <li>PAGT 2014 (Kemenkes RI)</li>
                <li>TKPI 2018 (Kemenkes RI)</li>
                <li>IDNT / NCPT (Academy of Nutrition)</li>
                <li>SNARS / KMK 1596/2024</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[var(--color-foreground)] mb-3">Teknologi</h4>
              <ul className="space-y-1.5 text-xs text-[var(--color-muted-foreground)]">
                <li>Next.js 16 + TypeScript</li>
                <li>Supabase (PostgreSQL + Auth)</li>
                <li>Tailwind CSS v4</li>
                <li>Rule Engine berbasis standar klinis</li>
              </ul>
            </div>
          </div>
          <div className="pt-4 text-center text-[10px] sm:text-xs text-[var(--color-muted-foreground)]">
            NutriCerta -- Clinical Nutrition Assessment System. Hak cipta sesuai ketentuan yang berlaku.
          </div>
        </div>
      </footer>

    </div>
  )
}
