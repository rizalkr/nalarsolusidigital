import 'server-only';

import { createClient, createServiceRoleClient } from '@/lib/admin/supabase/server';
import {
  Lead,
  Interaction,
  AuditLog,
  LeadStatus,
  VerificationStatus,
  InteractionType,
} from './types';
import {
  canTransition,
  getOperationalWindowStatus,
  isFollowUpDue,
} from './rules';
import {
  processImportRows,
  makeCompositeDedupKey,
  normalizeBusinessName,
} from './csv-mapper';

/**
 * Resolves database client: user SSR client or service role client.
 */
async function getSupabase(useServiceRole: boolean = false) {
  if (useServiceRole) {
    return createServiceRoleClient();
  }
  try {
    return await createClient();
  } catch {
    return createServiceRoleClient();
  }
}

export interface ListLeadsParams {
  search?: string;
  tier?: number;
  status?: LeadStatus;
  wilayah?: string;
  verification_status?: VerificationStatus;
  sortBy?: 'updated_at' | 'nama_bisnis';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ListLeadsResult {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function listLeads(
  params: ListLeadsParams = {},
  useServiceRole: boolean = false
): Promise<ListLeadsResult> {
  const supabase = await getSupabase(useServiceRole);
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 25));
  const offset = (page - 1) * limit;

  let query = supabase.from('leads').select('*', { count: 'exact' });

  if (params.search && params.search.trim()) {
    const s = params.search.trim();
    query = query.or(
      `nama_bisnis.ilike.%${s}%,kota.ilike.%${s}%,sektor.ilike.%${s}%,nomor_telepon.ilike.%${s}%`
    );
  }

  if (params.tier) {
    query = query.eq('tier', params.tier);
  }

  if (params.status) {
    query = query.eq('status', params.status);
  }

  if (params.wilayah) {
    query = query.eq('wilayah', params.wilayah);
  }

  if (params.verification_status) {
    query = query.eq('verification_status', params.verification_status);
  }

