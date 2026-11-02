import { NextRequest, NextResponse } from 'next/server';
import { validateInternalApiKey } from '@/lib/admin/api-auth';
import { transitionLeadWithAudit, getLeadDetail } from '@/lib/admin/leads/repository';
import { LeadStatus, InteractionType } from '@/lib/admin/leads/types';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const auth = validateInternalApiKey(req);
  if (!auth.authorized) {
    return auth.unauthorizedResponse!;
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const jenis = body.jenis as InteractionType;
    const isi = body.isi as string | undefined;
    const terjadiPada = body.terjadi_pada as string | undefined;
    const channel = body.channel as string | undefined;

    if (!jenis) {
      return NextResponse.json(
        { ok: false, error: 'Field "jenis" is required.' },
        { status: 400 }
      );
    }

    const detail = await getLeadDetail(id, true);
    if (!detail) {
      return NextResponse.json({ ok: false, error: 'Lead not found.' }, { status: 404 });
    }

    // Determine target status if not explicitly given:
    // If interaction is penawaran -> move to terkirim if currently siap_kirim
    // If followup_1 -> move to followup_1
    // If followup_2 -> move to followup_2
    // If balasan_masuk -> move to replied
    let targetStatus = body.status as LeadStatus | undefined;
    if (!targetStatus) {
      if (jenis === 'penawaran' && detail.lead.status === 'siap_kirim') {
        targetStatus = 'terkirim';
      } else if (jenis === 'followup_1') {
        targetStatus = 'followup_1';
      } else if (jenis === 'followup_2') {
        targetStatus = 'followup_2';
      } else if (jenis === 'balasan_masuk') {
        targetStatus = 'replied';
      } else {
        targetStatus = detail.lead.status;
      }
    }

    const result = await transitionLeadWithAudit(
      {
        leadId: id,
        toStatus: targetStatus,
        interaction: {
          jenis,
          isi: isi || null,
          terjadi_pada: terjadiPada || new Date().toISOString(),
          channel: channel || 'wa_business',
        },
        actorPrefix: 'api: ',
      },
      true
    );

    return NextResponse.json({
      ok: true,
      data: {
        lead: result.lead,
        interaction: result.interaction,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

