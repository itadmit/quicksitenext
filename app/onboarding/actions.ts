'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const schema = z.object({
  siteName: z.string().min(1, 'שם האתר נדרש').max(120),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  tagline: z.string().max(200).optional(),
});

export type OnboardingState = { error?: string; success?: boolean } | undefined;

export async function completeOnboardingAction(data: {
  siteName: string;
  primaryColor: string;
  tagline: string;
}): Promise<OnboardingState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { error: 'נתונים לא תקינים' };

  const { siteName, primaryColor, tagline } = parsed.data;

  try {
    await prisma.$transaction([
      prisma.tenant.update({
        where: { id: tenantId },
        data: { name: siteName },
      }),
      prisma.siteSettings.upsert({
        where: { tenantId },
        update: { siteName, primaryColor, tagline: tagline ?? '' },
        create: { tenantId, siteName, primaryColor, tagline: tagline ?? '' },
      }),
    ]);

    const homePage = await prisma.page.findFirst({
      where: { tenantId, isHome: true },
    });
    if (homePage) {
      const blocks = JSON.parse(homePage.blocks || '[]');
      const hero = blocks.find((b: { type: string }) => b.type === 'hero');
      if (hero) {
        hero.data.title = `ברוכים הבאים ל-${siteName}`;
        await prisma.page.update({
          where: { id: homePage.id },
          data: { blocks: JSON.stringify(blocks) },
        });
      }
    }
  } catch {
    return { error: 'שגיאה בשמירה' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