  const sortBy = params.sortBy || 'updated_at';
  const sortOrder = params.sortOrder || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) {
    throw new Error(`Failed to list leads: ${error.message}`);
  }

  const total = count || 0;
  return {
    leads: (data as Lead[]) || [],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getLeadDetail(
  id: string,
  useServiceRole: boolean = false
): Promise<{
  lead: Lead;
  interactions: Interaction[];
  auditLogs: AuditLog[];
} | null> {
  const supabase = await getSupabase(useServiceRole);

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (leadError || !lead) {
    return null;
  }

  const { data: interactions } = await supabase
    .from('interactions')
    .select('*')
    .eq('lead_id', id)
    .order('terjadi_pada', { ascending: false });

  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('lead_id', id)
    .order('created_at', { ascending: false });

  return {
    lead: lead as Lead,
    interactions: (interactions as Interaction[]) || [],
    auditLogs: (auditLogs as AuditLog[]) || [],
  };
}

export interface TransitionLeadOptions {
  leadId: string;
  toStatus: LeadStatus;
  verificationStatus?: VerificationStatus;
  verificationSource?: string | null;
  catatan?: string | null;
  interaction?: {
    jenis: InteractionType;
    isi?: string | null;
    terjadi_pada?: string;
    channel?: string;
  };
  actorPrefix?: string; // 'api: ' for Tepa or empty for UI
}

export async function transitionLeadWithAudit(
  options: TransitionLeadOptions,
  useServiceRole: boolean = false
): Promise<{ lead: Lead; interaction?: Interaction }> {
  const supabase = await getSupabase(useServiceRole);

  // Fetch current lead state
  const { data: currentLead, error: fetchErr } = await supabase
    .from('leads')
    .select('*')
    .eq('id', options.leadId)
    .single();

  if (fetchErr || !currentLead) {
    throw new Error('Prospek tidak ditemukan.');
  }

  const current = currentLead as Lead;
  const newVerificationStatus =
    options.verificationStatus || current.verification_status;

  // Validate transition according to Section 5 business rules
  const validation = canTransition(current.status, options.toStatus, {
    tier: current.tier,
    verification_status: newVerificationStatus,
    catatan: options.catatan || current.catatan,
  });

  if (!validation.allowed) {
    throw new Error(validation.reason || 'Transisi status tidak diizinkan oleh aturan bisnis.');
  }

  // Update lead
  const updatePayload: Partial<Lead> = {
    status: options.toStatus,
    updated_at: new Date().toISOString(),
  };

  if (options.verificationStatus) {
    updatePayload.verification_status = options.verificationStatus;
  }
  if (options.verificationSource !== undefined) {
    updatePayload.verification_source = options.verificationSource;
  }
  if (options.catatan !== undefined) {
    updatePayload.catatan = options.catatan;
  }

  const { data: updatedLead, error: updateErr } = await supabase
    .from('leads')
    .update(updatePayload)
    .eq('id', options.leadId)
    .select()
    .single();

  if (updateErr || !updatedLead) {
    throw new Error(`Gagal memperbarui prospek: ${updateErr?.message}`);
  }

  // Insert interaction if specified
  let savedInteraction: Interaction | undefined;
  if (options.interaction) {
    const occurredAt = options.interaction.terjadi_pada
      ? new Date(options.interaction.terjadi_pada).toISOString()
      : new Date().toISOString();

    const { data: intData, error: intErr } = await supabase
      .from('interactions')
      .insert({
        lead_id: options.leadId,
        jenis: options.interaction.jenis,
        isi: options.interaction.isi || null,
        terjadi_pada: occurredAt,
        channel: options.interaction.channel || 'wa_business',
      })
      .select()
      .single();

    if (!intErr && intData) {
      savedInteraction = intData as Interaction;
    }
  }

  // Write audit log
  const prefix = options.actorPrefix || '';
  const auditAksi = `${prefix}status: ${current.status} → ${options.toStatus}`;
  const detailParts: string[] = [];

  if (options.interaction) {
    detailParts.push(`Interaksi: ${options.interaction.jenis}`);
    if (options.interaction.isi) {
      detailParts.push(`Catatan: ${options.interaction.isi}`);
    }
  } else if (options.catatan) {
    detailParts.push(`Catatan: ${options.catatan}`);
  }

  await supabase.from('audit_logs').insert({
    lead_id: options.leadId,
    aksi: auditAksi,
    detail: detailParts.length > 0 ? detailParts.join(' | ') : null,
  });

  return {
    lead: updatedLead as Lead,
    interaction: savedInteraction,
  };
}

export async function getDashboardSummary(
  referenceDate: Date = new Date(),
  useServiceRole: boolean = false
) {
  const supabase = await getSupabase(useServiceRole);

  // 1. Fetch all leads to compute status and tier breakdowns
  const { data: allLeadsData, error } = await supabase
    .from('leads')
    .select('id, tier, status, verification_status, nama_bisnis, kota, sektor, updated_at');

  if (error) {
    throw new Error(`Failed to load dashboard summary: ${error.message}`);
  }

  const allLeads = (allLeadsData as Lead[]) || [];

  const statusCounts: Record<string, number> = {
    siap_kirim: 0,
    terkirim: 0,
    followup_1: 0,
    followup_2: 0,
    pause: 0,
    replied: 0,
    closed: 0,
    do_not_contact: 0,
    benchmark_only: 0,
    riset: 0,
    hold: 0,
    tidak_layak: 0,
  };

  const tierCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };

  allLeads.forEach((l) => {
    statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
    tierCounts[l.tier] = (tierCounts[l.tier] || 0) + 1;
  });

  // 2. Compute slots sent today (interactions of type 'penawaran' today in WIB)
  // Asia/Jakarta is UTC+7
  const wibTodayString = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
  }).format(referenceDate); // YYYY-MM-DD in WIB

  const startOfWibDay = new Date(`${wibTodayString}T00:00:00+07:00`).toISOString();
  const endOfWibDay = new Date(`${wibTodayString}T23:59:59+07:00`).toISOString();

  const { count: sentTodayCount } = await supabase
    .from('interactions')
    .select('id', { count: 'exact', head: true })
    .eq('jenis', 'penawaran')
    .gte('terjadi_pada', startOfWibDay)
    .lte('terjadi_pada', endOfWibDay);

  const slotsUsed = sentTodayCount || 0;
  const operationalStatus = getOperationalWindowStatus(referenceDate, slotsUsed);

  // 3. Compute follow-ups due today
  // Filter active outreach leads: terkirim & followup_1
  const candidateLeads = allLeads.filter((l) =>
    ['terkirim', 'followup_1'].includes(l.status)
  );

  const dueLeads: Array<{
    lead: Lead;
    daysOverdue: number;
    lastInteractionDate: string | null;
  }> = [];

  if (candidateLeads.length > 0) {
    const candidateIds = candidateLeads.map((l) => l.id);
    const { data: candidateInteractions } = await supabase
      .from('interactions')
      .select('*')
      .in('lead_id', candidateIds)
      .order('terjadi_pada', { ascending: false });

    const interactionMap = new Map<string, Interaction[]>();
    (candidateInteractions as Interaction[] || []).forEach((item) => {
      const arr = interactionMap.get(item.lead_id) || [];
      arr.push(item);
      interactionMap.set(item.lead_id, arr);
    });

    candidateLeads.forEach((lead) => {
      const ints = interactionMap.get(lead.id) || [];
      const dueCheck = isFollowUpDue(lead, ints, referenceDate);
      if (dueCheck.isDue) {
        dueLeads.push({
          lead,
          daysOverdue: dueCheck.daysOverdue,
          lastInteractionDate: dueCheck.lastInteractionDate,
        });
      }
    });

    // Sort by days overdue descending
    dueLeads.sort((a, b) => b.daysOverdue - a.daysOverdue);
  }

  // 4. "Baru siap kirim": 5 newest siap_kirim leads
  const newestSiapKirim = allLeads
    .filter((l) => l.status === 'siap_kirim')
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 5);

  return {
    totalLeads: allLeads.length,
    statusCounts,
    tierCounts,
    operationalStatus,
    dueLeads,
    newestSiapKirim,
  };
}

