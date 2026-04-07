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
