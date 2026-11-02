# Admin Nalar — Internal API Documentation for Tepa Agent

This document provides complete reference specifications and usage examples for the internal REST API under `/api/internal/*`. 

This API is designed specifically for **Tepa** (Nalar's autonomous AI operator agent) and internal automated workflows to manage, inspect, follow up, and import CRM leads programmatically.

---

## 1. Authentication & Security

All requests to the internal API must include a valid Bearer token in the `Authorization` header:

```http
Authorization: Bearer <TEPA_API_KEY>
```

- **Environment Variable**: `TEPA_API_KEY` is securely stored in your server environment (`.env.local` for development or Vercel Environment Variables for production). Never commit this key to version control.
- **Validation**: Implemented with timing-safe comparison in [`validateInternalApiKey`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/lib/admin/api-auth.ts#L4-L48).
- **Audit Logging**: Every mutation (interaction logging, status transition, batch import) automatically creates an audit record in the `audit_logs` table prefixed with `api: ` (e.g. `api: status: terkirim → followup_1`).
- **Domain Rule Integrity**: Internal API endpoints share the exact same domain functions and business validations as the user interface (e.g. [`canTransition`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/lib/admin/leads/rules.ts#L32-L185) and [`transitionLeadWithAudit`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/lib/admin/leads/repository.ts#L173-L277)).

### Error Responses

If the request is unauthenticated or the Bearer token is invalid, the API returns HTTP `401 Unauthorized`:

```json
{
  "ok": false,
  "error": "Invalid API key."
}
```

If a business rule is violated (such as attempting a 3rd follow-up or moving a Tier 4 lead to outreach queues), the API returns HTTP `400 Bad Request`:

```json
{
  "ok": false,
  "error": "Follow-up maksimal 2x — prospek di-pause sesuai aturan."
}
```

---

## 2. API Endpoints

### 2.1. Get Due Follow-ups

Returns the list of active outreach leads whose follow-up is due according to the 7-day rule (`FOLLOW_UP_DAYS = 7`) without subsequent replies.

- **Method**: `GET`
- **Route**: `/api/internal/followups-due`
- **Handler**: [`src/app/api/internal/followups-due/route.ts`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/app/api/internal/followups-due/route.ts)
- **Query Parameters**:
  - `date` *(optional, string, format: `YYYY-MM-DD`)*: Reference evaluation date in WIB (`Asia/Jakarta`). Defaults to the current date and time.

#### Example Request
```bash
curl -X GET "https://nalarsolusidigital.my.id/api/internal/followups-due?date=2026-11-10" \
  -H "Authorization: Bearer <TEPA_API_KEY>"
```

#### Example Response (HTTP 200)
```json
{
  "ok": true,
  "data": {
    "date": "2026-11-10T05:00:00.000Z",
    "total_due": 1,
    "due_leads": [
      {
        "id": "e4b2d354-94e8-4665-8b54-7935cf1f9c81",
        "nama_bisnis": "PT Cipta Karya Perkasa",
        "tier": 1,
        "sektor": "Kontraktor Bangunan",
        "kota": "Surakarta",
        "wilayah": "Solo Raya",
        "nomor_telepon": "081234567890",
        "status": "terkirim",
        "days_overdue": 3,
        "last_interaction_date": "2026-10-31T03:00:00.000Z"
      }
    ]
  }
}
```

---

### 2.2. Get Queue Summary

Retrieves the prioritized operational outreach queues: leads ready to send (`siap_kirim` sorted by tier and oldest updated timestamp), follow-ups due, and leads on hold awaiting manual verification. Also reports daily slot usage (limit: 5 sends/day).

- **Method**: `GET`
- **Route**: `/api/internal/queue`
- **Handler**: [`src/app/api/internal/queue/route.ts`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/app/api/internal/queue/route.ts)

#### Example Request
```bash
curl -X GET "https://nalarsolusidigital.my.id/api/internal/queue" \
  -H "Authorization: Bearer <TEPA_API_KEY>"
```

#### Example Response (HTTP 200)
```json
{
  "ok": true,
  "data": {
    "operational_status": {
      "isOperationalDay": true,
      "isOperationalHour": true,
      "isInOperationalWindow": true,
      "slotsUsedToday": 2,
      "maxDailySlots": 5,
      "slotsRemaining": 3,
      "currentTimeWIB": "10:30 WIB (Wed)"
    },
    "siap_kirim_count": 1,
    "followup_due_count": 1,
    "hold_count": 0,
    "siap_kirim": [
      {
        "id": "9a3f4e21-508b-4bcf-a6e5-4700d86fc35b",
        "tier": 1,
        "nama_bisnis": "Ruang Konveksi Solo",
        "sektor": "Konveksi & Apparel",
        "kota": "Surakarta",
        "wilayah": "Solo Raya",
        "nomor_telepon": "081529964902",
        "link_wa": "https://wa.me/6281529964902",
        "strategi_pitch": "Katalog digital terintegrasi simulasi estimasi biaya.",
        "updated_at": "2026-11-01T08:00:00.000Z"
      }
    ],
    "hold": []
  }
}
```

---

### 2.3. Search and List Leads

Searches, filters, sorts, and paginates the leads database.

- **Method**: `GET`
- **Route**: `/api/internal/leads`
- **Handler**: [`src/app/api/internal/leads/route.ts`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/app/api/internal/leads/route.ts)
- **Query Parameters**:
  - `q` *(optional, string)*: Substring search across `nama_bisnis`, `kota`, `sektor`, and `nomor_telepon`.
  - `tier` *(optional, number: `1` | `2` | `3` | `4`)*: Filter by prospect tier.
  - `status` *(optional, [`LeadStatus`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/lib/admin/leads/types.ts#L1-L14))*: Filter by lead status.
  - `wilayah` *(optional, string)*: Filter by region (e.g. `"Solo Raya"`).
  - `verification_status` *(optional, [`VerificationStatus`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/lib/admin/leads/types.ts#L16-L21))*: `belum` | `terverifikasi` | `parsial` | `hold` | `tidak_layak`.
  - `page` *(optional, number, default: `1`)*: Page number.
  - `limit` *(optional, number, default: `25`, max: `100`)*: Records per page.

#### Example Request
```bash
curl -X GET "https://nalarsolusidigital.my.id/api/internal/leads?status=siap_kirim&tier=1&page=1&limit=10" \
  -H "Authorization: Bearer <TEPA_API_KEY>"
```

#### Example Response (HTTP 200)
```json
{
  "ok": true,
  "data": {
    "leads": [
      {
        "id": "9a3f4e21-508b-4bcf-a6e5-4700d86fc35b",
        "tier": 1,
        "sub_kelompok": "1B - Heavy Hitter",
        "sektor": "Konveksi & Apparel",
        "kota": "Surakarta",
        "wilayah": "Solo Raya",
        "nama_bisnis": "Ruang Konveksi Solo",
        "tipe_usaha": "Manufaktur Lokal",
        "verified_gbp": true,
        "jumlah_ulasan": 50,
        "rating": "4.90",
        "jumlah_foto": 30,
        "nomor_telepon": "0815 2996 4902",
        "nomor_telepon_normalized": "6281529964902",
        "tipe_kontak": "WhatsApp (Seluler)",
        "link_wa": "https://wa.me/6281529964902",
        "status_web": "Instagram Only",
        "url_medsos": "https://instagram.com/ruangkonveksi",
        "strategi_pitch": "Katalog digital produk dan simulasi biaya",
        "alamat": "Jl. Slamet Riyadi No. 120, Surakarta",
        "link_maps": "https://maps.google.com/?cid=123",
        "status": "siap_kirim",
        "verification_status": "terverifikasi",
        "verification_source": "cek live WA",
        "batch_riset": "2026-11-01-wave1",
        "catatan": null,
        "created_at": "2026-11-01T07:00:00.000Z",
        "updated_at": "2026-11-01T08:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 2.4. Get Lead Detail

Retrieves complete profile details, descending interaction timeline, and audit history for a single lead.

- **Method**: `GET`
- **Route**: `/api/internal/leads/[id]`
- **Handler**: [`src/app/api/internal/leads/[id]/route.ts`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/app/api/internal/leads/[id]/route.ts)

#### Example Request
```bash
curl -X GET "https://nalarsolusidigital.my.id/api/internal/leads/9a3f4e21-508b-4bcf-a6e5-4700d86fc35b" \
  -H "Authorization: Bearer <TEPA_API_KEY>"
```

#### Example Response (HTTP 200)
```json
{
  "ok": true,
  "data": {
    "lead": {
      "id": "9a3f4e21-508b-4bcf-a6e5-4700d86fc35b",
      "nama_bisnis": "Ruang Konveksi Solo",
      "status": "siap_kirim"
    },
    "interactions": [
      {
        "id": "23d1c4b7-890e-43a1-9a71-6cbf29ad30e1",
        "lead_id": "9a3f4e21-508b-4bcf-a6e5-4700d86fc35b",
        "jenis": "catatan",
        "isi": "Nomor WhatsApp aktif dan responsif.",
        "terjadi_pada": "2026-11-01T08:00:00.000Z",
        "channel": "wa_business",
        "created_at": "2026-11-01T08:00:00.000Z"
      }
    ],
    "auditLogs": [
      {
        "id": "8fbc923a-1294-47b2-bd72-4752b0ae4562",
        "lead_id": "9a3f4e21-508b-4bcf-a6e5-4700d86fc35b",
        "aksi": "status: terverifikasi → siap_kirim",
        "detail": "Siap masuk antrean outreach",
        "created_at": "2026-11-01T08:00:00.000Z"
      }
    ]
  }
}
```

---

### 2.5. Record Interaction & Transition Status

Records an interaction event (`penawaran`, `followup_1`, `followup_2`, `balasan_masuk`, `catatan`) and optionally updates the lead's status. Enforces all operational rules (e.g. maximum 2x follow-up).

- **Method**: `POST`
- **Route**: `/api/internal/leads/[id]/interactions`
- **Handler**: [`src/app/api/internal/leads/[id]/interactions/route.ts`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/app/api/internal/leads/[id]/interactions/route.ts)
- **Request Body (JSON)**:
  - `jenis` *(required, string)*: `'penawaran'` | `'followup_1'` | `'followup_2'` | `'balasan_masuk'` | `'catatan'`
  - `isi` *(optional, string)*: Interaction summary or prospect's response text.
  - `terjadi_pada` *(optional, string, ISO 8601)*: Event timestamp (supports backdating). Defaults to now.
  - `channel` *(optional, string, default: `'wa_business'`)*: Communication channel.
  - `status` *(optional, [`LeadStatus`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/lib/admin/leads/types.ts#L1-L14))*: Target lead status. If omitted, it automatically infers appropriate transitions (`penawaran` &rarr; `terkirim`, `followup_1` &rarr; `followup_1`, `balasan_masuk` &rarr; `replied`).

#### Example Request: Record First Offer
```bash
curl -X POST "https://nalarsolusidigital.my.id/api/internal/leads/9a3f4e21-508b-4bcf-a6e5-4700d86fc35b/interactions" \
  -H "Authorization: Bearer <TEPA_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "jenis": "penawaran",
    "isi": "Pesan penawaran website katalog terkirim via WhatsApp Business",
    "terjadi_pada": "2026-11-02T10:00:00+07:00"
  }'
```

#### Example Response (HTTP 200)
```json
{
  "ok": true,
  "data": {
    "lead": {
      "id": "9a3f4e21-508b-4bcf-a6e5-4700d86fc35b",
      "status": "terkirim",
      "updated_at": "2026-11-02T03:00:00.000Z"
    },
    "interaction": {
      "id": "14f2e96d-3199-4c11-9a77-38019b8fc6a4",
      "lead_id": "9a3f4e21-508b-4bcf-a6e5-4700d86fc35b",
      "jenis": "penawaran",
      "isi": "Pesan penawaran website katalog terkirim via WhatsApp Business",
      "terjadi_pada": "2026-11-02T03:00:00.000Z",
      "channel": "wa_business"
    }
  }
}
```

---

### 2.6. Patch Lead Fields & Status

Directly updates a lead's status, verification status, verification source, or notes. Validates transition rules and logs an audit record.

- **Method**: `PATCH`
- **Route**: `/api/internal/leads/[id]`
- **Handler**: [`src/app/api/internal/leads/[id]/route.ts`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/app/api/internal/leads/[id]/route.ts)
- **Request Body (JSON)**:
  - `status` *(required, [`LeadStatus`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/lib/admin/leads/types.ts#L1-L14))*: Target status to transition to.
  - `verification_status` *(optional, [`VerificationStatus`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/lib/admin/leads/types.ts#L16-L21))*: `'belum'` | `'terverifikasi'` | `'parsial'` | `'hold'` | `'tidak_layak'`.
  - `verification_source` *(optional, string)*: Verification source details.
  - `catatan` *(optional, string)*: Internal operational notes.

#### Example Request: Pause Lead After Follow-up 2
```bash
curl -X PATCH "https://nalarsolusidigital.my.id/api/internal/leads/9a3f4e21-508b-4bcf-a6e5-4700d86fc35b" \
  -H "Authorization: Bearer <TEPA_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "pause",
    "catatan": "Di-pause otomatis sesuai aturan operasional outreach Nalar."
  }'
```

#### Example Response (HTTP 200)
```json
{
  "ok": true,
  "data": {
    "id": "9a3f4e21-508b-4bcf-a6e5-4700d86fc35b",
    "status": "pause",
    "catatan": "Di-pause otomatis sesuai aturan operasional outreach Nalar.",
    "updated_at": "2026-11-02T03:05:00.000Z"
  }
}
```

---

### 2.7. Batch Import Leads

Imports an array of lead objects directly from automated scraping, research batches, or webhook pipelines. Executes global phone number normalization and deduplication automatically.

- **Method**: `POST`
- **Route**: `/api/internal/import`
- **Handler**: [`src/app/api/internal/import/route.ts`](file:///home/rizalkurnia/Projects/NalarDigital/nalarsolusidigital/src/app/api/internal/import/route.ts)
- **Request Body (JSON)**:
  - `batch_riset` *(optional, string)*: Batch tag to associate with this import (e.g. `"2026-11-01-wave2"`).
  - `leads` *(required, array of objects)*: Array of lead rows. Key names can match Google Sheets headers or camelCase/snake_case aliases.

#### Supported Field Names in Lead Objects
- `Nama Bisnis` / `nama_bisnis` *(required)*
- `Nomor Telepon` / `nomor_telepon` *(required)*
- `Tier` / `tier` *(1–4, defaults to 2)*
- `Sektor` / `sektor`
- `Kota` / `kota`
- `Wilayah` / `wilayah`
- `Status WA` / `Status Riset` / `status`
- `Sumber Verifikasi` / `verification_source`
- `Strategi & Sudut Pandang Pitching` / `strategi_pitch`
- `Verified GBP` / `verified_gbp`
- `Rating` / `rating`
- `Jumlah Ulasan` / `jumlah_ulasan`

#### Example Request
```bash
curl -X POST "https://nalarsolusidigital.my.id/api/internal/import" \
  -H "Authorization: Bearer <TEPA_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "batch_riset": "2026-11-01-wave2",
    "leads": [
      {
        "Tier": "1",
        "Nama Bisnis": "Batu Alam Nusantara",
        "Sektor": "Batu Alam & Konstruksi",
        "Kota": "Bandung",
        "Wilayah": "Bandung Jabar",
        "Nomor Telepon": "0815-2996-4902",
        "Status Riset": "TERVERIFIKASI",
        "Sumber Verifikasi": "situs resmi live cek",
        "Strategi & Sudut Pandang Pitching": "Katalog digital ekspor batu alam."
      },
      {
        "Tier": "2",
        "Nama Bisnis": "Duplikat Prospek",
        "Nomor Telepon": "0815-2996-4902"
      }
    ]
  }'
```

#### Example Response (HTTP 200)
```json
{
  "ok": true,
  "data": {
    "masuk": 1,
    "dilewati_duplikat": 1,
    "gagal": 0,
    "errors": []
  }
}
```

---

## 3. Summary of Status Enums

### `LeadStatus`
- `'riset'`: Initial research stage.
- `'terverifikasi'`: Phone number verified.
- `'hold'`: Verification paused / awaiting manual confirmation.
- `'tidak_layak'`: Lead or contact disqualified.
- `'siap_kirim'`: In outreach queue, ready to send.
- `'terkirim'`: First pitch sent via WhatsApp.
- `'followup_1'`: First follow-up sent.
- `'followup_2'`: Second follow-up sent.
- `'pause'`: Follow-up paused (e.g. after 2 follow-ups without response).
- `'replied'`: Prospect replied.
- `'closed'`: Deal closed successfully.
- `'do_not_contact'`: Prospect permanently blocked from further contact.
- `'benchmark_only'`: Tier 4 benchmark competitor lead (never contacted).

### `VerificationStatus`
- `'belum'`: Unverified.
- `'terverifikasi'`: Verified and active.
- `'parsial'`: Partially verified (triggers warning when moved to `siap_kirim`).
- `'hold'`: Requires manual check.
- `'tidak_layak'`: Invalid or uncontactable.
