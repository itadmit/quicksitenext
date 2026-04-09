'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function uploadMediaAction(prev: { error?: string; success?: boolean } | undefined, fd: FormData) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const file = fd.get('file') as File;
  if (!file || file.size === 0) return { error: 'נא לבחור קובץ' };
  
  const maxSize = 5 * 1024 * 1024; // 5MB
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
    
    await prisma.mediaItem.create({
      data: {
        tenantId,
        filename: file.name,
        url,
        mimeType: file.type,
        size: file.size,
        alt: '',
      },
    });
  } catch (e) {
    console.error(e);
    return { error: 'שגיאה בהעלאת הקובץ' };
  }

  revalidatePath('/dashboard/media');
  return { success: true };
}

export async function deleteMediaAction(mediaId: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  await prisma.mediaItem.deleteMany({ where: { id: mediaId, tenantId } });
  revalidatePath('/dashboard/media');
}

export async function updateMediaAltAction(mediaId: string, alt: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  await prisma.mediaItem.updateMany({ where: { id: mediaId, tenantId }, data: { alt } });
  revalidatePath('/dashboard/media');
}
