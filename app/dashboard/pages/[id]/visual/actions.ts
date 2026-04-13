'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { blockSchema } from '@/lib/block-registry';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

async function verifyPageOwnership(pageId: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0]?.tenantId;
  if (!tenantId) throw new Error('לא נמצא ארגון');

  const page = await prisma.page.findFirst({
    where: { id: pageId, tenantId },
  });
  if (!page) throw new Error('עמוד לא נמצא');

  return { page, tenantId };
}

export async function autoSaveAction(pageId: string, blocksJson: string) {
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

  return { success: true };
}

export async function publishPageAction(pageId: string) {
  await verifyPageOwnership(pageId);

  await prisma.page.update({
    where: { id: pageId },
    data: { status: 'published' },
  });

  revalidatePath(`/dashboard/pages/${pageId}`);
  return { success: true };
}

export async function fetchMediaItemsAction() {
  const user = await requireUser();
  const tenantId = user.memberships[0]?.tenantId;
  if (!tenantId) return { items: [] };

  const items = await prisma.mediaItem.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return { items };
}

export async function uploadMediaFromEditorAction(fd: FormData) {
  const user = await requireUser();
  const tenantId = user.memberships[0]?.tenantId;
  if (!tenantId) return { error: 'לא נמצא ארגון' };

  const file = fd.get('file') as File;
  if (!file || file.size === 0) return { error: 'נא לבחור קובץ' };

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) return { error: 'הקובץ גדול מדי (מקסימום 5MB)' };

  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!allowed.includes(file.type)) return { error: 'סוג קובץ לא נתמך' };

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', tenantId);
    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name);
    const safeName = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext;
    const filePath = path.join(uploadDir, safeName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const url = `/uploads/${tenantId}/${safeName}`;

    const item = await prisma.mediaItem.create({
      data: {
        tenantId,
        filename: file.name,
        url,
        mimeType: file.type,
        size: file.size,
        alt: '',
      },
    });

    return { success: true, url, item };
  } catch (e) {
    console.error(e);
    return { error: 'שגיאה בהעלאת הקובץ' };
  }
}

const metaSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  status: z.enum(['draft', 'published', 'scheduled']),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function updatePageMetaFromEditorAction(
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
    return { error: 'נתונים לא תקינים' };
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
    },
  });

  revalidatePath(`/dashboard/pages/${pageId}`);
  return { success: true };
}
