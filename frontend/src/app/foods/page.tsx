'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, UtensilsCrossed, Filter, X } from 'lucide-react'
import { Card, Button, StatusBadge } from '@/components/ui'
import { ProtectedRoute } from '@/components/auth/protected-route'

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
  const [total, setTotal] = useState(0)
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null)
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    fetch('/api/foods/kelompok/list')
      .then(r => r.json())
      .then(d => setKelompokList(d.kelompok || []))
      .catch(() => {})
  }, [])

  const searchFoods = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (search) params.set('search', search)
      if (selectedKelompok) params.set('kelompok', selectedKelompok)
      const res = await fetch(`/api/foods?${params}`)
      const d = await res.json()
      setItems(d.data || [])
      setTotal(d.total || 0)
    } catch { setItems([]); setTotal(0) }
    finally { setLoading(false) }
  }, [search, selectedKelompok])

  useEffect(() => { searchFoods() }, [searchFoods])

  return (
    <ProtectedRoute>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-2">
        <UtensilsCrossed className="w-6 h-6 text-[var(--color-primary)]" />
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)]">Database Makanan TKPI</h1>
      </div>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-6">
        {total > 0 ? `${total.toLocaleString('id-ID')} item makanan real dari TKPI Kemenkes RI.` : 'Memuat data...'}
      </p>

      <div className="flex gap-2 sm:gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchFoods()}
            placeholder="Cari nama makanan..."
            className="clinical-input pl-9"
          />
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`px-3 py-2.5 rounded-lg border transition cursor-pointer ${
            showFilter || selectedKelompok
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
              : 'bg-white border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
          }`}
          aria-label="Filter kelompok"
        >
          <Filter className="w-4 h-4" />
        </button>
        <Button onClick={searchFoods} loading={loading}>
          Cari
        </Button>
      </div>

      {showFilter && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-lg bg-[var(--color-muted)]">
          <button
            onClick={() => { setSelectedKelompok(''); setShowFilter(false) }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              !selectedKelompok
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-white text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
            }`}
          >
            Semua
          </button>
          {kelompokList.map((k) => (
            <button
              key={k}
              onClick={() => { setSelectedKelompok(k); setShowFilter(false) }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                selectedKelompok === k
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          {loading ? (
            <div className="text-sm text-[var(--color-muted-foreground)]">Mencari...</div>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1 sm:pr-2">
              {items.map((item) => (
                <button
                  key={item.entity_id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left p-3 rounded-lg border transition text-sm cursor-pointer ${
                    selectedItem?.entity_id === item.entity_id
                      ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)]'
                      : 'bg-white border-[var(--color-border)] hover:border-[var(--color-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--color-foreground)]">{item.nama}</span>
                    {item.nama_latin && (
                      <span className="text-[var(--color-muted-foreground)] text-xs italic hidden sm:inline">
                        {item.nama_latin}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[var(--color-muted-foreground)] text-xs">{item.kelompok_pangan}</span>
                    <span className="text-[var(--color-muted-foreground)] text-xs">
                      {item.energi_kal} kkal
                    </span>
                  </div>
                </button>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-[var(--color-muted-foreground)]">Tidak ditemukan.</p>
              )}
            </div>
          )}
        </div>

        <div className="hidden sm:block">
          <div className="clinical-card sticky top-20">
            {selectedItem ? (
              <>
                <h3 className="font-semibold text-[var(--color-foreground)] mb-1">{selectedItem.nama}</h3>
                {selectedItem.nama_latin && (
                  <p className="text-[var(--color-muted-foreground)] text-xs italic mb-3">{selectedItem.nama_latin}</p>
                )}
                <StatusBadge status="info" label={selectedItem.kelompok_pangan} size="sm" />
                <table className="w-full text-xs mt-4">
                  <tbody>
                    {[
                      ['BDD', selectedItem.bdd_persen ? `${selectedItem.bdd_persen}%` : '-'],
                      ['Energi', `${selectedItem.energi_kal} kkal`],
                      ['Protein', `${selectedItem.protein_g} g`],
                      ['Lemak', `${selectedItem.lemak_g} g`],
                      ['Karbohidrat', `${selectedItem.karbohidrat_g} g`],
                      ['Serat', selectedItem.serat_g ? `${selectedItem.serat_g} g` : '-'],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-b border-[var(--color-border)] last:border-0">
                        <td className="py-1.5 text-[var(--color-muted-foreground)]">{k}</td>
                        <td className="py-1.5 font-medium text-right text-[var(--color-foreground)]">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[10px] text-[var(--color-muted-foreground)] mt-3">
                  Sumber: TKPI Kemenkes RI via panganku.org
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <UtensilsCrossed className="w-8 h-8 text-[var(--color-muted-foreground)] mb-2" />
                <p className="text-sm text-[var(--color-muted-foreground)]">Pilih makanan untuk detail</p>
              </div>
            )}
          </div>
        </div>

        {selectedItem && (
          <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-xl shadow-lg border-t border-[var(--color-border)] p-4 max-h-[60vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[var(--color-foreground)]">{selectedItem.nama}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-md text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {selectedItem.nama_latin && (
              <p className="text-[var(--color-muted-foreground)] text-xs italic mb-2">{selectedItem.nama_latin}</p>
            )}
            <StatusBadge status="info" label={selectedItem.kelompok_pangan} size="sm" />
            <table className="w-full text-xs mt-3">
              <tbody>
                {[
                  ['BDD', selectedItem.bdd_persen ? `${selectedItem.bdd_persen}%` : '-'],
                  ['Energi', `${selectedItem.energi_kal} kkal`],
                  ['Protein', `${selectedItem.protein_g} g`],
                  ['Lemak', `${selectedItem.lemak_g} g`],
                  ['Karbohidrat', `${selectedItem.karbohidrat_g} g`],
                  ['Serat', selectedItem.serat_g ? `${selectedItem.serat_g} g` : '-'],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-1.5 text-[var(--color-muted-foreground)]">{k}</td>
                    <td className="py-1.5 font-medium text-right text-[var(--color-foreground)]">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-[var(--color-muted-foreground)] mt-3">Sumber: TKPI Kemenkes RI via panganku.org</p>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  )
}
