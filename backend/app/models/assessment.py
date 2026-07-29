from pydantic import BaseModel, Field
from typing import List, Optional


class PatientRequest(BaseModel):
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


class CitationResponse(BaseModel):
    rule: str
    source_id: str
    kutipan: str
    halaman: Optional[str] = None


class SkriningResponse(BaseModel):
    skor: int
    kategori: str
    interpretasi: str


class IMTResponse(BaseModel):
    nilai: float
    kategori: str
    interpretasi: str


class KebutuhanGiziResponse(BaseModel):
    bee: float
    tee: float
    satuan: str
    protein: float
    satuan_protein: str


class DiagnosisPESResponse(BaseModel):
    problem: str
    label: str
    etiologi: str
    signs: str
    pes_statement: str
    domain: str


class PreskripsiResponse(BaseModel):
    diet: str
    deskripsi: str
    rute: str


class MonitoringResponse(BaseModel):
    parameter: str
    frekuensi: str
    keterangan: str


class AssessmentResponse(BaseModel):
    skrining: Optional[SkriningResponse] = None
    imt: Optional[IMTResponse] = None
    kebutuhan: Optional[KebutuhanGiziResponse] = None
    diagnosis: List[DiagnosisPESResponse] = Field(default_factory=list)
    preskripsi: List[PreskripsiResponse] = Field(default_factory=list)
    monitoring: List[MonitoringResponse] = Field(default_factory=list)
    citations: List[CitationResponse] = Field(default_factory=list)
