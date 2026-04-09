'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { blockSchema } from '@/lib/block-registry';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function verifyPageOwnership(pageId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('לא מחובר');

  const tenantId = user.memberships[0]?.tenantId;
  if (!tenantId) throw new Error('לא נמצא ארגון');

  const page = await prisma.page.findFirst({
    where: { id: pageId, tenantId },
  });
  if (!page) throw new Error('עמוד לא נמצא');

  return { page, tenantId };
}

export async function savePageAction(pageId: string, blocksJson: string) {
  await verifyPageOwnership(pageId);

  let blocksData: unknown;
  try {
    blocksData = JSON.parse(blocksJson);
  } catch {
    return { error: 'JSON לא תקין' };
  }

  const parsed = z.array(blockSchema).safeParse(blocksData);
  if (!parsed.success) {
    return { error: 'מבנה בלוקים לא תקין' };
  }

  await prisma.page.update({
    where: { id: pageId },
    data: { blocks: JSON.stringify(parsed.data) },
  });

  revalidatePath(`/dashboard/pages/${pageId}`);
  return { success: true };
}

const metaSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  status: z.enum(['draft', 'published', 'scheduled']),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  publishAt: z.string().optional(),
});

export async function updatePageMetaAction(
  pageId: string,
  data: {
    title: string;
    slug: string;
    status: string;
    seoTitle?: string;
    seoDescription?: string;
  },
) {
  const { tenantId } = await verifyPageOwnership(pageId);

  const parsed = metaSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'נתונים לא תקינים', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.page.findFirst({
    where: { tenantId, slug: parsed.data.slug, NOT: { id: pageId } },
  });
  if (existing) {
    return { error: 'נתיב זה כבר קיים' };
  }

  await prisma.page.update({
    where: { id: pageId },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      status: parsed.data.status,
      seoTitle: parsed.data.seoTitle ?? null,
      seoDescription: parsed.data.seoDescription ?? null,
      publishAt: parsed.data.publishAt ? new Date(parsed.data.publishAt) : null,
    },
  });

  revalidatePath(`/dashboard/pages/${pageId}`);
  return { success: true };
}

export async function deletePageAction(pageId: string) {
  await verifyPageOwnership(pageId);

  await prisma.page.delete({ where: { id: pageId } });

  revalidatePath('/dashboard/pages');
  redirect('/dashboard/pages');
}

export async function duplicatePageAction(pageId: string) {
  const { page, tenantId } = await verifyPageOwnership(pageId);

  const count = await prisma.page.count({ where: { tenantId } });
  const newSlug = `${page.slug}-copy-${Date.now().toString(36)}`;

  const newPage = await prisma.page.create({
    data: {
      tenantId,
      title: `${page.title} (העתק)`,
      slug: newSlug,
      template: page.template,
      blocks: page.blocks,
      status: 'draft',
      sortOrder: count,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      seoImage: page.seoImage,
    },
  });

  revalidatePath('/dashboard/pages');
  redirect(`/dashboard/pages/${newPage.id}`);
}