export async function getQueueData(
  referenceDate: Date = new Date(),
  useServiceRole: boolean = false
) {
  const supabase = await getSupabase(useServiceRole);

  // Fetch relevant queue leads: siap_kirim, terkirim, followup_1, hold
  const { data: leadsData } = await supabase
    .from('leads')
    .select('*')
    .in('status', ['siap_kirim', 'terkirim', 'followup_1', 'hold'])
    .order('updated_at', { ascending: true });

  const allQueueLeads = (leadsData as Lead[]) || [];

  // Block A: SIAP KIRIM (sorted by tier ASC, updated_at ASC)
  const siapKirim = allQueueLeads
    .filter((l) => l.status === 'siap_kirim')
    .sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
    });

  // Block B: FOLLOW-UP JATUH TEMPO
  const candidateLeads = allQueueLeads.filter((l) =>
    ['terkirim', 'followup_1'].includes(l.status)
  );

  const followupDue: Array<{
    lead: Lead;
    daysOverdue: number;
    lastInteractionDate: string | null;
  }> = [];

  if (candidateLeads.length > 0) {
    const candidateIds = candidateLeads.map((l) => l.id);
    const { data: candidateInteractions } = await supabase
      .from('interactions')
      .select('*')
      .in('lead_id', candidateIds)
      .order('terjadi_pada', { ascending: false });

    const interactionMap = new Map<string, Interaction[]>();
    (candidateInteractions as Interaction[] || []).forEach((item) => {
      const arr = interactionMap.get(item.lead_id) || [];
      arr.push(item);
      interactionMap.set(item.lead_id, arr);
    });

    candidateLeads.forEach((lead) => {
      const ints = interactionMap.get(lead.id) || [];
      const dueCheck = isFollowUpDue(lead, ints, referenceDate);
      if (dueCheck.isDue) {
        followupDue.push({
          lead,
          daysOverdue: dueCheck.daysOverdue,
          lastInteractionDate: dueCheck.lastInteractionDate,
        });
      }
    });

    followupDue.sort((a, b) => b.daysOverdue - a.daysOverdue);
  }

  // Block C: HOLD (status = 'hold' or verification_status = 'hold')
  const holdList = allQueueLeads.filter(
    (l) => l.status === 'hold' || l.verification_status === 'hold'
  );

  return {
    siapKirim,
    followupDue,
    holdList,
  };
}

export interface ImportLeadsOptions {
  defaultBatchRiset?: string | null;
  actorPrefix?: string;
  strictValidation?: boolean;
}

