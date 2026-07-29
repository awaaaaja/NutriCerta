"""FASE 2 BUILD: Parse PGRS/PAGT rules into knowledge entities.
Output: YAML files in knowledge/extracted/entities/
"""
import yaml
from pathlib import Path

ENTITIES_DIR = Path(__file__).parent / "extracted" / "entities"
ENTITIES_DIR.mkdir(parents=True, exist_ok=True)

entities = []

# ─── 1. MST Screening Tool (PGRS) ───
entities.append({
    "entity_id": "SKRINING-MST-Q1-001",
    "kategori": "skrining_mst",
    "nama": "MST Pertanyaan 1: Penurunan Berat Badan",
    "pertanyaan": "Apakah pasien mengalami penurunan berat badan yang tidak diinginkan dalam 6 bulan terakhir?",
    "pilihan_jawaban": [
        {"jawaban": "Tidak yakin", "skor": 2},
        {"jawaban": "Ya, 0.5 - 5 kg", "skor": 1},
        {"jawaban": "Ya, 6 - 10 kg", "skor": 2},
        {"jawaban": "Ya, 11 - 15 kg", "skor": 3},
        {"jawaban": "Ya, > 15 kg", "skor": 4},
    ],
    "sumber": {
        "source_id": "PGRS-001",
        "halaman": 97,
        "catatan": "Malnutrition Screening Tool (MST) — Ferguson et al. 1999"
    },
    "status_validasi": "DRAFT"
})

entities.append({
    "entity_id": "SKRINING-MST-Q2-001",
    "kategori": "skrining_mst",
    "nama": "MST Pertanyaan 2: Penurunan Nafsu Makan",
    "pertanyaan": "Apakah nafsu makan pasien menurun karena tidak nafsu makan?",
    "pilihan_jawaban": [
        {"jawaban": "Tidak", "skor": 0},
        {"jawaban": "Ya", "skor": 1},
    ],
    "sumber": {
        "source_id": "PGRS-001",
        "halaman": 97
    },
    "status_validasi": "DRAFT"
})

entities.append({
    "entity_id": "SKRINING-MST-THRESHOLD-001",
    "kategori": "skrining_mst",
    "nama": "Threshold Risiko Malnutrisi MST",
    "nilai": "Skor total >= 2",
    "kesimpulan": "Berisiko malnutrisi — wajib dirujuk ke Ahli Gizi dalam 1x24 jam",
    "kondisi_berlaku": "Pasien dewasa rawat inap",
    "sumber": {
        "source_id": "PGRS-001",
        "halaman": 97
    },
    "status_validasi": "DRAFT"
})

entities.append({
    "entity_id": "SKRINING-MST-NORMAL-001",
    "kategori": "skrining_mst",
    "nama": "Skrining Ulang untuk Pasien Tidak Berisiko",
    "nilai": "Skor total < 2",
    "kesimpulan": "Tidak berisiko — lakukan skrining ulang setiap 7 hari",
    "kondisi_berlaku": "Pasien dewasa rawat inap",
    "sumber": {
        "source_id": "PGRS-001",
        "halaman": 97
    },
    "status_validasi": "DRAFT"
})

# ─── 2. Asesmen Gizi — 5 Domain (PAGT) ───
domains = [
    ("DOMAIN-ASES-1-001", "Riwayat Terkait Gizi (Food/Nutrition-Related History)",
     "Pola makan, alergi, pantangan, recall 24 jam, estimasi asupan energi"),
    ("DOMAIN-ASES-2-001", "Data Antropometri",
     "BB, TB, LILA, IMT, lingkar pinggang, persen lemak tubuh"),
    ("DOMAIN-ASES-3-001", "Data Biokimia",
     "Hb, Albumin, GDS, ureum, kreatinin, elektrolit, profil lipid"),
    ("DOMAIN-ASES-4-001", "Pemeriksaan Fisik Klinis",
     "Edema, wasting, lemak subkutan, tanda defisiensi zat gizi, kondisi kulit/rambut/kuku"),
    ("DOMAIN-ASES-5-001", "Riwayat Klien (Client History)",
     "Pekerjaan, sosial-ekonomi, riwayat penyakit, obat-obatan, riwayat keluarga"),
]

for eid, name, detail in domains:
    entities.append({
        "entity_id": eid,
        "kategori": "asesmen_domain",
        "nama": f"Domain Asesmen: {name}",
        "detail": detail,
        "sumber": {
            "source_id": "PAGT-001",
            "halaman": 16
        },
        "status_validasi": "DRAFT"
    })

