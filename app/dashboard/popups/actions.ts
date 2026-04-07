'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type PopupActionState = { error?: string; success?: boolean } | undefined;

export async function createPopupAction(prev: PopupActionState, fd: FormData): Promise<PopupActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  const name = (fd.get('name') as string)?.trim();
  const title = (fd.get('title') as string)?.trim();
  const body = (fd.get('body') as string)?.trim();

  if (!name) return { error: 'שם נדרש' };
  if (!title) return { error: 'כותרת נדרשת' };
  if (!body) return { error: 'תוכן נדרש' };

  try {
    await prisma.popup.create({
      data: {
        tenantId,
        name,
        enabled: fd.get('enabled') === 'on',
        priority: parseInt(fd.get('priority') as string) || 50,
        trigger: (fd.get('trigger') as string) || 'on_load',
        delayMs: parseInt(fd.get('delayMs') as string) || 0,
        title,
        body,
        ctaLabel: (fd.get('ctaLabel') as string)?.trim() || null,
        ctaHref: (fd.get('ctaHref') as string)?.trim() || null,
        dismissLabel: (fd.get('dismissLabel') as string)?.trim() || 'סגור',
        frequency: (fd.get('frequency') as string) || 'once_per_session',
        hideDaysAfterDismiss: parseInt(fd.get('hideDaysAfterDismiss') as string) || 7,
      },
    });
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

  const name = (fd.get('name') as string)?.trim();
  const title = (fd.get('title') as string)?.trim();
  const body = (fd.get('body') as string)?.trim();

  if (!name) return { error: 'שם נדרש' };
  if (!title) return { error: 'כותרת נדרשת' };
  if (!body) return { error: 'תוכן נדרש' };

  try {
    await prisma.popup.update({
      where: { id },
      data: {
        name,
        enabled: fd.get('enabled') === 'on',
        priority: parseInt(fd.get('priority') as string) || 50,
        trigger: (fd.get('trigger') as string) || 'on_load',
        delayMs: parseInt(fd.get('delayMs') as string) || 0,
        title,
        body,
        ctaLabel: (fd.get('ctaLabel') as string)?.trim() || null,
        ctaHref: (fd.get('ctaHref') as string)?.trim() || null,
        dismissLabel: (fd.get('dismissLabel') as string)?.trim() || 'סגור',
        frequency: (fd.get('frequency') as string) || 'once_per_session',
        hideDaysAfterDismiss: parseInt(fd.get('hideDaysAfterDismiss') as string) || 7,
      },
    });
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
