import { NextRequest, NextResponse } from 'next/server';
import { validateInternalApiKey } from '@/lib/admin/api-auth';
import { importLeads } from '@/lib/admin/leads/repository';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = validateInternalApiKey(req);
  if (!auth.authorized) {
    return auth.unauthorizedResponse!;
  }

  try {
    const body = await req.json();
    const rows = body.leads as Array<Record<string, string>>;
    const batchRiset = body.batch_riset as string | undefined;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Field "leads" must be a non-empty array of lead objects.' },
        { status: 400 }
      );
    }

    const summary = await importLeads(
      rows,
      {
        defaultBatchRiset: batchRiset || null,
        actorPrefix: 'api: ',
      },
      true
    );

    return NextResponse.json({
      ok: true,
      data: summary,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