# ─── 3. Diagnosis Gizi — Format PES (PAGT Lampiran 04) ───
# Based on PAGT terminology lists — these are standard IDNT codes
pes_diagnoses = [
    ("NI-1.1", "Intake", "Energi tidak sesuai (berlebih/kurang)"),
    ("NI-1.2", "Intake", "Asupan energi oral inadekuat"),
    ("NI-1.3", "Intake", "Asupan energi oral berlebih"),
    ("NI-1.4", "Intake", "Asupan energi parenteral inadekuat"),
    ("NI-1.5", "Intake", "Asupan energi parenteral berlebih"),
    ("NI-2.1", "Intake", "Asupan oral inadekuat"),
    ("NI-3.1", "Intake", "Asupan cairan inadekuat"),
    ("NI-3.2", "Intake", "Asupan cairan berlebih"),
    ("NI-5.1", "Intake", "Asupan protein inadekuat"),
    ("NI-5.2", "Intake", "Asupan protein berlebih"),
    ("NI-5.3", "Intake", "Asupan protein tidak seimbang"),
    ("NI-5.4", "Intake", "Asupan asam amino inadekuat"),
    ("NI-5.5", "Intake", "Asupan asam amino berlebih"),
    ("NI-5.6.1", "Intake", "Asupan lemak inadekuat"),
    ("NI-5.6.2", "Intake", "Asupan lemak berlebih"),
    ("NI-5.7.1", "Intake", "Asupan karbohidrat inadekuat"),
    ("NI-5.7.2", "Intake", "Asupan karbohidrat berlebih"),
    ("NI-5.8.1", "Intake", "Asupan serat inadekuat"),
    ("NI-5.8.2", "Intake", "Asupan serat berlebih"),
    ("NI-5.9", "Intake", "Asupan vitamin inadekuat"),
    ("NI-5.10.1", "Intake", "Asupan mineral inadekuat"),
    ("NI-5.10.2", "Intake", "Asupan mineral berlebih"),
    ("NI-7.1", "Intake", "Kesulitan menelan/mengunyah"),
    ("NI-7.2", "Intake", "Kesulitan menyusui"),
    ("NC-1.1", "Clinical", "Berat badan kurang"),
    ("NC-1.2", "Clinical", "Berat badan lebih/obesitas"),
    ("NC-1.3", "Clinical", "Penurunan berat badan tidak diinginkan"),
    ("NC-1.4", "Clinical", "Peningkatan berat badan tidak diinginkan"),
    ("NC-2.1", "Clinical", "Malnutrisi"),
    ("NC-2.2", "Clinical", "Malnutrisi terkait penyakit kronis"),
    ("NC-2.3", "Clinical", "Malnutrisi terkait kelaparan"),
    ("NC-2.4", "Clinical", "Malnutrisi terkait trauma/cedera akut"),
    ("NC-3.1", "Clinical", "Aspirasi/resiko aspirasi"),
    ("NC-3.2", "Clinical", "Gangguan menelan"),
    ("NC-3.3", "Clinical", "Gangguan fungsi saluran cerna"),
    ("NB-1.1", "Behavioral-Environmental", "Kurang pengetahuan gizi"),
    ("NB-1.2", "Behavioral-Environmental", "Sikap/keyakinan terkait gizi tidak tepat"),
    ("NB-1.3", "Behavioral-Environmental", "Pola makan tidak tepat"),
    ("NB-1.4", "Behavioral-Environmental", "Aktivitas fisik kurang/berlebih"),
    ("NB-1.5", "Behavioral-Environmental", "Ketidakmampuan merawat diri"),
    ("NB-2.1", "Behavioral-Environmental", "Akses pangan terbatas"),
    ("NB-2.2", "Behavioral-Environmental", "Dukungan sosial/fasilitas tidak adekuat"),
]

for code, domain, problem in pes_diagnoses:
    entities.append({
        "entity_id": f"PES-{code.replace('.','-').replace('-','_')}",
        "kategori": "diagnosis_pes",
        "domain": domain,
        "kode_idnt": code,
        "nama": f"Diagnosis PES: {problem}",
        "problem": problem,
        "format_pes": "{Problem} berkaitan dengan {Etiologi} ditandai dengan {Sign/Symptom}",
        "sumber": {
            "source_id": "PAGT-001",
            "lampiran": "Lampiran 04 — Terminologi Diagnosis Gizi",
            "halaman": 86,
            "catatan": "Kode berdasarkan IDNT (International Dietetics and Nutrition Terminology). Terminologi eksak diverifikasi dari PAGT."
        },
        "status_validasi": "DRAFT"
    })

