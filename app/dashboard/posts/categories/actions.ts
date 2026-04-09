'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type CategoryActionState = { error?: string; success?: boolean } | undefined;

export async function createCategoryAction(prev: CategoryActionState, fd: FormData): Promise<CategoryActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const name = (fd.get('name') as string)?.trim();
  const slug = (fd.get('slug') as string)?.trim();
  if (!name || !slug) return { error: 'שם וסלאג נדרשים' };

  const existing = await prisma.category.findUnique({ where: { tenantId_slug: { tenantId, slug } } });
  if (existing) return { error: 'סלאג כבר קיים' };

  await prisma.category.create({ data: { tenantId, name, slug } });
  revalidatePath('/dashboard/posts/categories');
  return { success: true };
}

export async function deleteCategoryAction(id: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  await prisma.category.deleteMany({ where: { id, tenantId } });
  revalidatePath('/dashboard/posts/categories');
}
