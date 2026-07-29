import { NextResponse } from 'next/server'

const NEWS_API_KEY = process.env.NEWS_API_KEY || ''

const fallbackNews = [
  { title: 'Pentingnya Skrining MST pada Pasien Rawat Inap', source: 'PERSAGI', url: '#', published_at: new Date().toISOString().split('T')[0], description: 'Malnutrition Screening Tool (MST) direkomendasikan untuk deteksi dini risiko malnutrisi pada pasien rumah sakit.' },
  { title: 'AKG Terbaru: Acuan Kebutuhan Gizi Populasi Indonesia', source: 'Kemenkes RI', url: '#', published_at: new Date().toISOString().split('T')[0], description: 'Angka Kecukupan Gizi yang ditetapkan dalam Permenkes No. 28 Tahun 2019 menjadi acuan utama dietisien.' },
  { title: 'Implementasi PAGT di Rumah Sakit Indonesia', source: 'Kemenkes RI', url: '#', published_at: new Date().toISOString().split('T')[0], description: 'Proses Asuhan Gizi Terstandar (PAGT) wajib diterapkan di seluruh fasilitas kesehatan di Indonesia.' },
  { title: 'Hubungan Status Gizi dan Lama Rawat Inap Pasien', source: 'PubMed', url: '#', published_at: new Date().toISOString().split('T')[0], description: 'Studi menunjukkan pasien dengan malnutrisi memiliki lama rawat inap 2-3 kali lebih panjang.' },
  { title: 'TKPI 2017: Database Komposisi Pangan Indonesia', source: 'Kemenkes RI', url: '#', published_at: new Date().toISOString().split('T')[0], description: 'Tabel Komposisi Pangan Indonesia mencakup lebih dari 1.000 bahan pangan lokal dengan nilai gizi lengkap.' },
  { title: 'Peran Dietisien dalam Tim Gizi Klinis', source: 'PERSAGI', url: '#', published_at: new Date().toISOString().split('T')[0], description: 'Dietisien memiliki peran krusial dalam skrining, asesmen, diagnosis, intervensi, dan monitoring gizi pasien.' },
]

export async function GET() {
  if (!NEWS_API_KEY) {
    return NextResponse.json(fallbackNews)
  }

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=gizi+nutrisi+rumah+sakit+Indonesia&language=id&sortBy=publishedAt&pageSize=6&apiKey=${NEWS_API_KEY}`
    )
    if (!res.ok) return NextResponse.json(fallbackNews)
    const data = await res.json()
    if (!data.articles?.length) return NextResponse.json(fallbackNews)
    return NextResponse.json(data.articles.map((a: any) => ({
      title: a.title,
      source: a.source?.name || 'News',
      url: a.url,
      published_at: a.publishedAt?.split('T')[0] || '',
      description: a.description || '',
      image: a.urlToImage,
    })))
  } catch {
    return NextResponse.json(fallbackNews)
  }
}