export async function importLeads(
  rows: Array<Record<string, unknown>>,
  options: ImportLeadsOptions = {},
  useServiceRole: boolean = false
) {
  const supabase = await getSupabase(useServiceRole);

  // Fetch all existing normalized phones AND nama_bisnis for composite dedup
  const { data: existingLeadsData } = await supabase
    .from('leads')
    .select('nomor_telepon_normalized, nama_bisnis');

  const existingLeadKeySet = new Set<string>();
  if (existingLeadsData) {
    existingLeadsData.forEach((row: { nomor_telepon_normalized?: string; nama_bisnis?: string }) => {
      if (row.nomor_telepon_normalized && row.nama_bisnis) {
        existingLeadKeySet.add(
          makeCompositeDedupKey(row.nomor_telepon_normalized, row.nama_bisnis)
        );
      }
    });
  }

  const summary = processImportRows(rows, {
    defaultBatchRiset: options.defaultBatchRiset,
    existingLeadKeySet,
    strictValidation: options.strictValidation,
  });

  if (summary.leads.length === 0) {
    return {
      masuk: 0,
      dilewati_duplikat: summary.dilewati_duplikat,
      gagal: summary.gagal,
      errors: summary.errors,
      rows: summary.rows,
    };
  }

  // Prepare records for database insertion
  const insertPayloads = summary.leads.map((item) => ({
    tier: item.tier,
    sub_kelompok: item.sub_kelompok,
    sektor: item.sektor,
    kota: item.kota,
    wilayah: item.wilayah,
    nama_bisnis: item.nama_bisnis,
    tipe_usaha: item.tipe_usaha,
    verified_gbp: item.verified_gbp,
    jumlah_ulasan: item.jumlah_ulasan,
    rating: item.rating,
    jumlah_foto: item.jumlah_foto,
    nomor_telepon: item.nomor_telepon,
    nomor_telepon_normalized: item.nomor_telepon_normalized,
    tipe_kontak: item.tipe_kontak,
    link_wa: item.link_wa,
    status_web: item.status_web,
    url_medsos: item.url_medsos,
    strategi_pitch: item.strategi_pitch,
    alamat: item.alamat,
    link_maps: item.link_maps,
    status: item.status,
    verification_status: item.verification_status,
    verification_source: item.verification_source,
    batch_riset: item.batch_riset,
    catatan: item.catatan,
  }));

  // Batch insert into leads table
  const { data: insertedLeads, error: insertError } = await supabase
    .from('leads')
    .insert(insertPayloads)
    .select();

  if (insertError) {
    throw new Error(`Gagal menyimpan leads ke database: ${insertError.message}`);
  }

  const inserted = (insertedLeads as Lead[]) || [];

  // If master sheet rows had initial outreach timestamp, insert initial interaction
  const initialInteractions: Array<{
    lead_id: string;
    jenis: InteractionType;
    isi: string | null;
    terjadi_pada: string;
  }> = [];

  const auditLogsPayload: Array<{
    lead_id: string;
    aksi: string;
    detail: string | null;
  }> = [];

  const prefix = options.actorPrefix || '';

  inserted.forEach((lead) => {
    const originalItem = summary.leads.find(
      (s) =>
        s.nomor_telepon_normalized === lead.nomor_telepon_normalized &&
        normalizeBusinessName(s.nama_bisnis) === normalizeBusinessName(lead.nama_bisnis)
    );

    if (
      originalItem?.initial_interaction_date &&
      ['terkirim', 'followup_1', 'followup_2'].includes(lead.status)
    ) {
      initialInteractions.push({
        lead_id: lead.id,
        jenis: 'penawaran',
        isi: originalItem.initial_interaction_note || 'Penawaran awal bawaan master sheet',
        terjadi_pada: new Date(originalItem.initial_interaction_date).toISOString(),
      });
    }

    auditLogsPayload.push({
      lead_id: lead.id,
      aksi: `${prefix}import: baru (${lead.status})`,
      detail: lead.batch_riset ? `Batch: ${lead.batch_riset}` : 'Import master awal',
    });
  });

  if (initialInteractions.length > 0) {
    await supabase.from('interactions').insert(initialInteractions);
  }

  if (auditLogsPayload.length > 0) {
    await supabase.from('audit_logs').insert(auditLogsPayload);
  }

  return {
    masuk: inserted.length,
    dilewati_duplikat: summary.dilewati_duplikat,
    gagal: summary.gagal,
    errors: summary.errors,
    rows: summary.rows,
  };
}
