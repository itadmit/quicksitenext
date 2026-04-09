'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type LeadActionState = { error?: string; success?: boolean } | undefined;

export async function updateLeadAction(prev: LeadActionState, fd: FormData): Promise<LeadActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const id = fd.get('id') as string;

  const lead = await prisma.lead.findFirst({ where: { id, tenantId } });
  if (!lead) return { error: 'ליד לא נמצא' };

  const status = (fd.get('status') as string) || lead.status;
  const internalNotes = (fd.get('internalNotes') as string) ?? lead.internalNotes;
  const lastResponseSummary = (fd.get('lastResponseSummary') as string) ?? lead.lastResponseSummary;
  const lastResponseChannel = (fd.get('lastResponseChannel') as string)?.trim() || lead.lastResponseChannel;

  try {
    await prisma.lead.update({
      where: { id },
      data: {
        status,
        internalNotes: internalNotes || null,
        lastResponseSummary: lastResponseSummary || null,
        lastResponseChannel: lastResponseChannel || null,
        lastResponseAt: lastResponseSummary ? new Date() : lead.lastResponseAt,
      },
    });
  } catch {
    return { error: 'שגיאה בעדכון הליד' };
  }

  revalidatePath('/dashboard/leads');
  return { success: true };
}

export async function deleteLeadAction(id: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  await prisma.lead.deleteMany({ where: { id, tenantId } });
  revalidatePath('/dashboard/leads');
}

export async function bulkUpdateLeadStatusAction(ids: string[], status: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  await prisma.lead.updateMany({ where: { id: { in: ids }, tenantId }, data: { status } });
  revalidatePath('/dashboard/leads');
}

export async function exportLeadsCsvAction(): Promise<string> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const leads = await prisma.lead.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });

  const header = 'שם,אימייל,טלפון,חברה,מקור,הודעה,סטטוס,תאריך\n';
  const rows = leads.map(l =>
    [l.name, l.email, l.phone ?? '', l.company ?? '', l.source, (l.message ?? '').replace(/[\n,]/g, ' '), l.status, new Date(l.createdAt).toLocaleDateString('he-IL')].map(v => `"${v}"`).join(',')
  ).join('\n');

  return '\uFEFF' + header + rows;
}
