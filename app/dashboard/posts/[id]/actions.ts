'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type PostActionState = { error?: string } | undefined;

export async function updatePostAction(prev: PostActionState, fd: FormData): Promise<PostActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const id = fd.get('id') as string;

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

  const existing = await prisma.post.findFirst({
    where: { tenantId, slug, NOT: { id } },
  });
  if (existing) return { error: 'סלאג זה כבר קיים' };

  const current = await prisma.post.findFirst({ where: { id, tenantId } });
  if (!current) return { error: 'פוסט לא נמצא' };

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status,
        categoryId: categoryId || null,
        publishedAt:
          status === 'published' && current.status !== 'published'
            ? new Date()
            : status === 'published'
              ? current.publishedAt
              : null,
      },
    });
  } catch {
    return { error: 'שגיאה בעדכון הפוסט' };
  }

  revalidatePath('/dashboard/posts');
  redirect('/dashboard/posts');
}

export async function deletePostAction(fd: FormData) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const id = fd.get('id') as string;

  await prisma.post.deleteMany({ where: { id, tenantId } });
  revalidatePath('/dashboard/posts');
  redirect('/dashboard/posts');
}
