export default function ApiDocsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-emerald-900 mb-6">API Documentation</h1>

      <div className="space-y-8 text-sm">
        <Section title="POST /api/assess/public" subtitle="Assessment gizi tanpa autentikasi">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`{
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
}`}
          </pre>
        </Section>

        <Section title="POST /api/auth/login" subtitle="Login via Supabase Auth">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`{
  "email": "ahligizi@rs.example.com",
  "password": "password123"
}`}
          </pre>
        </Section>

        <Section title="GET /api/foods" subtitle="Cari makanan TKPI">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`GET /api/foods?search=ayam&kelompok=Daging&limit=20`}
          </pre>
        </Section>

        <Section title="Response Assessment" subtitle="Format output dari POST /api/assess">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`{
  "skrining": { "skor": 4, "kategori": "RISIKO", ... },
  "imt": { "nilai": 23.4, "kategori": "NORMAL", ... },
  "kebutuhan": { "bee": 1132.8, "tee": 1472.6, ... },
  "diagnosis": [{ "problem": "NC-1.3", "pes_statement": "..." }],
  "preskripsi": [{ "diet": "DIET-DM", "deskripsi": "...", "rute": "ORAL" }],
  "monitoring": [{ "parameter": "Berat Badan", "frekuensi": "1x/minggu" }],
  "citations": [{ "source_id": "AKG-001", "rule": "...", "kutipan": "..." }]
}`}
          </pre>
        </Section>

        <p className="text-gray-400 text-xs">Full OpenAPI docs: <a href="http://localhost:8000/docs" className="text-emerald-600 underline">localhost:8000/docs</a></p>
      </div>
    </div>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-semibold text-emerald-800">{title}</h2>
      <p className="text-gray-500 text-xs mb-2">{subtitle}</p>
      {children}
    </div>
  )
}
