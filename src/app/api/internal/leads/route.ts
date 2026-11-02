import { NextRequest, NextResponse } from 'next/server';
import { validateInternalApiKey } from '@/lib/admin/api-auth';
import { listLeads } from '@/lib/admin/leads/repository';
import { LeadStatus, VerificationStatus } from '@/lib/admin/leads/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = validateInternalApiKey(req);
  if (!auth.authorized) {
    return auth.unauthorizedResponse!;
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || undefined;
    const tierStr = searchParams.get('tier');
    const tier = tierStr ? parseInt(tierStr, 10) : undefined;
    const status = (searchParams.get('status') as LeadStatus) || undefined;
    const wilayah = searchParams.get('wilayah') || undefined;
    const verificationStatus = (searchParams.get('verification_status') as VerificationStatus) || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);

    const result = await listLeads(
      {
        search,
        tier,
        status,
        wilayah,
        verification_status: verificationStatus,
        page,
        limit,
      },
      true
    );

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

