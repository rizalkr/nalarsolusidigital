import { NextRequest, NextResponse } from 'next/server';
import { validateInternalApiKey } from '@/lib/admin/api-auth';
import { importLeads } from '@/lib/admin/leads/repository';
import { LeadValidationError } from '@/lib/admin/leads/csv-mapper';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = validateInternalApiKey(req);
  if (!auth.authorized) {
    return auth.unauthorizedResponse!;
  }

  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Request body must be a valid JSON object.' },
        { status: 400 }
      );
    }

    const rows = body?.leads as Array<Record<string, unknown>> | undefined;
    const batchRiset = typeof body?.batch_riset === 'string' ? body.batch_riset : undefined;

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
        strictValidation: true,
      },
      true
    );

    return NextResponse.json({
      ok: true,
      data: summary,
    });
  } catch (err: unknown) {
    const isValidationError =
      err instanceof LeadValidationError ||
      err instanceof TypeError ||
      (err instanceof Error &&
        (err.message.startsWith('Baris ') ||
          err.message.includes('tidak valid') ||
          err.message.includes('wajib diisi') ||
          err.message.includes('Status outreach') ||
          err.message.includes('tidak boleh')));

    const statusCode = isValidationError ? 400 : 500;
    const message = err instanceof Error ? err.message : 'Internal Server Error';

    return NextResponse.json({ ok: false, error: message }, { status: statusCode });
  }
}
