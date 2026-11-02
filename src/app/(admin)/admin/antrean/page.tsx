import React from 'react';
import { getQueueData } from '@/lib/admin/leads/repository';
import { AntreanView } from '@/components/admin/AntreanView';

export const dynamic = 'force-dynamic';

export default async function AntreanPage() {
  const { siapKirim, followupDue, holdList } = await getQueueData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">Antrean Operasional Outreach</h1>
        <p className="text-sm text-text-secondary mt-1">
          Fokus harian: Siap Kirim, Follow-up yang jatuh tempo, dan antrean verifikasi Hold.
        </p>
      </div>

      <AntreanView
        siapKirim={siapKirim}
        followupDue={followupDue}
        holdList={holdList}
      />
    </div>
  );
}

