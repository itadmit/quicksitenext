'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { templateBlocks } from '@/lib/block-registry';
import { redirect } from 'next/navigation';

const createPageSchema = z.object({
  title: z.string().min(1, 'חובה להזין כותרת'),
  slug: z.string().min(1, 'חובה להזין נתיב'),
  template: z.enum(['blank', 'home', 'contact', 'landing']),
  status: z.enum(['draft', 'published']),
});

export type CreatePageState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createPageAction(
  _prev: CreatePageState,
  formData: FormData,
): Promise<CreatePageState> {
  const user = await getCurrentUser();
  if (!user) return { error: 'לא מחובר' };

  const tenantId = user.memberships[0]?.tenantId;
  if (!tenantId) return { error: 'לא נמצא ארגון' };

  const parsed = createPageSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    template: formData.get('template'),
    status: formData.get('status'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { title, slug, template, status } = parsed.data;

  const existing = await prisma.page.findUnique({
    where: { tenantId_slug: { tenantId, slug } },
  });
  if (existing) {
    return { fieldErrors: { slug: ['נתיב זה כבר קיים'] } };
  }

  const blocks = templateBlocks(template);

  const page = await prisma.page.create({
    data: {
      tenantId,
      title,
      slug,
      template,
      status,
      blocks: JSON.stringify(blocks),
    },
  });

  redirect(`/dashboard/pages/${page.id}`);
}
