import React from 'react';
import { notFound } from 'next/navigation';
import { getLeadDetail, getDashboardSummary } from '@/lib/admin/leads/repository';
import { LeadDetailView } from '@/components/admin/LeadDetailView';

export const dynamic = 'force-dynamic';

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const detail = await getLeadDetail(id);

  if (!detail) {
    notFound();
  }

  const summary = await getDashboardSummary();
  const todaySlotsUsed = summary.operationalStatus.slotsUsedToday;

  return (
    <LeadDetailView
      lead={detail.lead}
      interactions={detail.interactions}
      auditLogs={detail.auditLogs}
      todaySlotsUsed={todaySlotsUsed}
    />
  );
}

