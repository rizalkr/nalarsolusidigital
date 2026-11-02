import { NextRequest, NextResponse } from 'next/server';
import { validateInternalApiKey } from '@/lib/admin/api-auth';
import { getQueueData, getDashboardSummary } from '@/lib/admin/leads/repository';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = validateInternalApiKey(req);
  if (!auth.authorized) {
    return auth.unauthorizedResponse!;
  }

  try {
    const queueData = await getQueueData(new Date(), true);
    const summary = await getDashboardSummary(new Date(), true);

    return NextResponse.json({
      ok: true,
      data: {
        operational_status: summary.operationalStatus,
        siap_kirim_count: queueData.siapKirim.length,
        followup_due_count: queueData.followupDue.length,
        hold_count: queueData.holdList.length,
        siap_kirim: queueData.siapKirim.map((l) => ({
          id: l.id,
          tier: l.tier,
          nama_bisnis: l.nama_bisnis,
          sektor: l.sektor,
          kota: l.kota,
          wilayah: l.wilayah,
          nomor_telepon: l.nomor_telepon,
          link_wa: l.link_wa,
          strategi_pitch: l.strategi_pitch,
          updated_at: l.updated_at,
        })),
        hold: queueData.holdList.map((l) => ({
          id: l.id,
          nama_bisnis: l.nama_bisnis,
          tier: l.tier,
          nomor_telepon: l.nomor_telepon,
          verification_status: l.verification_status,
          verification_source: l.verification_source,
          catatan: l.catatan,
        })),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

