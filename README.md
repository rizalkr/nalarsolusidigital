# Nalar Solusi Digital — Website & Admin CRM

Internal administration system and marketing website for **Nalar Solusi Digital** (digital solution services based in Klaten, Central Java).

---

## Architecture Overview

- **Framework**: Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS.
- **Website Routes**: Public marketing pages (`src/app/page.tsx`, etc.).
- **Admin System**: Route group `(admin)` mapped to path `/admin/*`.
- **Database & Auth**: Supabase (PostgreSQL + Supabase Auth).
- **Testing**: Vitest for pure business rules and data transformations.
- **Deployment**: Single Vercel deployment (existing project, single domain).

---

## Admin Nalar — Module 1: CRM Leads

Module 1 replaces disparate Google Sheets and markdown queues with a unified, dogfooded CRM system to track prospect statuses, monitor daily outreach operational rules, and enforce follow-up rhythms.

### 1. Manual Setup Checklist for Rizal

Complete the following steps before launching Admin Nalar in development or production:

1. **Create a new Supabase Project**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard) and create a new project on the free tier specifically for Admin Nalar (the marketing website does not use the database).
   - In **Project Settings -> API**, copy:
     - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public key` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role secret key` -> `SUPABASE_SERVICE_ROLE_KEY`
2. **Execute Database Schema**:
   - In the Supabase SQL Editor, paste and run the contents of [`supabase/schema.sql`](supabase/schema.sql). This sets up `leads`, `interactions`, `audit_logs`, indexes, `updated_at` triggers, and Row Level Security (RLS) policies.
3. **Create the Admin User**:
   - In Supabase Dashboard -> **Authentication -> Users -> Add User -> Create User**.
   - Enter your owner email and a strong password (check *Auto Confirm User*).
4. **Configure Environment Variables**:
   - For local development: add credentials to `.env.local` (never commit real credentials).
   - For production deployment: add the variables to the **existing Vercel project** settings (`Settings -> Environment Variables`):
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `TEPA_API_KEY` (generate using `openssl rand -hex 32` for Tepa agent access)

---

## Business Rules & Operational Limits

1. **Maximum 2x Follow-up**:
   - Prospek can receive up to two follow-ups (`followup_1` then `followup_2`).
   - After `followup_2` without a reply, the prospect can only be moved to `pause` or `replied`. Direct scheduling of further follow-up is blocked.
2. **Tier 4 = Benchmark-Only**:
   - Tier 4 prospects cannot be moved to outreach queues (`siap_kirim`, `terkirim`, `followup_*`).
   - Status transitions are restricted to `benchmark_only`, `tidak_layak`, or `do_not_contact`.
3. **Do Not Contact = Total Block**:
   - Prospects marked `do_not_contact` have all operational action buttons permanently disabled.
4. **Unverified Numbers Cannot Move to Siap Kirim**:
   - Moving to `siap_kirim` requires `verification_status = 'terverifikasi'` or `'parsial'` (with an alert warning). Unverified or hold statuses are blocked.
5. **Daily Outreach Window**:
   - Outreach limit: Maximum 5 new sends per day (`09:00 - 15:00 WIB`, Monday to Friday).
   - The dashboard displays slots used today (`X/5`) and operational hours status. Outside operational hours, sends can still be recorded with a warning for backdating purposes.
6. **Manual WhatsApp Dispatch**:
   - No automated blasting. The operator clicks "Buka Chat WA" (opens official `wa.me` in a new tab) -> manually sends the message -> marks as sent.
7. **Follow-up Due in 7 Days**:
   - Follow-up is flagged as due 7 calendar days after the latest outreach interaction without a subsequent reply (`FOLLOW_UP_DAYS = 7`).

---

## CSV Import Formats & Mapping

The importer at `/admin/leads/import` supports two CSV formats with automatic phone deduplication (normalizes to `628...` and skips existing numbers):

### Format 1: Master Sheet (20 Columns)
- **Columns**: `Tier`, `Sub-Kelompok`, `Sektor & Kota`, `Nama Bisnis`, `Tipe Usaha`, `Verified GBP`, `Jumlah Ulasan`, `Rating`, `Jumlah Foto`, `Nomor Telepon`, `Tipe Kontak`, `Link WA`, `Status Web`, `URL / Medsos Saat Ini`, `Strategi & Sudut Pandang Pitching`, `Status WA`, `Tanggal/Waktu Penawaran`, `Detail Penawaran & Catatan`, `Alamat Lengkap`, `Link Google Maps`.
- **Heuristics**:
  - Combined `Sektor & Kota` is split automatically (e.g. `"Kontraktor Bangunan - Surakarta"`).
  - Status defaults to `riset`, or `terkirim` / `siap_kirim` if specified in `Status WA`. If an outreach date exists in `Tanggal/Waktu Penawaran`, an initial `penawaran` interaction is automatically created.

