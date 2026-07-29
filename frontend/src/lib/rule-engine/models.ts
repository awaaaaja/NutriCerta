export interface Citation {
  rule: string
  source_id: string
  kutipan: string
  halaman?: string
}

export interface SkriningResult {
  skor: number
  kategori: string
  interpretasi: string
}

export interface IMTResult {
  nilai: number
  kategori: string
  interpretasi: string
}

export interface KebutuhanGiziResult {
  bee: number
  tee: number
  satuan: string
  protein: number
  satuan_protein: string
}

export interface DiagnosisPESResult {
  problem: string
  label: string
  etiologi: string
  signs: string
  pes_statement: string
  domain: string
}

export interface PreskripsiResult {
  diet: string
  deskripsi: string
  rute: string
}

export interface MonitoringResult {
  parameter: string
  frekuensi: string
  keterangan: string
}

export interface AssessmentResult {
  skrining: SkriningResult | null
  imt: IMTResult | null
  kebutuhan: KebutuhanGiziResult | null
  diagnosis: DiagnosisPESResult[]
  preskripsi: PreskripsiResult[]
  monitoring: MonitoringResult[]
  citations: Citation[]
}

export interface PatientData {
  usia: number
  bb: number
  tb: number
  jenis_kelamin: string
  tingkat_aktivitas: string
  mst_penurunan_bb?: number | null
  mst_nafsu_makan?: number | null
  diagnosis_medis: string[]
  keluhan: string[]
  asupan_persen?: number | null
  albumin?: number | null
  gds?: number | null
}
