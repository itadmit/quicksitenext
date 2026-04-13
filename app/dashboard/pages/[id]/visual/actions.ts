'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { blockSchema } from '@/lib/block-registry';
import { revalidatePath } from 'next/cache';
import { uploadToR2 } from '@/lib/r2';
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
    const ext = path.extname(file.name);
    const safeName = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext;
    const key = `media/${tenantId}/${safeName}`;

    const bytes = await file.arrayBuffer();
    const url = await uploadToR2(key, Buffer.from(bytes), file.type);

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

/* ── Save tracking/pixels to SiteSettings ── */

export async function saveTrackingAction(data: {
  analyticsId: string;
  fbPixelId: string;
  gtmId: string;
  customHeadCode: string;
}) {
  const user = await requireUser();
  const tenantId = user.memberships[0]?.tenantId;
  if (!tenantId) return { error: 'לא נמצא ארגון' };

  await prisma.siteSettings.upsert({
    where: { tenantId },
    update: {
      analyticsId: data.analyticsId,
      fbPixelId: data.fbPixelId,
      gtmId: data.gtmId,
      customHeadCode: data.customHeadCode,
    },
    create: {
      tenantId,
      analyticsId: data.analyticsId,
      fbPixelId: data.fbPixelId,
      gtmId: data.gtmId,
      customHeadCode: data.customHeadCode,
    },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function fetchTrackingSettings() {
  const user = await requireUser();
  const tenantId = user.memberships[0]?.tenantId;
  if (!tenantId) return null;

  const settings = await prisma.siteSettings.findUnique({ where: { tenantId } });
  if (!settings) return { analyticsId: '', fbPixelId: '', gtmId: '', customHeadCode: '' };

  return {
    analyticsId: settings.analyticsId,
    fbPixelId: settings.fbPixelId,
    gtmId: settings.gtmId,
    customHeadCode: settings.customHeadCode,
  };
}

/* ── Save theme to SiteSettings ── */

export async function saveThemeAction(themeJson: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0]?.tenantId;
  if (!tenantId) return { error: 'לא נמצא ארגון' };

  await prisma.siteSettings.upsert({
    where: { tenantId },
    update: { themeJson },
    create: { tenantId, themeJson },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

/* ── Linkable resources for smart link picker ── */

export type LinkableItem = {
  type: 'page' | 'post' | 'category' | 'custom';
  label: string;
  href: string;
  status?: string;
};

export async function fetchLinkableItems(): Promise<LinkableItem[]> {
  const user = await requireUser();
  const tenantId = user.memberships[0]?.tenantId;
  if (!tenantId) return [];

  const [pages, posts, categories] = await Promise.all([
    prisma.page.findMany({
      where: { tenantId },
      orderBy: { sortOrder: 'asc' },
      select: { title: true, slug: true, status: true, isHome: true },
    }),
    prisma.post.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { title: true, slug: true, status: true },
    }),
    prisma.category.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
      select: { name: true, slug: true },
    }),
  ]);

  const items: LinkableItem[] = [];

  for (const p of pages) {
    items.push({
      type: 'page',
      label: p.title,
      href: p.isHome ? '/' : `/${p.slug}`,
      status: p.status,
    });
  }

  for (const post of posts) {
    items.push({
      type: 'post',
      label: post.title,
      href: `/blog/${post.slug}`,
      status: post.status,
    });
  }

  for (const cat of categories) {
    items.push({
      type: 'category',
      label: cat.name,
      href: `/blog/category/${cat.slug}`,
    });
  }

  return items;
}
