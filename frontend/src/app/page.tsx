import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">NC</div>
            <span className="font-semibold text-lg text-emerald-900">NutriCerta</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <a href="#features" className="text-gray-600 hover:text-emerald-700">Fitur</a>
            <a href="#about" className="text-gray-600 hover:text-emerald-700">Tentang</a>
          </nav>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 pt-24 pb-16 text-center">
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">
          Clinical Nutrition Assessment
          <span className="block text-emerald-600">Berbasis Standar PAGT Indonesia</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Sistem pakar gizi klinis untuk skrining MST, asesmen 5 domain, diagnosis PES,
          kalkulasi kebutuhan energi, preskripsi diet, dan monitoring — semua bersitasi
          dari sumber resmi Kemenkes RI.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/assess"
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
          >
            Mulai Assessment
          </Link>
          <Link
            href="/api-docs"
            className="px-6 py-3 border border-emerald-200 text-emerald-700 rounded-xl font-medium hover:bg-emerald-50 transition"
          >
            API Docs
          </Link>
        </div>
      </section>

      <section id="features" className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-emerald-900 mb-8 text-center">Modul Klinis</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '📋', title: 'Skrining MST', desc: 'Malnutrition Screening Tool — 2 pertanyaan, threshold ≥ 2' },
            { icon: '📏', title: 'Antropometri IMT', desc: 'Kalkulasi IMT + 5 kategori populasi Indonesia (Asia)' },
            { icon: '⚡', title: 'Kebutuhan Gizi', desc: 'Mifflin-St Jeor + faktor aktivitas + AKG protein 57g' },
            { icon: '🔍', title: 'Diagnosis PES', desc: '42 kode PES domain NI/NC/NB — format Problem-Etiology-Signs' },
            { icon: '💊', title: 'Preskripsi Diet', desc: '11 jenis diet berdasarkan diagnosis medis & kondisi pasien' },
            { icon: '📊', title: 'Monitoring', desc: '6 parameter monitoring dengan frekuensi & keterangan' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-emerald-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="border-t bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-sm text-gray-500">
          <p className="mb-4">
            <strong className="text-gray-700">Sumber data:</strong> Permenkes AKG No. 28/2019, PGRS No. 78/2013,
            PAGT 2014, TKPI 2018, IDNT/NCPT, SNARS 2024.
          </p>
          <p>
            1.146 item makanan real dari TKPI Kemenkes RI &bull; 1.232 entitas tervalidasi Ahli Gizi
            &bull; 86 rule klinis berbasis sumber Tier 1
          </p>
        </div>
      </section>
    </div>
  )
}
