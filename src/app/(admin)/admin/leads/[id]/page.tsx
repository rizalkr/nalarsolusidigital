import React from 'react';
import { notFound } from 'next/navigation';
import { getLeadDetail, getTodaySlotsUsed } from '@/lib/admin/leads/repository';
import { LeadDetailView } from '@/components/admin/LeadDetailView';

export const dynamic = 'force-dynamic';

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const [detail, todaySlotsUsed] = await Promise.all([
    getLeadDetail(id),
    getTodaySlotsUsed(),
  ]);

  if (!detail) {
    notFound();
  }

  return (
    <LeadDetailView
      lead={detail.lead}
      interactions={detail.interactions}
      auditLogs={detail.auditLogs}
      todaySlotsUsed={todaySlotsUsed}
    />
  );
}
