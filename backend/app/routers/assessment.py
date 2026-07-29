from fastapi import APIRouter, Depends
from app.models.assessment import PatientRequest, AssessmentResponse
from app.auth import require_user
from rule_engine import RuleEngine, PatientData

router = APIRouter(prefix="/api/assess", tags=["Assessment"])
engine = RuleEngine()


@router.post("", response_model=AssessmentResponse)
def assess_patient(req: PatientRequest, user: dict = Depends(require_user)):
    patient = PatientData(
        usia=req.usia,
        bb=req.bb,
        tb=req.tb,
        jenis_kelamin=req.jenis_kelamin,
        tingkat_aktivitas=req.tingkat_aktivitas,
        mst_penurunan_bb=req.mst_penurunan_bb,
        mst_nafsu_makan=req.mst_nafsu_makan,
        diagnosis_medis=req.diagnosis_medis,
        keluhan=req.keluhan,
        asupan_persen=req.asupan_persen,
        albumin=req.albumin,
        gds=req.gds,
    )

    result = engine.evaluate(patient)

    return AssessmentResponse(
        skrining=result.skrining,
        imt=result.imt,
        kebutuhan=result.kebutuhan,
        diagnosis=result.diagnosis,
        preskripsi=result.preskripsi,
        monitoring=result.monitoring,
        citations=result.citations,
    )


@router.post("/public", response_model=AssessmentResponse)
def assess_patient_public(req: PatientRequest):
    patient = PatientData(
        usia=req.usia,
        bb=req.bb,
        tb=req.tb,
        jenis_kelamin=req.jenis_kelamin,
        tingkat_aktivitas=req.tingkat_aktivitas,
        mst_penurunan_bb=req.mst_penurunan_bb,
        mst_nafsu_makan=req.mst_nafsu_makan,
        diagnosis_medis=req.diagnosis_medis,
        keluhan=req.keluhan,
        asupan_persen=req.asupan_persen,
        albumin=req.albumin,
        gds=req.gds,
    )

    result = engine.evaluate(patient)

    return AssessmentResponse(
        skrining=result.skrining,
        imt=result.imt,
        kebutuhan=result.kebutuhan,
        diagnosis=result.diagnosis,
        preskripsi=result.preskripsi,
        monitoring=result.monitoring,
        citations=result.citations,
    )
