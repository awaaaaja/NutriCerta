from typing import List, Tuple
from ..models import MonitoringResult, Citation

MONITORING_REGISTRY = {
    "MONITOR-BB-001": {
        "parameter": "Berat Badan",
        "frekuensi": "1x/minggu",
        "keterangan": "Timbang BB setiap minggu pada waktu yang sama",
    },
    "MONITOR-ASUPAN-001": {
        "parameter": "Asupan Makan (Comstock)",
        "frekuensi": "Setiap hari",
        "keterangan": "Catat sisa makan pasien dengan metode Comstock",
    },
    "MONITOR-IMT-001": {
        "parameter": "IMT",
        "frekuensi": "1x/bulan",
        "keterangan": "Hitung IMT ulang setiap bulan",
    },
    "MONITOR-LILA-001": {
        "parameter": "LILA (Lingkar Lengan Atas)",
        "frekuensi": "1x/bulan",
        "keterangan": "Ukur LILA sebagai indikator massa otot",
    },
    "MONITOR-ALBUMIN-001": {
        "parameter": "Albumin",
        "frekuensi": "Sesuai indikasi",
        "keterangan": "Cek albumin serum untuk menilai status protein visceral",
    },
    "MONITOR-GDS-001": {
        "parameter": "Gula Darah Sewaktu",
        "frekuensi": "Sesuai indikasi",
        "keterangan": "Cek GDS untuk pasien DM atau risiko hipoglikemi",
    },
}


def rekomendasi_monitoring(
    diagnosis_medis: List[str],
    imt_kategori: str,
    mst_kategori: str,
    albumin: float | None = None,
    gds: float | None = None,
) -> tuple[list[MonitoringResult], list[Citation]]:
    results = []
    citations = []

    monitor_keys = []

    monitor_keys.append("MONITOR-BB-001")
    monitor_keys.append("MONITOR-ASUPAN-001")

    if mst_kategori == "RISIKO":
        monitor_keys.append("MONITOR-IMT-001")
        monitor_keys.append("MONITOR-LILA-001")
        monitor_keys.append("MONITOR-ALBUMIN-001")

    for dm in diagnosis_medis:
        if any(k in dm.lower() for k in ["dm", "diabetes", "gds"]):
            monitor_keys.append("MONITOR-GDS-001")
        if any(k in dm.lower() for k in ["ginjal", "ckd", "albumin"]):
            monitor_keys.append("MONITOR-ALBUMIN-001")

    seen = set()
    for key in monitor_keys:
        if key in seen:
            continue
        seen.add(key)
        info = MONITORING_REGISTRY.get(key)
        if info:
            results.append(MonitoringResult(**info))
            citations.append(Citation(
                rule=key,
                source_id="PGRS-001",
                kutipan=f"Monitoring: {info['parameter']} — {info['frekuensi']}",
            ))

    return results, citations
