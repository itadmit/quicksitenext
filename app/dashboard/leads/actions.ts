'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type LeadActionState = { error?: string; success?: boolean } | undefined;

export async function createLeadAction(prev: LeadActionState, fd: FormData): Promise<LeadActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  const name = (fd.get('name') as string)?.trim();
  const email = (fd.get('email') as string)?.trim();
  const phone = (fd.get('phone') as string)?.trim() || null;
  const company = (fd.get('company') as string)?.trim() || null;
  const source = (fd.get('source') as string)?.trim() || 'manual';
  const message = (fd.get('message') as string)?.trim() || null;
  const status = (fd.get('status') as string) || 'NEW';

  if (!name || !email) return { error: 'שם ואימייל הם שדות חובה' };

  try {
    await prisma.lead.create({
      data: { tenantId, name, email, phone, company, source, message, status },
    });
  } catch {
    return { error: 'שגיאה ביצירת הליד' };
  }

  revalidatePath('/dashboard/leads');
  return { success: true };
}

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
