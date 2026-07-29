import { NextRequest, NextResponse } from 'next/server'
import { RuleEngine } from '@/lib/rule-engine/engine'
import { PatientData } from '@/lib/rule-engine/models'

const engine = new RuleEngine()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const patient: PatientData = {
      usia: Number(body.usia),
      bb: Number(body.bb),
      tb: Number(body.tb),
      jenis_kelamin: body.jenis_kelamin,
      tingkat_aktivitas: body.tingkat_aktivitas,
      mst_penurunan_bb: body.mst_penurunan_bb != null ? Number(body.mst_penurunan_bb) : null,
      mst_nafsu_makan: body.mst_nafsu_makan != null ? Number(body.mst_nafsu_makan) : null,
      diagnosis_medis: Array.isArray(body.diagnosis_medis) ? body.diagnosis_medis.map(String) : [],
      keluhan: Array.isArray(body.keluhan) ? body.keluhan.map(String) : [],
      asupan_persen: body.asupan_persen != null ? Number(body.asupan_persen) : null,
      albumin: body.albumin != null ? Number(body.albumin) : null,
      gds: body.gds != null ? Number(body.gds) : null,
    }

    const result = engine.evaluate(patient)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Assessment failed'
    return NextResponse.json({ detail: message }, { status: 400 })
  }
}