### Format 2: Weekend Research Sheet ("Masterleads Baru")
- **Columns**: Same core columns plus mandatory **`Wilayah`** (e.g., `"Solo Raya"`, `"Bandung Jabar"`) and optional **`Batch Riset`** (or entered manually in the import form).
- **Status Mapping**:
  - `"TERVERIFIKASI"` -> `verification_status = 'terverifikasi'`, initial status `siap_kirim`.
  - `"BELUM PASTI"` / hold -> `verification_status = 'hold'`, status `hold`.
  - `"TIDAK LAYAK WA"` -> `verification_status = 'tidak_layak'`, status `tidak_layak`.
  - Verification details (e.g. "situs resmi", "cek live") are mapped to `verification_source`.

---

## Internal API for Operator AI Agent (Tepa)

All internal programmatic requests must include:
`Authorization: Bearer <TEPA_API_KEY>`

Every mutation writes an audit log entry prefixed with `api: `.

For full payload contracts, query parameters, error responses, and TypeScript type definitions, see the dedicated reference:
👉 **[Full Internal API Documentation](docs/internal-api.md)**

### Endpoints Overview

#### 1. Get Due Follow-ups
`GET /api/internal/followups-due?date=YYYY-MM-DD`
```bash
curl -X GET "https://nalarsolusidigital.my.id/api/internal/followups-due?date=2026-11-04" \
  -H "Authorization: Bearer <TEPA_API_KEY>"
```

#### 2. Get Queue Summary
`GET /api/internal/queue`
```bash
curl -X GET "https://nalarsolusidigital.my.id/api/internal/queue" \
  -H "Authorization: Bearer <TEPA_API_KEY>"
```

#### 3. Search and List Leads
`GET /api/internal/leads?status=siap_kirim&tier=1&q=surakarta&page=1&limit=25`
```bash
curl -X GET "https://nalarsolusidigital.my.id/api/internal/leads?status=siap_kirim" \
  -H "Authorization: Bearer <TEPA_API_KEY>"
```

#### 4. Get Lead Detail
`GET /api/internal/leads/<id>`
```bash
curl -X GET "https://nalarsolusidigital.my.id/api/internal/leads/<id>" \
  -H "Authorization: Bearer <TEPA_API_KEY>"
```

#### 5. Record Interaction & Transition Status
`POST /api/internal/leads/<id>/interactions`
```bash
curl -X POST "https://nalarsolusidigital.my.id/api/internal/leads/<id>/interactions" \
  -H "Authorization: Bearer <TEPA_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "jenis": "followup_1",
    "isi": "Follow-up via WhatsApp Business",
    "terjadi_pada": "2026-11-04T10:00:00+07:00"
  }'
```

#### 6. Patch Lead Fields & Status
`PATCH /api/internal/leads/<id>`
```bash
curl -X PATCH "https://nalarsolusidigital.my.id/api/internal/leads/<id>" \
  -H "Authorization: Bearer <TEPA_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "pause",
    "catatan": "Di-pause setelah follow-up ke-2 tanpa balasan"
  }'
```

#### 7. Batch Import Leads
`POST /api/internal/import`
```bash
curl -X POST "https://nalarsolusidigital.my.id/api/internal/import" \
  -H "Authorization: Bearer <TEPA_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "batch_riset": "2026-11-01-wave2",
    "leads": [
      {
        "Tier": "1",
        "Nama Bisnis": "PT Cipta Karya",
        "Sektor": "Kontraktor Bangunan",
        "Kota": "Surakarta",
        "Wilayah": "Solo Raya",
        "Nomor Telepon": "081234567890",
        "Status Riset": "TERVERIFIKASI"
      }
    ]
  }'
```

---

## Roadmap

- **Module 1 (Done)**: CRM Leads, Queue Management, Follow-up Tracker, CSV Importer, Tepa Internal API.
- **Module 2 (Upcoming)**: Invoice & Payment Reminder (`app/(admin)/admin/(billing)/...`), milestone tracking, and WhatsApp reminder draft generation.
- **Module 3**: Performance analytics, client onboarding portal, and automated weekly digests.

