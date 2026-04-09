'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type RedirectActionState = { error?: string; success?: boolean } | undefined;

export async function addRedirectAction(prev: RedirectActionState, fd: FormData): Promise<RedirectActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  const fromPath = (fd.get('fromPath') as string)?.trim();
  const toPath = (fd.get('toPath') as string)?.trim();
  const type = parseInt(fd.get('type') as string) || 301;

  if (!fromPath || !toPath) return { error: 'יש למלא את שני השדות' };
  if (fromPath === toPath) return { error: 'הנתיבים לא יכולים להיות זהים' };

  try {
    await prisma.redirect.create({ data: { tenantId, fromPath, toPath, type } });
  } catch {
    return { error: 'הנתיב כבר קיים או שגיאה בשמירה' };
  }

  revalidatePath('/dashboard/settings');
  return { success: true };
}

export async function deleteRedirectAction(id: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  await prisma.redirect.deleteMany({ where: { id, tenantId } });
  revalidatePath('/dashboard/settings');
}
