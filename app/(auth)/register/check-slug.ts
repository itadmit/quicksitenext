'use server';

import { prisma } from '@/lib/prisma';

export async function checkSlugAction(slug: string): Promise<{ available: boolean }> {
  if (!slug || slug.length < 2) return { available: false };
  const existing = await prisma.tenant.findUnique({ where: { slug }, select: { id: true } });
  return { available: !existing };
}
