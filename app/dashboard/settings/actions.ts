'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type SettingsActionState = { error?: string; success?: boolean } | undefined;

export async function updateSettingsAction(prev: SettingsActionState, fd: FormData): Promise<SettingsActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  const data = {
    siteName: (fd.get('siteName') as string)?.trim() || '',
    tagline: (fd.get('tagline') as string)?.trim() || '',
    logoUrl: (fd.get('logoUrl') as string)?.trim() || null,
    faviconUrl: (fd.get('faviconUrl') as string)?.trim() || null,
    primaryColor: (fd.get('primaryColor') as string)?.trim() || '#a28b5d',
    footerText: (fd.get('footerText') as string)?.trim() || '',
    socialLinks: (fd.get('socialLinks') as string)?.trim() || '[]',
    customCss: (fd.get('customCss') as string) || '',
    analyticsId: (fd.get('analyticsId') as string)?.trim() || '',
    fbPixelId: (fd.get('fbPixelId') as string)?.trim() || '',
    gtmId: (fd.get('gtmId') as string)?.trim() || '',
    customHeadCode: (fd.get('customHeadCode') as string) || '',
    defaultSeoTitle: (fd.get('defaultSeoTitle') as string)?.trim() || '',
    defaultSeoDesc: (fd.get('defaultSeoDesc') as string)?.trim() || '',
  };

  try {
    JSON.parse(data.socialLinks);
  } catch {
    return { error: 'פורמט JSON לא תקין בשדה קישורים חברתיים' };
  }

  try {
    await prisma.siteSettings.upsert({
      where: { tenantId },
      update: data,
      create: { tenantId, ...data },
    });
  } catch {
    return { error: 'שגיאה בשמירת ההגדרות' };
  }

  revalidatePath('/dashboard/settings');
  return { success: true };
}
