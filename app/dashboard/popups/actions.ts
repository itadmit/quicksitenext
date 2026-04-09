'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type PopupActionState = { error?: string; success?: boolean } | undefined;

function parsePopupData(fd: FormData) {
  return {
    name: (fd.get('name') as string)?.trim(),
    enabled: fd.get('enabled') === 'on',
    priority: parseInt(fd.get('priority') as string) || 50,
    trigger: (fd.get('trigger') as string) || 'on_load',
    delayMs: parseInt(fd.get('delayMs') as string) || 0,
    timeOnSiteMs: parseInt(fd.get('timeOnSiteMs') as string) || 15000,
    scrollDepthPercent: parseInt(fd.get('scrollDepthPercent') as string) || 50,
    title: (fd.get('title') as string)?.trim(),
    body: (fd.get('body') as string)?.trim(),
    imageUrl: (fd.get('imageUrl') as string)?.trim() || null,
    ctaLabel: (fd.get('ctaLabel') as string)?.trim() || null,
    ctaHref: (fd.get('ctaHref') as string)?.trim() || null,
    dismissLabel: (fd.get('dismissLabel') as string)?.trim() || 'סגור',
    frequency: (fd.get('frequency') as string) || 'once_per_session',
    hideDaysAfterDismiss: parseInt(fd.get('hideDaysAfterDismiss') as string) || 7,
    startDate: (fd.get('startDate') as string) ? new Date(fd.get('startDate') as string) : null,
    endDate: (fd.get('endDate') as string) ? new Date(fd.get('endDate') as string) : null,
  };
}

export async function createPopupAction(prev: PopupActionState, fd: FormData): Promise<PopupActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const data = parsePopupData(fd);

  if (!data.name) return { error: 'שם נדרש' };
  if (!data.title) return { error: 'כותרת נדרשת' };
  if (!data.body) return { error: 'תוכן נדרש' };

  try {
    await prisma.popup.create({ data: { tenantId, ...data } });
  } catch {
    return { error: 'שגיאה ביצירת הפופאפ' };
  }

  revalidatePath('/dashboard/popups');
  return { success: true };
}

export async function updatePopupAction(prev: PopupActionState, fd: FormData): Promise<PopupActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const id = fd.get('id') as string;

  const popup = await prisma.popup.findFirst({ where: { id, tenantId } });
  if (!popup) return { error: 'פופאפ לא נמצא' };

  const data = parsePopupData(fd);
  if (!data.name) return { error: 'שם נדרש' };
  if (!data.title) return { error: 'כותרת נדרשת' };
  if (!data.body) return { error: 'תוכן נדרש' };

  try {
    await prisma.popup.update({ where: { id }, data });
  } catch {
    return { error: 'שגיאה בעדכון הפופאפ' };
  }

  revalidatePath('/dashboard/popups');
  return { success: true };
}

export async function deletePopupAction(id: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  await prisma.popup.deleteMany({ where: { id, tenantId } });
  revalidatePath('/dashboard/popups');
}

export async function duplicatePopupAction(id: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const popup = await prisma.popup.findFirst({ where: { id, tenantId } });
  if (!popup) return;

  await prisma.popup.create({
    data: {
      tenantId,
      name: `${popup.name} (העתק)`,
      enabled: false,
      priority: popup.priority,
      trigger: popup.trigger,
      delayMs: popup.delayMs,
      timeOnSiteMs: popup.timeOnSiteMs,
      scrollDepthPercent: popup.scrollDepthPercent,
      title: popup.title,
      body: popup.body,
      imageUrl: popup.imageUrl,
      ctaLabel: popup.ctaLabel,
      ctaHref: popup.ctaHref,
      dismissLabel: popup.dismissLabel,
      frequency: popup.frequency,
      hideDaysAfterDismiss: popup.hideDaysAfterDismiss,
    },
  });

  revalidatePath('/dashboard/popups');
}
