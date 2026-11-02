-- ==============================================================================
-- Migration: Composite Deduplication (nomor_telepon_normalized + nama_bisnis_normalized)
-- Description:
-- Replaces single-column phone uniqueness with composite uniqueness
-- (nomor_telepon_normalized, nama_bisnis_normalized).
-- Safe migration: existing data already satisfies phone-only unique,
-- so composite unique will not violate existing records.
-- ==============================================================================

-- 1. Add generated stored column for normalized business name (case-insensitive, trimmed)
alter table public.leads 
  add column if not exists nama_bisnis_normalized text 
  generated always as (lower(trim(nama_bisnis))) stored;

-- 2. Drop the legacy single-column unique constraint on nomor_telepon_normalized
alter table public.leads 
  drop constraint if exists leads_nomor_telepon_normalized_key;

-- 3. Add composite unique constraint on (nomor_telepon_normalized, nama_bisnis_normalized)
alter table public.leads 
  add constraint leads_nomor_telepon_normalized_nama_bisnis_normalized_key 
  unique (nomor_telepon_normalized, nama_bisnis_normalized);

-- 4. Create index for fast composite lookup
create index if not exists idx_leads_composite_dedup 
  on public.leads (nomor_telepon_normalized, nama_bisnis_normalized);

