-- ==============================================================================
-- Schema Admin Nalar - Modul 1: CRM Leads
-- Jalankan skema ini di Supabase SQL Editor pada project Supabase khusus Admin Nalar.
-- ==============================================================================

-- 0. Ekstensi UUID
create extension if not exists "pgcrypto";

-- 1. Enum lead_status
do $$ begin
  create type public.lead_status as enum (
    'riset',
    'terverifikasi',
    'hold',
    'tidak_layak',
    'siap_kirim',
    'terkirim',
    'followup_1',
    'followup_2',
    'pause',
    'replied',
    'closed',
    'do_not_contact',
    'benchmark_only'
  );
exception
  when duplicate_object then null;
end $$;

-- 2. Tabel leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  tier smallint not null check (tier between 1 and 4),
  sub_kelompok text,
  sektor text not null,
  kota text not null,
  wilayah text not null default '',
  nama_bisnis text not null,
  nama_bisnis_normalized text generated always as (lower(trim(nama_bisnis))) stored,
  tipe_usaha text,
  verified_gbp boolean,
  jumlah_ulasan integer,
  rating numeric(3, 2),
  jumlah_foto integer,
  nomor_telepon text not null,
  nomor_telepon_normalized text not null,
  tipe_kontak text,
  link_wa text,
  status_web text,
  url_medsos text,
  strategi_pitch text,
  alamat text,
  link_maps text,
  status public.lead_status not null default 'riset',
  verification_status text not null default 'belum'
    check (verification_status in ('belum', 'terverifikasi', 'parsial', 'hold', 'tidak_layak')),
  verification_source text,
  batch_riset text,
  catatan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_nomor_telepon_normalized_nama_bisnis_normalized_key unique (nomor_telepon_normalized, nama_bisnis_normalized)
);

-- 3. Tabel interactions
create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  jenis text not null
    check (jenis in ('penawaran', 'followup_1', 'followup_2', 'balasan_masuk', 'catatan')),
  isi text,
  terjadi_pada timestamptz not null default now(),
  channel text not null default 'wa_business',
  created_at timestamptz not null default now()
);

-- 4. Tabel audit_logs
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  aksi text not null,
  detail text,
  created_at timestamptz not null default now()
);

-- 5. Indexes
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_tier on public.leads(tier);
create index if not exists idx_leads_wilayah on public.leads(wilayah);
create index if not exists idx_leads_updated_at on public.leads(updated_at desc);
create index if not exists idx_leads_composite_dedup on public.leads(nomor_telepon_normalized, nama_bisnis_normalized);
create index if not exists idx_interactions_lead_terjadi on public.interactions(lead_id, terjadi_pada desc);
create index if not exists idx_interactions_jenis_terjadi on public.interactions(jenis, terjadi_pada desc);
create index if not exists idx_audit_logs_lead_created on public.audit_logs(lead_id, created_at desc);

-- 6. Trigger updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
  before update on public.leads
  for each row
  execute function public.set_updated_at();

-- 7. Row Level Security (RLS) & Hak Akses
alter table public.leads enable row level security;
alter table public.interactions enable row level security;
alter table public.audit_logs enable row level security;

-- Grant hak akses ke role authenticated
grant select, insert, update, delete on public.leads to authenticated;
grant select, insert, update, delete on public.interactions to authenticated;
grant select, insert, update, delete on public.audit_logs to authenticated;

-- Kebijakan RLS (1 user internal: authenticated user can perform all operations)
drop policy if exists "Authenticated users full access on leads" on public.leads;
create policy "Authenticated users full access on leads"
  on public.leads
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Authenticated users full access on interactions" on public.interactions;
create policy "Authenticated users full access on interactions"
  on public.interactions
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Authenticated users full access on audit_logs" on public.audit_logs;
create policy "Authenticated users full access on audit_logs"
  on public.audit_logs
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

