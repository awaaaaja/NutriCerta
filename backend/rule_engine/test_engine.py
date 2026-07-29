from rule_engine import RuleEngine, PatientData

def test_skrining_risiko():
    engine = RuleEngine()
    pasien = PatientData(
        usia=45,
        bb=50,
        tb=160,
        jenis_kelamin="wanita",
        tingkat_aktivitas="RINGAN",
        mst_penurunan_bb=3,
        mst_nafsu_makan=1,
        diagnosis_medis=["dm"],
        keluhan=["nafsu_makan_turun", "bb_turun"],
        asupan_persen=40,
        albumin=3.2,
        gds=180,
    )
    result = engine.evaluate(pasien)
    assert result.skrining is not None
    assert result.skrining.kategori == "RISIKO"
    assert result.skrining.skor == 4
    assert result.imt is not None
    assert result.kebutuhan is not None
    assert len(result.diagnosis) > 0
    assert len(result.preskripsi) > 0
    assert len(result.monitoring) > 0
    assert len(result.citations) > 0
    print("[PASS] TEST SKRINING RISIKO")
    print(f"   Skor MST: {result.skrining.skor} ({result.skrining.kategori})")
    print(f"   IMT: {result.imt.nilai} ({result.imt.kategori})")
    print(f"   BEE: {result.kebutuhan.bee} | TEE: {result.kebutuhan.tee}")
    print(f"   Diagnosis: {result.diagnosis[0].pes_statement}")
    print(f"   Preskripsi: {[p.diet for p in result.preskripsi]}")
    print(f"   Monitoring: {[m.parameter for m in result.monitoring]}")
    print(f"   Citations: {len(result.citations)} sources")

def test_skrining_normal():
    engine = RuleEngine()
    pasien = PatientData(
        usia=30,
        bb=60,
        tb=165,
        jenis_kelamin="pria",
        tingkat_aktivitas="SEDANG",
        mst_penurunan_bb=1,
        mst_nafsu_makan=0,
        diagnosis_medis=[],
        keluhan=[],
    )
    result = engine.evaluate(pasien)
    assert result.skrining is not None
    assert result.skrining.kategori == "NORMAL"
    assert result.imt is not None
    assert result.kebutuhan is not None
    print("\n[PASS] TEST SKRINING NORMAL")
    print(f"   Skor MST: {result.skrining.skor} ({result.skrining.kategori})")
    print(f"   IMT: {result.imt.nilai} ({result.imt.kategori})")
    print(f"   BEE: {result.kebutuhan.bee} | TEE: {result.kebutuhan.tee}")

def test_imt_kategori():
    engine = RuleEngine()
    test_cases = [
        (40, 160, "SANGAT_KURANG"),  # IMT = 15.6
        (50, 165, "KURANG"),          # IMT = 18.4
        (60, 170, "NORMAL"),          # IMT = 20.8
        (65, 160, "LEBIH"),           # IMT = 25.4
        (90, 160, "OBESITAS"),        # IMT = 35.2
    ]
    for bb, tb, expected in test_cases:
        pasien = PatientData(
            usia=30, bb=bb, tb=tb,
            jenis_kelamin="pria",
            tingkat_aktivitas="RINGAN",
        )
        result = engine.evaluate(pasien)
        assert result.imt.kategori == expected, f"BB={bb}, TB={tb}: expected {expected}, got {result.imt.kategori}"
    print("\n[PASS] TEST IMT KATEGORI (5/5)")

def test_preskripsi_dm():
    engine = RuleEngine()
    pasien = PatientData(
        usia=55, bb=70, tb=165,
        jenis_kelamin="pria",
        tingkat_aktivitas="RINGAN",
        diagnosis_medis=["diabetes melitus", "hipertensi"],
        keluhan=[],
    )
    result = engine.evaluate(pasien)
    diet_names = [p.diet for p in result.preskripsi]
    assert "DIET-DM" in diet_names, f"Expected DIET-DM, got {diet_names}"
    print("\n[PASS] TEST PRESKRIPSI DM")
    print(f"   Diet: {diet_names}")

def test_citations():
    engine = RuleEngine()
    pasien = PatientData(
        usia=45, bb=55, tb=155,
        jenis_kelamin="wanita",
        tingkat_aktivitas="TB",
        mst_penurunan_bb=2,
        mst_nafsu_makan=0,
        diagnosis_medis=["dm"],
        keluhan=["bb_turun"],
        asupan_persen=50,
    )
    result = engine.evaluate(pasien)
    assert len(result.citations) >= 5
    source_ids = {c.source_id for c in result.citations}
    assert "PGRS-001" in source_ids or "AKG-001" in source_ids
    print("\n[PASS] TEST CITATIONS")
    print(f"   Total citations: {len(result.citations)}")
    for c in result.citations:
        print(f"   [{c.source_id}] {c.rule}: {c.kutipan[:60]}...")


if __name__ == "__main__":
    print("=== Rule Engine Tests ===\n")
    test_skrining_risiko()
    test_skrining_normal()
    test_imt_kategori()
    test_preskripsi_dm()
    test_citations()
    print("\n=== All Tests Passed ===")
