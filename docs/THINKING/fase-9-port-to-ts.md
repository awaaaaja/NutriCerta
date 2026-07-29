# FASE 9 — Port rule_engine Python ke TypeScript + Next.js API Routes

## Keputusan
Hapus backend FastAPI terpisah. Port semua rule_engine ke TypeScript langsung di Next.js App Router API Routes. Semua di Vercel, satu project, gratis, tanpa hosting pihak ketiga.

## Alasan
- ML belum dibangun (FASE 7), Python runtime belum dibutuhkan
- Semua logika rule_engine adalah pure functions — port ke TS straightforward
- Zero cold start, zero maintenance, zero CC, zero $/bulan
- Ketika ML sudah siap nanti, backend Python bisa ditambahkan lagi

## Mapping Python → TypeScript

| Python | TypeScript |
|---|---|
| `rule_engine/models.py` | `src/lib/rule-engine/models.ts` |
| `rule_engine/rules/skrining_mst.py` | `src/lib/rule-engine/skrining-mst.ts` |
| `rule_engine/rules/antropometri.py` | `src/lib/rule-engine/antropometri.ts` |
| `rule_engine/rules/kebutuhan_gizi.py` | `src/lib/rule-engine/kebutuhan-gizi.ts` |
| `rule_engine/rules/diagnosis_pes.py` | `src/lib/rule-engine/diagnosis-pes.ts` |
| `rule_engine/rules/preskripsi.py` | `src/lib/rule-engine/preskripsi.ts` |
| `rule_engine/rules/monitoring.py` | `src/lib/rule-engine/monitoring.ts` |
| `rule_engine/engine.py` | `src/lib/rule-engine/engine.ts` |
| `backend/app/routers/assessment.py` | `src/app/api/assess/public/route.ts` |
| `backend/app/routers/foods.py` | `src/app/api/foods/route.ts`, `src/app/api/foods/kelompok/list/route.ts`, `src/app/api/foods/[entity_id]/route.ts` |
| `backend/app/routers/auth_routes.py` | `src/app/api/auth/login/route.ts`, `src/app/api/auth/register/route.ts` |
| `backend/app/supabase_client.py` | Langsung pakai `@supabase/supabase-js` di API Routes |

## Zero-hallucination
Setiap rule, threshold, source_id, halaman, kutipan — EXACT COPY dari Python yang sudah APPROVED BY AHLI GIZI. Tidak ada perubahan logika.

## Testing
5 test Python di-port ke test manual:
1. Skrining risiko (MST >= 2)
2. Skrining normal (MST < 2)
3. IMT kategori (5 sub-test)
4. Preskripsi DM
5. Citations (>= 5)

Verifikasi: output assessment antara TypeScript dan Python harus identik.
