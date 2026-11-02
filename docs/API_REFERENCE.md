# Admin Nalar — API Reference

This document serves as the primary API Reference for Admin Nalar's internal APIs and services. The complete specifications, operational constraints, and examples are maintained in:

- [docs/internal-api.md](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/docs/internal-api.md)

---

## Quick Summary of Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/internal/queue` | Summary of prioritized outreach queues (siap kirim, follow-ups due, hold) and daily slot status |
| `GET` | `/api/internal/followups-due` | Leads currently due for follow-up (7-day rule) |
| `GET` | `/api/internal/leads` | Paginated and filtered list of leads |
| `GET` | `/api/internal/leads/[id]` | Full lead detail with interactions timeline and audit logs |
| `PATCH` | `/api/internal/leads/[id]` | Status transition, verification updates, or notes |
| `POST` | `/api/internal/leads/[id]/interactions` | Record interaction (penawaran, followup_1, followup_2, balasan_masuk, catatan) and update status |
| `POST` | `/api/internal/import` | Batch import leads with composite deduplication (`nomor_telepon_normalized` + `nama_bisnis_normalized`) |

---

## Import Rules Summary

1. **Deduplication**:
   - Deduplication is composite based on `nomor_telepon_normalized` + `nama_bisnis_normalized` (case-insensitive, trimmed).
   - Leads with the same phone number but different business names (e.g. multi-business owners or shared branch lines) are allowed.
2. **Defensive Type Coercion**:
   - Number and boolean values on text fields are accepted and cleanly coerced (e.g. `Tier: 1`, `Verified GBP: true`).
   - Objects, arrays, or null on required fields return HTTP `400 Bad Request`.
3. **Status Handling**:
   - Initial allowed statuses: `'riset'`, `'terverifikasi'`, `'siap_kirim'`, `'hold'`, `'tidak_layak'`, `'do_not_contact'`, `'benchmark_only'`.
   - Outreach statuses (`'terkirim'`, `'followup_1'`, `'followup_2'`, `'replied'`, `'pause'`, `'closed'`) cannot be set directly via the `status` field (returns HTTP `400 Bad Request`).
   - Every import row explicitly reports `status_diminta` vs `status_diterapkan` in the response payload.
