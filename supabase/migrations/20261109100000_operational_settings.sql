-- ==============================================================================
-- Migration: Operational Settings & Flexible System Audit Logs
-- Description:
-- 1. Create table public.settings for operational key-value configuration.
-- 2. Allow system-level audit logs by dropping NOT NULL constraint on audit_logs.lead_id.
-- ==============================================================================

-- 1. Create public.settings table
create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- 2. Row Level Security for settings
alter table public.settings enable row level security;

-- Grant permissions to authenticated and service_role
grant select, insert, update, delete on public.settings to authenticated;
grant select, insert, update, delete on public.settings to service_role;

-- Kebijakan RLS (Authenticated internal user can read and modify settings)
drop policy if exists "Authenticated users full access on settings" on public.settings;
create policy "Authenticated users full access on settings"
  on public.settings
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- 3. Make audit_logs.lead_id nullable for system-wide/operational audit events
alter table public.audit_logs alter column lead_id drop not null;
