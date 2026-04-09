'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type CptActionState = { error?: string } | undefined;

export async function createCptAction(prev: CptActionState, fd: FormData): Promise<CptActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  const name = (fd.get('name') as string)?.trim();
  const slug = (fd.get('slug') as string)?.trim();

  if (!name) return { error: 'שם נדרש' };
  if (!slug) return { error: 'סלאג נדרש' };
  if (!/^[a-z0-9-]+$/.test(slug)) return { error: 'סלאג חייב להכיל רק אותיות קטנות, מספרים ומקפים' };

  const existing = await prisma.customPostType.findUnique({
    where: { tenantId_slug: { tenantId, slug } },
  });
  if (existing) return { error: 'סלאג זה כבר קיים' };

  try {
    await prisma.customPostType.create({ data: { tenantId, name, slug } });
  } catch {
    return { error: 'שגיאה ביצירה' };
  }

  revalidatePath('/dashboard/cpt');
  return undefined;
}

export async function updateCptFieldsAction(cptId: string, fieldsJson: string): Promise<CptActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const cpt = await prisma.customPostType.findFirst({ where: { id: cptId, tenantId } });
  if (!cpt) return { error: 'סוג תוכן לא נמצא' };

  try {
    JSON.parse(fieldsJson);
  } catch {
    return { error: 'JSON לא תקין' };
  }

  await prisma.customPostType.update({ where: { id: cptId }, data: { fields: fieldsJson } });
  revalidatePath(`/dashboard/cpt/${cptId}`);
  return undefined;
}

export async function deleteCptAction(id: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  await prisma.customPostType.deleteMany({ where: { id, tenantId } });
  revalidatePath('/dashboard/cpt');
}

export async function createEntryAction(prev: CptActionState, fd: FormData): Promise<CptActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const cptId = fd.get('cptId') as string;

  const cpt = await prisma.customPostType.findFirst({ where: { id: cptId, tenantId } });
  if (!cpt) return { error: 'סוג תוכן לא נמצא' };

  const title = (fd.get('title') as string)?.trim();
  const slug = (fd.get('slug') as string)?.trim();

  if (!title) return { error: 'כותרת נדרשת' };
  if (!slug) return { error: 'סלאג נדרש' };
  if (!/^[a-z0-9-]+$/.test(slug)) return { error: 'סלאג לא תקין' };

  const existing = await prisma.customPostEntry.findUnique({
    where: { cptId_slug: { cptId, slug } },
  });
  if (existing) return { error: 'סלאג זה כבר קיים' };

  try {
    await prisma.customPostEntry.create({ data: { cptId, title, slug } });
  } catch {
    return { error: 'שגיאה ביצירה' };
  }

  revalidatePath(`/dashboard/cpt/${cptId}`);
  return undefined;
}

export async function updateEntryAction(prev: CptActionState, fd: FormData): Promise<CptActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const entryId = fd.get('entryId') as string;
  const cptId = fd.get('cptId') as string;

  const entry = await prisma.customPostEntry.findUnique({
    where: { id: entryId },
    include: { cpt: true },
  });
  if (!entry || entry.cpt.tenantId !== tenantId) return { error: 'רשומה לא נמצאה' };

  const title = (fd.get('title') as string)?.trim();
  const slug = (fd.get('slug') as string)?.trim();
  const status = (fd.get('status') as string) || 'draft';

  if (!title) return { error: 'כותרת נדרשת' };
  if (!slug) return { error: 'סלאג נדרש' };

  const existingSlug = await prisma.customPostEntry.findFirst({
    where: { cptId: entry.cptId, slug, NOT: { id: entryId } },
  });
  if (existingSlug) return { error: 'סלאג זה כבר קיים' };

  const fields: { name: string }[] = JSON.parse(entry.cpt.fields || '[]');
  const data: Record<string, string> = {};
  for (const f of fields) {
    data[f.name] = (fd.get(`field_${f.name}`) as string) ?? '';
  }

  try {
    await prisma.customPostEntry.update({
      where: { id: entryId },
      data: { title, slug, status, data: JSON.stringify(data) },
    });
  } catch {
    return { error: 'שגיאה בעדכון' };
  }

  revalidatePath(`/dashboard/cpt/${cptId}`);
  redirect(`/dashboard/cpt/${cptId}`);
}

export async function deleteEntryAction(entryId: string, cptId: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const entry = await prisma.customPostEntry.findUnique({
    where: { id: entryId },
    include: { cpt: true },
  });
  if (!entry || entry.cpt.tenantId !== tenantId) return;

  await prisma.customPostEntry.delete({ where: { id: entryId } });
  revalidatePath(`/dashboard/cpt/${cptId}`);
}
