import { NextRequest, NextResponse } from 'next/server';
import { validateInternalApiKey } from '@/lib/admin/api-auth';
import { getDashboardSummary } from '@/lib/admin/leads/repository';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = validateInternalApiKey(req);
  if (!auth.authorized) {
    return auth.unauthorizedResponse!;
  }

  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    const refDate = dateStr ? new Date(`${dateStr}T12:00:00+07:00`) : new Date();

    const summary = await getDashboardSummary(refDate, true);

    return NextResponse.json({
      ok: true,
      data: {
        date: refDate.toISOString(),
        total_due: summary.dueLeads.length,
        due_leads: summary.dueLeads.map(({ lead, daysOverdue, lastInteractionDate }) => ({
          id: lead.id,
          nama_bisnis: lead.nama_bisnis,
          tier: lead.tier,
          sektor: lead.sektor,
          kota: lead.kota,
          wilayah: lead.wilayah,
          nomor_telepon: lead.nomor_telepon,
          status: lead.status,
          days_overdue: daysOverdue,
          last_interaction_date: lastInteractionDate,
        })),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

