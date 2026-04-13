'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type LeadSettingsState = { error?: string; success?: boolean } | undefined;

export async function getLeadSettings() {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const s = await prisma.siteSettings.findUnique({
    where: { tenantId },
    select: {
      leadNotifyEmail: true,
      leadWebhookUrl: true,
      leadAutoReply: true,
      leadAutoReplyMsg: true,
    },
  });
  return s ?? { leadNotifyEmail: '', leadWebhookUrl: '', leadAutoReply: true, leadAutoReplyMsg: '' };
}

export async function saveLeadSettingsAction(prev: LeadSettingsState, fd: FormData): Promise<LeadSettingsState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  const data = {
    leadNotifyEmail: (fd.get('leadNotifyEmail') as string)?.trim() || '',
    leadWebhookUrl: (fd.get('leadWebhookUrl') as string)?.trim() || '',
    leadAutoReply: fd.get('leadAutoReply') === 'on',
    leadAutoReplyMsg: (fd.get('leadAutoReplyMsg') as string)?.trim() || '',
  };

  if (data.leadWebhookUrl && !data.leadWebhookUrl.startsWith('http')) {
    return { error: 'כתובת Webhook חייבת להתחיל ב-http:// או https://' };
  }

  try {
    await prisma.siteSettings.upsert({
      where: { tenantId },
      update: data,
      create: { tenantId, ...data },
    });
  } catch {
    return { error: 'שגיאה בשמירת ההגדרות' };
  }

  revalidatePath('/dashboard/leads');
  return { success: true };
}
