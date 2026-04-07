'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type DomainActionState = { error?: string; success?: boolean } | undefined;

export async function addDomainAction(prev: DomainActionState, fd: FormData): Promise<DomainActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  const hostname = (fd.get('hostname') as string)?.trim().toLowerCase();
  if (!hostname) return { error: 'שם דומיין נדרש' };
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(hostname)) return { error: 'פורמט דומיין לא תקין' };

  const existing = await prisma.domain.findUnique({ where: { hostname } });
  if (existing) return { error: 'דומיין זה כבר רשום במערכת' };

  try {
    await prisma.domain.create({
      data: { tenantId, hostname, type: 'custom', verified: false },
    });
  } catch {
    return { error: 'שגיאה בהוספת הדומיין' };
  }

  revalidatePath('/dashboard/domains');
  return { success: true };
}

export async function removeDomainAction(domainId: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  await prisma.domain.deleteMany({ where: { id: domainId, tenantId, type: 'custom' } });
  revalidatePath('/dashboard/domains');
}

export async function verifyDomainAction(domainId: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  await prisma.domain.updateMany({
    where: { id: domainId, tenantId },
    data: { verified: true, verifiedAt: new Date() },
  });
  revalidatePath('/dashboard/domains');
}