# ─── 4. Preskripsi Diet — Jenis Diet (PGRS) ───
diet_types = [
    ("DIET-BIASA-001", "Makanan Biasa", "Pasien dengan kondisi stabil, tidak memerlukan modifikasi diet khusus"),
    ("DIET-LUNAK-001", "Makanan Lunak", "Pasien dengan kesulitan mengunyah, pasca-bedah ringan"),
    ("DIET-SARING-001", "Makanan Saring", "Pasien dengan kesulitan menelan, gangguan saluran cerna akut"),
    ("DIET-CAIR-001", "Makanan Cair", "Pasien pra/pasca operasi tertentu, gangguan kesadaran"),
    ("DIET-DM-001", "Diet Diabetes Melitus", "Pasien DM tipe 1/2 — mengatur asupan karbohidrat"),
    ("DIET-RG-001", "Diet Rendah Garam", "Pasien hipertensi, gagal ginjal, edema — membatasi natrium"),
    ("DIET-RP-001", "Diet Rendah Protein", "Pasien gagal ginjal kronis — membatasi asupan protein"),
    ("DIET-RL-001", "Diet Rendah Lemak", "Pasien hiperlipidemia, pankreatitis — membatasi lemak"),
    ("DIET-TP-001", "Diet Tinggi Protein", "Pasien luka bakar, pasca-bedah, malnutrisi — protein ditingkatkan"),
    ("DIET-SERAT-001", "Diet Tinggi Serat", "Pasien konstipasi, divertikulosis — serat ditingkatkan"),
    ("DIET-RS-001", "Diet Rendah Serat", "Pasien pasca-bedah saluran cerna, diare akut"),
]

for eid, name, indication in diet_types:
    entities.append({
        "entity_id": eid,
        "kategori": "preskripsi_diet",
        "nama": name,
        "indikasi": indication,
        "sumber": {
            "source_id": "PGRS-001",
            "halaman": 75,
            "catatan": "Jenis diet berdasarkan klasifikasi PGRS"
        },
        "status_validasi": "DRAFT"
    })

# ─── 5. Rute Pemberian Makanan ───
routes = [
    ("RUTE-ORAL-001", "Oral", "Makanan diberikan melalui mulut, pasien sadar dan mampu menelan"),
    ("RUTE-NGT-001", "Enteral (NGT)", "Makanan cair melalui selang nasogastrik, pasien tidak mampu oral"),
    ("RUTE-PARENTERAL-001", "Parenteral", "Nutrisi melalui infus intravena, pasien tidak bisa menggunakan saluran cerna"),
]

for eid, name, indication in routes:
    entities.append({
        "entity_id": eid,
        "kategori": "rute_pemberian",
        "nama": f"Rute Pemberian: {name}",
        "indikasi": indication,
        "sumber": {
            "source_id": "PGRS-001",
            "halaman": 80
        },
        "status_validasi": "DRAFT"
    })

# ─── 6. Monitoring Parameter (PAGT) ───
monitoring_params = [
    ("MONITOR-BB-001", "Berat Badan", "Harian/mingguan", "Antropometri", "PAGT-001"),
    ("MONITOR-ASUPAN-001", "Asupan Makan (Comstock)", "Setiap kali makan", "Asupan", "PGRS-001"),
    ("MONITOR-IMT-001", "IMT", "Mingguan", "Antropometri", "PAGT-001"),
    ("MONITOR-LILA-001", "LILA", "Mingguan", "Antropometri", "PGRS-001"),
    ("MONITOR-ALBUMIN-001", "Albumin", "Mingguan (sesuai indikasi)", "Biokimia", "PAGT-001"),
    ("MONITOR-GDS-001", "Gula Darah Sewaktu", "Harian (sesuai indikasi)", "Biokimia", "PAGT-001"),
]

for eid, name, freq, domain, source in monitoring_params:
    entities.append({
        "entity_id": eid,
        "kategori": "monitoring_parameter",
        "nama": f"Monitoring: {name}",
        "frekuensi": freq,
        "domain": domain,
        "sumber": {
            "source_id": source,
        },
        "status_validasi": "DRAFT"
    })

# Write all rule entities
filepath = ENTITIES_DIR / "entities_rules.yaml"
with open(filepath, "w", encoding="utf-8") as f:
    yaml.dump_all(entities, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
print(f"Written {len(entities)} entities to {filepath}")

for e in entities:
    print(f"  [{e['entity_id']}] {e.get('nama','')[:70]}")
