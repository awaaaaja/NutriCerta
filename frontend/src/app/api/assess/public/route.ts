import { NextRequest, NextResponse } from 'next/server'
import { RuleEngine } from '@/lib/rule-engine/engine'
import { PatientData } from '@/lib/rule-engine/models'
import { validate, publishAssessmentSchema } from '@/lib/validation'

const engine = new RuleEngine()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const v = validate(publishAssessmentSchema, body)
    if (!v.success) return v.response
    const patient: PatientData = {
      usia: v.data.usia || 0,
      bb: v.data.bb,
      tb: v.data.tb,
      jenis_kelamin: v.data.jenis_kelamin,
      tingkat_aktivitas: v.data.tingkat_aktivitas,
      mst_penurunan_bb: null,
      mst_nafsu_makan: null,
      diagnosis_medis: v.data.diagnosis_medis || [],
      keluhan: v.data.keluhan || [],
      asupan_persen: v.data.asupan_persen ?? null,
      albumin: v.data.albumin ?? null,
      gds: v.data.gds ?? null,
    }

    const result = engine.evaluate(patient)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Assessment failed'
    return NextResponse.json({ detail: message }, { status: 400 })
  }
}
