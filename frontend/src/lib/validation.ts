import { z } from 'zod'
import { NextResponse } from 'next/server'

export function validate<T>(schema: z.ZodType<T>, data: unknown): { success: true; data: T } | { success: false; response: NextResponse } {
  const result = schema.safeParse(data)
  if (result.success) return { success: true, data: result.data }
  const errors = result.error.flatten().fieldErrors
  return {
    success: false,
    response: NextResponse.json({ detail: 'Validasi gagal', errors }, { status: 400 }),
  }
}

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const createPatientSchema = z.object({
  no_rm: z.string().min(1, 'No. RM wajib diisi'),
  nama: z.string().min(1, 'Nama wajib diisi'),
  tanggal_lahir: z.string().optional().nullable(),
  jenis_kelamin: z.enum(['pria', 'wanita']).optional().nullable(),
  ruangan: z.string().optional().nullable(),
  diagnosis_masuk: z.string().optional().nullable(),
  tgl_masuk: z.string().optional().nullable(),
  bb: z.number().positive('BB harus > 0').max(500).optional().nullable(),
  tb: z.number().positive('TB harus > 0').max(300).optional().nullable(),
  created_by: z.string().uuid().optional().nullable(),
})

export const updatePatientSchema = z.object({
  no_rm: z.string().optional(),
  nama: z.string().optional(),
  tanggal_lahir: z.string().optional().nullable(),
  jenis_kelamin: z.enum(['pria', 'wanita']).optional().nullable(),
  ruangan: z.string().optional().nullable(),
  diagnosis_masuk: z.string().optional().nullable(),
  status_pagt: z.string().optional(),
  bb: z.number().positive('BB harus > 0').max(500).optional().nullable(),
  tb: z.number().positive('TB harus > 0').max(300).optional().nullable(),
  _action: z.string().optional(),
})

export const screeningSchema = z.object({
  mst_penurunan_bb: z.number().int().min(0).max(4),
  mst_nafsu_makan: z.number().int().min(0).max(2),
  status: z.enum(['draft', 'submitted']).optional().default('draft'),
  created_by: z.string().uuid().optional().nullable(),
})

export const assessmentSchema = z.object({
  usia: z.number().int().min(0).max(150).optional().nullable(),
  bb: z.number().positive('BB harus > 0').max(500).optional().nullable(),
  tb: z.number().positive('TB harus > 0').max(300).optional().nullable(),
  jenis_kelamin: z.string().optional().nullable(),
  tingkat_aktivitas: z.string().optional().nullable(),
  mst_penurunan_bb: z.number().optional().nullable(),
  mst_nafsu_makan: z.number().optional().nullable(),
  diagnosis_medis: z.array(z.string()).optional().default([]),
  keluhan: z.array(z.string()).optional().default([]),
  asupan_persen: z.number().min(0).max(100).optional().nullable(),
  albumin: z.number().min(0).max(10).optional().nullable(),
  gds: z.number().int().min(0).max(1000).optional().nullable(),
  status: z.enum(['draft', 'submitted']).optional().default('submitted'),
  created_by: z.string().uuid().optional().nullable(),
})

export const diagnosisSchema = z.object({
  kode_pes: z.string().min(1, 'Kode PES wajib diisi'),
  pernyataan_pes: z.string().min(1, 'Pernyataan PES wajib diisi'),
  domain: z.enum(['NI', 'NC', 'NB']).optional().nullable(),
  etiologi: z.string().optional().nullable(),
  signs: z.string().optional().nullable(),
  assessment_id: z.string().uuid().optional().nullable(),
  status: z.enum(['active', 'resolved']).optional().default('active'),
  created_by: z.string().uuid().optional().nullable(),
})

export const interventionSchema = z.object({
  diagnosis_id: z.string().uuid().optional().nullable(),
  jenis_diet: z.string().min(1, 'Jenis diet wajib diisi'),
  rute_pemberian: z.enum(['ORAL', 'ENTERAL', 'PARENTERAL']).optional().default('ORAL'),
  tujuan_intervensi: z.string().optional().nullable(),
  target_energi: z.number().int().min(0).max(10000).optional().nullable(),
  target_protein: z.number().min(0).max(1000).optional().nullable(),
  alergi: z.string().optional().nullable(),
  edukasi: z.string().optional().nullable(),
  alasan_revisi: z.string().optional().nullable(),
  status: z.enum(['active', 'completed']).optional().default('active'),
  created_by: z.string().uuid().optional().nullable(),
})

export const monitoringSchema = z.object({
  tanggal: z.string().optional(),
  bb: z.number().positive().max(500).optional().nullable(),
  asupan_persen: z.number().min(0).max(100).optional().nullable(),
  albumin: z.number().min(0).max(10).optional().nullable(),
  gds: z.number().int().min(0).max(1000).optional().nullable(),
  mual_muntah: z.string().optional().nullable(),
  diare: z.string().optional().nullable(),
  catatan: z.string().optional().nullable(),
  created_by: z.string().uuid().optional().nullable(),
})

export const dischargeSchema = z.object({
  rekomendasi_diet: z.string().optional().nullable(),
  monitoring_lanjutan: z.string().optional().nullable(),
  kontrol_tanggal: z.string().optional().nullable(),
  catatan: z.string().optional().nullable(),
  created_by: z.string().uuid().optional().nullable(),
})

export const publishAssessmentSchema = z.object({
  usia: z.number().int().min(0).max(150).optional().nullable(),
  bb: z.number().positive('BB harus > 0').max(500),
  tb: z.number().positive('TB harus > 0').max(300),
  jenis_kelamin: z.string().min(1, 'JK wajib diisi'),
  tingkat_aktivitas: z.string().min(1, 'Aktivitas wajib diisi'),
  diagnosis_medis: z.array(z.string()).optional().default([]),
  keluhan: z.array(z.string()).optional().default([]),
  asupan_persen: z.number().min(0).max(100).optional().nullable(),
  albumin: z.number().min(0).max(10).optional().nullable(),
  gds: z.number().int().min(0).max(1000).optional().nullable(),
})
