import Link from 'next/link'
import {
  ClipboardList, Ruler, Zap, Search, Pill, Activity, ArrowRight, LogIn
} from 'lucide-react'

const features = [
  { icon: ClipboardList, title: 'Skrining MST', desc: 'Malnutrition Screening Tool -- 2 pertanyaan, threshold >= 2' },
  { icon: Ruler, title: 'Antropometri IMT', desc: 'Kalkulasi IMT + 5 kategori populasi Indonesia (Asia)' },
  { icon: Zap, title: 'Kebutuhan Gizi', desc: 'Mifflin-St Jeor + faktor aktivitas + AKG protein 57g' },
  { icon: Search, title: 'Diagnosis PES', desc: '42 kode PES domain NI/NC/NB -- format Problem-Etiology-Signs' },
  { icon: Pill, title: 'Preskripsi Diet', desc: '11 jenis diet berdasarkan diagnosis medis & kondisi pasien' },
  { icon: Activity, title: 'Monitoring', desc: '6 parameter monitoring dengan frekuensi & keterangan' },
]

const stats = [
  { value: '1.146', label: 'Item Makanan TKPI' },
  { value: '1.232', label: 'Entitas Tervalidasi' },
  { value: '86', label: 'Rule Klinis' },
  { value: '4', label: 'Sumber Tier 1' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-medium mb-6">
          <span className="status-dot bg-[var(--color-primary)]" />
          Berbasis Standar PAGT Indonesia
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-foreground)] mb-4 leading-tight">
          Clinical Nutrition Assessment
        </h1>
        <p className="text-[var(--color-muted-foreground)] max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
          Sistem pakar gizi klinis untuk skrining MST, asesmen 5 domain, diagnosis PES,
          kalkulasi kebutuhan energi, preskripsi diet, dan monitoring -- semua bersitasi
          dari sumber resmi Kemenkes RI.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition"
          >
            Masuk ke Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div key={s.label} className="clinical-card text-center py-4 sm:py-6">
              <div className="text-xl sm:text-2xl font-bold text-[var(--color-primary)]">{s.value}</div>
              <div className="text-xs text-[var(--color-muted-foreground)] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)] mb-6 sm:mb-8 text-center">
          Modul Klinis
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="clinical-card hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-semibold text-[var(--color-foreground)] mb-1">{f.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-6">Mulai Sekarang</h2>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition"
          >
            <LogIn className="w-4 h-4" /> Masuk ke Dashboard
          </Link>
          <p className="mt-4 text-xs text-[var(--color-muted-foreground)]">
            Login dengan akun Ahli Gizi untuk mengakses semua fitur.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-xs sm:text-sm text-[var(--color-muted-foreground)]">
          <p className="mb-4">
            <strong className="text-[var(--color-foreground)]">Sumber data:</strong> Permenkes AKG No. 28/2019, PGRS No. 78/2013,
            PAGT 2014, TKPI 2018, IDNT/NCPT, SNARS 2024.
          </p>
          <p>
            {stats[0].value} item makanan real dari TKPI Kemenkes RI
            <span className="mx-2 text-[var(--color-border)]">|</span>
            {stats[1].label}
            <span className="mx-2 text-[var(--color-border)]">|</span>
            {stats[2].value} rule klinis berbasis sumber Tier 1
          </p>
        </div>
      </section>
    </div>
  )
}
