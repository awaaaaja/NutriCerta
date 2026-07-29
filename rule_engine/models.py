from pydantic import BaseModel, Field
from typing import List, Optional


class Citation(BaseModel):
    rule: str
    source_id: str
    kutipan: str
    halaman: Optional[str] = None


class SkriningResult(BaseModel):
    skor: int
    kategori: str
    interpretasi: str


class IMTResult(BaseModel):
    nilai: float
    kategori: str
    interpretasi: str


class KebutuhanGiziResult(BaseModel):
    bee: float
    tee: float
    satuan: str
    protein: float
    satuan_protein: str


class DiagnosisPESResult(BaseModel):
    problem: str
    label: str
    etiologi: str
    signs: str
    pes_statement: str
    domain: str


class PreskripsiResult(BaseModel):
    diet: str
    deskripsi: str
    rute: str


class MonitoringResult(BaseModel):
    parameter: str
    frekuensi: str
    keterangan: str


class AssessmentResult(BaseModel):
    skrining: Optional[SkriningResult] = None
    imt: Optional[IMTResult] = None
    kebutuhan: Optional[KebutuhanGiziResult] = None
    diagnosis: List[DiagnosisPESResult] = Field(default_factory=list)
    preskripsi: List[PreskripsiResult] = Field(default_factory=list)
    monitoring: List[MonitoringResult] = Field(default_factory=list)
    citations: List[Citation] = Field(default_factory=list)


class PatientData(BaseModel):
    usia: float
    bb: float
    tb: float
    jenis_kelamin: str
    tingkat_aktivitas: str
    mst_penurunan_bb: Optional[int] = None
    mst_nafsu_makan: Optional[int] = None
    diagnosis_medis: List[str] = Field(default_factory=list)
    keluhan: List[str] = Field(default_factory=list)
    asupan_persen: Optional[float] = None
    albumin: Optional[float] = None
    gds: Optional[float] = None
