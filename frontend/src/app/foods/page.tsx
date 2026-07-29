'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type FoodItem = {
  entity_id: string
  nama: string
  nama_latin?: string
  kelompok_pangan: string
  energi_kal: number
  protein_g: number
  lemak_g: number
  karbohidrat_g: number
  serat_g?: number
  bdd_persen?: number
}

export default function FoodsPage() {
  const [kelompokList, setKelompokList] = useState<string[]>([])
  const [selectedKelompok, setSelectedKelompok] = useState('')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/foods/kelompok/list`)
      .then(r => r.json())
      .then(d => setKelompokList(d.kelompok || []))
      .catch(() => {})
  }, [])

  const searchFoods = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (search) params.set('search', search)
      if (selectedKelompok) params.set('kelompok', selectedKelompok)
      const res = await fetch(`${API_URL}/api/foods?${params}`)
      const data = await res.json()
      setItems(data.data || [])
    } catch { setItems([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { searchFoods() }, [selectedKelompok])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-emerald-900 mb-6">Database Makanan TKPI</h1>
      <p className="text-sm text-gray-500 mb-6">1.146 item makanan real dari TKPI Kemenkes RI.</p>

      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchFoods()}
          placeholder="Cari nama makanan..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          value={selectedKelompok}
          onChange={(e) => setSelectedKelompok(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Semua kelompok</option>
          {kelompokList.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <button
          onClick={searchFoods}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          Cari
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {loading ? (
            <p className="text-gray-400 text-sm">Mencari...</p>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div
                  key={item.entity_id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-lg border cursor-pointer transition text-sm ${
                    selectedItem?.entity_id === item.entity_id
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-white border-gray-100 hover:border-emerald-200'
                  }`}
                >
                  <div className="font-medium text-gray-800">{item.nama}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{item.kelompok_pangan}</div>
                </div>
              ))}
              {items.length === 0 && <p className="text-gray-400 text-sm">Tidak ditemukan.</p>}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border text-sm h-fit sticky top-20">
          {selectedItem ? (
            <>
              <h3 className="font-semibold text-emerald-900 mb-3">{selectedItem.nama}</h3>
              {selectedItem.nama_latin && <p className="text-gray-400 text-xs mb-2">{selectedItem.nama_latin}</p>}
              <table className="w-full text-xs">
                <tbody>
                  {[
                    ['Kelompok', selectedItem.kelompok_pangan],
                    ['BDD', selectedItem.bdd_persen ? `${selectedItem.bdd_persen}%` : '-'],
                    ['Energi', `${selectedItem.energi_kal} kkal`],
                    ['Protein', `${selectedItem.protein_g} g`],
                    ['Lemak', `${selectedItem.lemak_g} g`],
                    ['Karbohidrat', `${selectedItem.karbohidrat_g} g`],
                    ['Serat', selectedItem.serat_g ? `${selectedItem.serat_g} g` : '-'],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b last:border-0">
                      <td className="py-1.5 text-gray-500">{k}</td>
                      <td className="py-1.5 font-medium text-right">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[10px] text-gray-400 mt-3">Sumber: TKPI Kemenkes RI via panganku.org</p>
            </>
          ) : (
            <p className="text-gray-400 text-sm">Pilih makanan untuk detail</p>
          )}
        </div>
      </div>
    </div>
  )
}
