import { NextRequest, NextResponse } from 'next/server';
import { validateInternalApiKey } from '@/lib/admin/api-auth';
import { getLeadDetail, transitionLeadWithAudit } from '@/lib/admin/leads/repository';
import { LeadStatus, VerificationStatus } from '@/lib/admin/leads/types';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = validateInternalApiKey(req);
  if (!auth.authorized) {
    return auth.unauthorizedResponse!;
  }

  try {
    const { id } = await params;
    const detail = await getLeadDetail(id, true);

    if (!detail) {
      return NextResponse.json({ ok: false, error: 'Lead not found.' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      data: detail,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = validateInternalApiKey(req);
  if (!auth.authorized) {
    return auth.unauthorizedResponse!;
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const toStatus = body.status as LeadStatus;
    const verificationStatus = body.verification_status as VerificationStatus | undefined;
    const verificationSource = body.verification_source as string | undefined;
    const catatan = body.catatan as string | undefined;

    if (!toStatus) {
      return NextResponse.json(
        { ok: false, error: 'Field "status" is required in request body.' },
        { status: 400 }
      );
    }

    const result = await transitionLeadWithAudit(
      {
        leadId: id,
        toStatus,
        verificationStatus,
        verificationSource,
        catatan,
        actorPrefix: 'api: ',
      },
      true
    );

    return NextResponse.json({
      ok: true,
      data: result.lead,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

