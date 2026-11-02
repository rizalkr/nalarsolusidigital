'use server';

import { revalidatePath } from 'next/cache';
import { transitionLeadWithAudit, importLeads, type TransitionLeadOptions } from '@/lib/admin/leads/repository';

export interface ActionResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  warning?: string;
}

export async function updateLeadStatusAction(
  options: TransitionLeadOptions
): Promise<ActionResponse> {
  try {
    const result = await transitionLeadWithAudit({
      ...options,
      actorPrefix: '',
    });

    revalidatePath('/admin');
    revalidatePath('/admin/leads');
    revalidatePath(`/admin/leads/${options.leadId}`);
    revalidatePath('/admin/antrean');

    return { ok: true, data: result };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui status prospek.';
    return { ok: false, error: msg };
  }
}

export async function commitImportCsvAction(
  rows: Array<Record<string, unknown>>,
  defaultBatchRiset?: string | null
): Promise<ActionResponse<{
  masuk: number;
  dilewati_duplikat: number;
  gagal: number;
  errors: Array<{ baris: number; pesan: string }>;
  rows?: unknown[];
}>> {
  try {
    const summary = await importLeads(rows, {
      defaultBatchRiset,
      actorPrefix: '',
    });

    revalidatePath('/admin');
    revalidatePath('/admin/leads');
    revalidatePath('/admin/antrean');

    return { ok: true, data: summary };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal memproses import CSV.';
    return { ok: false, error: msg };
  }
}
