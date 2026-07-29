import { BookOpen, Code, ArrowRight, User, ClipboardList, UtensilsCrossed } from 'lucide-react'
import { Card } from '@/components/ui'

const endpoints = [
  {
    icon: ClipboardList,
    title: 'POST /api/assess/public',
    subtitle: 'Assessment gizi tanpa autentikasi',
    code: `{
  "usia": 45,
  "bb": 60,
  "tb": 160,
  "jenis_kelamin": "wanita",
  "tingkat_aktivitas": "RINGAN",
  "mst_penurunan_bb": 3,
  "mst_nafsu_makan": 1,
  "diagnosis_medis": ["dm"],
  "keluhan": ["bb_turun"],
  "asupan_persen": 40,
  "albumin": 3.2,
  "gds": 180
}`,
  },
  {
    icon: User,
    title: 'POST /api/auth/login',
    subtitle: 'Login via Supabase Auth',
    code: `{
  "email": "ahligizi@rs.example.com",
  "password": "password123"
}`,
  },
  {
    icon: User,
    title: 'POST /api/auth/register',
    subtitle: 'Registrasi akun Ahli Gizi baru',
    code: `{
  "email": "ahligizi@rs.example.com",
  "password": "password123"
}`,
  },
  {
    icon: UtensilsCrossed,
    title: 'GET /api/foods',
    subtitle: 'Cari makanan TKPI',
    code: 'GET /api/foods?search=ayam&kelompok=Daging&limit=20',
  },
  {
    icon: UtensilsCrossed,
    title: 'GET /api/foods/kelompok/list',
    subtitle: 'Daftar kelompok pangan',
    code: 'GET /api/foods/kelompok/list',
  },
  {
    icon: UtensilsCrossed,
    title: 'GET /api/foods/:entity_id',
    subtitle: 'Detail makanan spesifik',
    code: 'GET /api/foods/entitas-tkpi-001',
  },
]

const responseExample = `{
  "skrining": { "skor": 4, "kategori": "RISIKO" },
  "imt": { "nilai": 23.4, "kategori": "NORMAL" },
  "kebutuhan": { "bee": 1132.8, "tee": 1472.6 },
  "diagnosis": [{ "problem": "NC-1.3", "pes_statement": "..." }],
  "preskripsi": [{ "diet": "DIET-DM", "deskripsi": "..." }],
  "monitoring": [{ "parameter": "Berat Badan", "frekuensi": "1x/minggu" }],
  "citations": [{ "source_id": "AKG-001", "rule": "...", "kutipan": "..." }]
}`

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-6 h-6 text-[var(--color-primary)]" />
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)]">API Documentation</h1>
      </div>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-8">
        Dokumentasi endpoint REST API NutriCerta. Semua endpoint bersitasi dari sumber resmi Kemenkes RI.
      </p>

      <div className="space-y-6">
        {endpoints.map((ep) => {
          const Icon = ep.icon
          return (
            <Card key={ep.title}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm text-[var(--color-foreground)]">{ep.title}</h2>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{ep.subtitle}</p>
                </div>
              </div>
              <pre className="bg-[var(--color-foreground)] text-gray-100 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed">
                {ep.code}
              </pre>
            </Card>
          )
        })}
      </div>

      <div className="mt-8">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <ClipboardList className="w-4 h-4 text-[var(--color-primary)]" />
            <h2 className="font-semibold text-sm text-[var(--color-foreground)]">Response Assessment</h2>
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-3">
            Format output dari POST /api/assess/public
          </p>
          <pre className="bg-[var(--color-foreground)] text-gray-100 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed">
            {responseExample}
          </pre>
        </Card>
      </div>
    </div>
  )
}
