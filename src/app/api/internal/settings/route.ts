import { NextRequest, NextResponse } from 'next/server';
import { validateInternalApiKey } from '@/lib/admin/api-auth';
import { updateOperationalSettings, getOperationalSettings } from '@/lib/admin/leads/repository';
import { SETTINGS_LIMITS } from '@/lib/admin/leads/constants';
import { OperationalSettings } from '@/lib/admin/leads/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = validateInternalApiKey(req);
  if (!auth.authorized) {
    return auth.unauthorizedResponse!;
  }

  try {
    const settings = await getOperationalSettings(true);
    return NextResponse.json({
      ok: true,
      data: settings,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
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
        { ok: false, error: 'Malformed or missing JSON request body.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { ok: false, error: 'Request body must be a valid JSON object.' },
        { status: 400 }
      );
    }

    const updates: Partial<OperationalSettings> = {};

    // Validate maxDailySlots if present in request body
    if ('maxDailySlots' in body) {
      const val = body.maxDailySlots;
      if (
        typeof val !== 'number' ||
        !Number.isInteger(val) ||
        val < SETTINGS_LIMITS.maxDailySlots.min ||
        val > SETTINGS_LIMITS.maxDailySlots.max
      ) {
        return NextResponse.json(
          {
            ok: false,
            error: `Field "maxDailySlots" must be an integer between ${SETTINGS_LIMITS.maxDailySlots.min} and ${SETTINGS_LIMITS.maxDailySlots.max}.`,
          },
          { status: 400 }
        );
      }
      updates.maxDailySlots = val;
    }

    // Validate waAccounts if present in request body
    if ('waAccounts' in body) {
      const val = body.waAccounts;
      if (
        typeof val !== 'number' ||
        !Number.isInteger(val) ||
        val < SETTINGS_LIMITS.waAccounts.min ||
        val > SETTINGS_LIMITS.waAccounts.max
      ) {
        return NextResponse.json(
          {
            ok: false,
            error: `Field "waAccounts" must be an integer between ${SETTINGS_LIMITS.waAccounts.min} and ${SETTINGS_LIMITS.waAccounts.max}.`,
          },
          { status: 400 }
        );
      }
      updates.waAccounts = val;
    }

    // Require at least one valid recognized field
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'No valid operational settings provided. Whitelisted fields are "maxDailySlots" and "waAccounts".',
        },
        { status: 400 }
      );
    }

    const result = await updateOperationalSettings(updates, true);

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
