import { NextResponse } from 'next/server'

const NEWS_API_KEY = process.env.NEWS_API_KEY || ''

const curatedNews = [
  { title: 'Pentingnya Skrining MST pada Pasien Rawat Inap', source: 'PERSAGI', url: 'https://persagi.org/artikel/skrining-mst', published_at: '2026-07-15', description: 'Malnutrition Screening Tool (MST) direkomendasikan untuk deteksi dini risiko malnutrisi pada pasien rumah sakit.' },
  { title: 'AKG Terbaru: Acuan Kebutuhan Gizi Populasi Indonesia', source: 'Kemenkes RI', url: 'https://peraturan.bpk.go.id/Details/152092/permenkes-no-28-tahun-2019', published_at: '2026-07-10', description: 'Angka Kecukupan Gizi yang ditetapkan dalam Permenkes No. 28 Tahun 2019 menjadi acuan utama dietisien.' },
  { title: 'Implementasi PAGT di Rumah Sakit Indonesia', source: 'Kemenkes RI', url: 'https://repository.kemkes.go.id/book/53', published_at: '2026-07-08', description: 'Proses Asuhan Gizi Terstandar (PAGT) wajib diterapkan di seluruh fasilitas kesehatan di Indonesia.' },
  { title: 'Hubungan Status Gizi dan Lama Rawat Inap Pasien', source: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=malnutrition+length+of+stay+Indonesia', published_at: '2026-07-05', description: 'Studi menunjukkan pasien dengan malnutrisi memiliki lama rawat inap 2-3 kali lebih panjang.' },
  { title: 'TKPI 2017: Database Komposisi Pangan Indonesia', source: 'Kemenkes RI', url: 'https://www.panganku.org', published_at: '2026-07-01', description: 'Tabel Komposisi Pangan Indonesia mencakup lebih dari 1.000 bahan pangan lokal dengan nilai gizi lengkap.' },
  { title: 'Pedoman Gizi Rumah Sakit (PGRS) 2013', source: 'Kemenkes RI', url: 'https://peraturan.bpk.go.id/Details/112939/permenkes-no-78-tahun-2013', published_at: '2026-06-28', description: 'Permenkes No. 78 Tahun 2013 tentang Pedoman Pelayanan Gizi Rumah Sakit.' },
  { title: 'Peran Dietisien dalam Tim Gizi Klinis', source: 'PERSAGI', url: 'https://persagi.org/tentang', published_at: '2026-06-25', description: 'Dietisien memiliki peran krusial dalam skrining, asesmen, diagnosis, intervensi, dan monitoring gizi pasien.' },
  { title: 'Standar Akreditasi RS (SNARS) Bidang Gizi', source: 'KARS', url: 'https://kars.or.id/layanan/standar-nasional-akreditasi-rumah-sakit', published_at: '2026-06-20', description: 'SNARS mengatur standar pelayanan gizi di rumah sakit sebagai bagian dari akreditasi.' },
]

const queries = [
  { q: 'gizi', lang: 'id' },
  { q: 'malnutrition clinical hospital', lang: 'en' },
  { q: 'clinical nutrition dietetics', lang: 'en' },
]

async function fetchNews(query: string, lang: string) {
  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${lang}&sortBy=publishedAt&pageSize=6&apiKey=${NEWS_API_KEY}`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    return (data.articles || []).map((a: any) => ({
      title: a.title,
      source: a.source?.name || 'News',
      url: a.url,
      published_at: a.publishedAt?.split('T')[0] || '',
      description: a.description || '',
      image: a.urlToImage,
    }))
  } catch {
    return []
  }
}

export async function GET() {
  if (!NEWS_API_KEY) {
    return NextResponse.json(curatedNews)
  }

  const seen = new Set<string>()
  const merged: any[] = []

  for (const q of queries) {
    const items = await fetchNews(q.q, q.lang)
    for (const item of items) {
      const key = item.title?.toLowerCase().slice(0, 60) || ''
      if (!seen.has(key) && merged.length < 6) {
        seen.add(key)
        merged.push(item)
      }
    }
    if (merged.length >= 6) break
  }

  if (merged.length < 3) return NextResponse.json(curatedNews)

  return NextResponse.json(merged.slice(0, 6))
}
