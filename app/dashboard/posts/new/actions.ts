'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type PostActionState = { error?: string } | undefined;

export async function createPostAction(prev: PostActionState, fd: FormData): Promise<PostActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  const title = (fd.get('title') as string)?.trim();
  const slug = (fd.get('slug') as string)?.trim();
  const excerpt = (fd.get('excerpt') as string)?.trim() || null;
  const content = (fd.get('content') as string) || '';
  const coverImage = (fd.get('coverImage') as string)?.trim() || null;
  const status = (fd.get('status') as string) || 'draft';
  const categoryId = (fd.get('categoryId') as string) || null;

  if (!title) return { error: 'כותרת נדרשת' };
  if (!slug) return { error: 'סלאג נדרש' };
  if (!/^[a-z0-9-]+$/.test(slug)) return { error: 'סלאג חייב להכיל רק אותיות קטנות באנגלית, מספרים ומקפים' };

  const existing = await prisma.post.findUnique({ where: { tenantId_slug: { tenantId, slug } } });
  if (existing) return { error: 'סלאג זה כבר קיים' };

  try {
    await prisma.post.create({
      data: {
        tenantId,
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status,
        categoryId: categoryId || undefined,
        publishedAt: status === 'published' ? new Date() : null,
      },
    });
  } catch {
    return { error: 'שגיאה ביצירת הפוסט' };
  }

  revalidatePath('/dashboard/posts');
  redirect('/dashboard/posts');
}
