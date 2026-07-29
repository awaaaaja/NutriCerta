'use client'

import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-nutricerta.vercel.app'

export default function AssessPage() {
  const [form, setForm] = useState({
    usia: 45,
    bb: 60,
    tb: 160,
    jenis_kelamin: 'wanita',
    tingkat_aktivitas: 'RINGAN',
    mst_penurunan_bb: '',
    mst_nafsu_makan: '',
    diagnosis_medis: '',
    keluhan: '',
    asupan_persen: '',
    albumin: '',
    gds: '',
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    const body: any = {
      usia: Number(form.usia),
      bb: Number(form.bb),
      tb: Number(form.tb),
      jenis_kelamin: form.jenis_kelamin,
      tingkat_aktivitas: form.tingkat_aktivitas,
      diagnosis_medis: form.diagnosis_medis ? form.diagnosis_medis.split(',').map(s => s.trim()) : [],
      keluhan: form.keluhan ? form.keluhan.split(',').map(s => s.trim()) : [],
    }
    if (form.mst_penurunan_bb !== '') body.mst_penurunan_bb = Number(form.mst_penurunan_bb)
    if (form.mst_nafsu_makan !== '') body.mst_nafsu_makan = Number(form.mst_nafsu_makan)
    if (form.asupan_persen !== '') body.asupan_persen = Number(form.asupan_persen)
    if (form.albumin !== '') body.albumin = Number(form.albumin)
    if (form.gds !== '') body.gds = Number(form.gds)

    try {
      const res = await fetch(`${API_URL}/api/assess/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(await res.text())
      setResult(await res.json())
    } catch (err: any) {
      setError(err.message || 'Assessment gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-emerald-900 mb-6">Assessment Gizi Klinis</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
            <h2 className="font-semibold text-emerald-800">Data Pasien</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Usia (tahun)" name="usia" value={form.usia} onChange={handleChange} type="number" />
              <Select label="Jenis Kelamin" name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} options={['pria', 'wanita']} />
              <Input label="BB (kg)" name="bb" value={form.bb} onChange={handleChange} type="number" />
              <Input label="TB (cm)" name="tb" value={form.tb} onChange={handleChange} type="number" />
              <Select label="Aktivitas" name="tingkat_aktivitas" value={form.tingkat_aktivitas} onChange={handleChange} options={['TB', 'RINGAN', 'SEDANG']} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
            <h2 className="font-semibold text-emerald-800">Skrining MST</h2>
            <Select
              label="Q1: Penurunan BB?"
              name="mst_penurunan_bb"
              value={String(form.mst_penurunan_bb)}
              onChange={(e: any) => setForm({...form, mst_penurunan_bb: e.target.value})}
              options={[
                { label: 'Tidak diisi', value: '' },
                { label: 'Tidak yakin (skor 2)', value: '2' },
                { label: 'Ya, 0.5-5 kg (skor 1)', value: '1' },
                { label: 'Ya, 6-10 kg (skor 2)', value: '2' },
                { label: 'Ya, 11-15 kg (skor 3)', value: '3' },
                { label: 'Ya, >15 kg (skor 4)', value: '4' },
              ]}
            />
            <Select
              label="Q2: Nafsu makan menurun?"
              name="mst_nafsu_makan"
              value={String(form.mst_nafsu_makan)}
              onChange={(e) => setForm({...form, mst_nafsu_makan: e.target.value})}
              options={[
                { label: 'Tidak diisi', value: '' },
                { label: 'Tidak (skor 0)', value: '0' },
                { label: 'Ya (skor 1)', value: '1' },
              ]}
            />
            <Input label="Asupan (% dari kebutuhan)" name="asupan_persen" value={form.asupan_persen} onChange={handleChange} type="number" />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
            <h2 className="font-semibold text-emerald-800">Diagnosis Medis & Lab</h2>
            <Input label="Diagnosis medis (koma untuk banyak)" name="diagnosis_medis" value={form.diagnosis_medis} onChange={handleChange} placeholder="dm, hipertensi" />
            <Input label="Keluhan (koma untuk banyak)" name="keluhan" value={form.keluhan} onChange={handleChange} placeholder="bb_turun, nafsu_makan_turun" />
            <Input label="Albumin (g/dL)" name="albumin" value={form.albumin} onChange={handleChange} type="number" step="0.1" />
            <Input label="GDS (mg/dL)" name="gds" value={form.gds} onChange={handleChange} type="number" />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {loading ? 'Memproses...' : 'Jalankan Assessment'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-bold text-emerald-900">Hasil Assessment</h2>

            <div className="grid md:grid-cols-3 gap-4">
              {result.skrining && <ResultCard title="Skrining MST" items={[
                ['Skor', String(result.skrining.skor)],
                ['Kategori', result.skrining.kategori],
                ['Interpretasi', result.skrining.interpretasi],
              ]} />}
              {result.imt && <ResultCard title="IMT" items={[
                ['Nilai', String(result.imt.nilai)],
                ['Kategori', result.imt.kategori],
                ['Status', result.imt.interpretasi],
              ]} />}
              {result.kebutuhan && <ResultCard title="Kebutuhan Gizi" items={[
                ['BEE', `${result.kebutuhan.bee} kkal/hari`],
                ['TEE', `${result.kebutuhan.tee} kkal/hari`],
                ['Protein', `${result.kebutuhan.protein} g/hari`],
              ]} />}
            </div>

            {result.diagnosis?.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-emerald-800 mb-3">Diagnosis PES</h3>
                {result.diagnosis.map((d: any, i: number) => (
                  <div key={i} className="p-3 bg-emerald-50 rounded-lg text-sm mb-2">
                    <p className="font-medium text-emerald-900">{d.pes_statement}</p>
                    <p className="text-gray-500 text-xs mt-1">Domain: {d.domain} | Problem: {d.problem}</p>
                  </div>
                ))}
              </div>
            )}

            {result.preskripsi?.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-emerald-800 mb-3">Preskripsi Diet</h3>
                <div className="space-y-2">
                  {result.preskripsi.map((p: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg text-sm">
                      <span className="px-2 py-1 bg-emerald-200 text-emerald-800 rounded text-xs font-medium">{p.diet}</span>
                      <span className="text-gray-600">{p.deskripsi}</span>
                      <span className="ml-auto text-gray-400 text-xs">Rute: {p.rute}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.monitoring?.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-emerald-800 mb-3">Monitoring</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2">Parameter</th>
                      <th className="pb-2">Frekuensi</th>
                      <th className="pb-2">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.monitoring.map((m: any, i: number) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 font-medium">{m.parameter}</td>
                        <td className="py-2 text-gray-600">{m.frekuensi}</td>
                        <td className="py-2 text-gray-500 text-xs">{m.keterangan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {result.citations?.length > 0 && (
              <details className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
                <summary className="cursor-pointer font-medium text-gray-700">Sitasi ({result.citations.length})</summary>
                <ul className="mt-3 space-y-1">
                  {result.citations.map((c: any, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-600 shrink-0">[{c.source_id}]</span>
                      <span>{c.rule}: {c.kutipan}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Input({ label, name, value, onChange, type = 'text', step, placeholder }: any) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        step={step}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  )
}

function Select({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
      >
        {options.map((opt: any) => {
          const optValue = typeof opt === 'string' ? opt : opt.value
          const optLabel = typeof opt === 'string' ? opt : opt.label
          return <option key={optValue} value={optValue}>{optLabel}</option>
        })}
      </select>
    </div>
  )
}

function ResultCard({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="font-semibold text-emerald-800 mb-3">{title}</h3>
      <div className="space-y-2 text-sm">
        {items.map(([k, v], i) => (
          <div key={i} className="flex justify-between">
            <span className="text-gray-500">{k}</span>
            <span className="font-medium text-gray-800">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
