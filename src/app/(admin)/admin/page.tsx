import React from 'react';
import { getDashboardSummary } from '@/lib/admin/leads/repository';
import { DashboardView } from '@/components/admin/DashboardView';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">Dashboard CRM Leads</h1>
        <p className="text-sm text-text-secondary mt-1">
          Pantau batas operasional harian, jatuh tempo follow-up, dan distribusi prospek.
        </p>
      </div>

      <DashboardView summary={summary} />
    </div>
  );
}

