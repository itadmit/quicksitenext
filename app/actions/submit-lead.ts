'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const leadSchema = z.object({
  name: z.string().min(1, 'שם נדרש').max(120),
  email: z.string().email('אימייל לא תקין').max(254),
  phone: z.string().max(40).optional().nullable(),
  company: z.string().max(120).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
  source: z.string().max(80).optional().default('website_contact'),
  tenantId: z.string().min(1, 'tenantId נדרש'),
});

export type SubmitLeadState = {
  success?: boolean;
  error?: string;
} | undefined;

export async function submitLeadAction(
  _prev: SubmitLeadState,
  formData: FormData,
): Promise<SubmitLeadState> {
  const parsed = leadSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || null,
    company: formData.get('company') || null,
    message: formData.get('message') || null,
    source: formData.get('source') || 'website_contact',
    tenantId: formData.get('tenantId'),
  });

  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { error: firstError || 'נתונים לא תקינים' };
  }

  const data = parsed.data;

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: data.tenantId },
      select: { id: true },
    });
    if (!tenant) return { error: 'אתר לא נמצא' };

    await prisma.lead.create({
      data: {
        tenantId: data.tenantId,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        company: data.company?.trim() || null,
        message: data.message?.trim() || null,
        source: data.source?.trim() || 'website_contact',
      },
    });

    return { success: true };
  } catch (e) {
    console.error('submitLeadAction error:', e);
    return { error: 'אירעה שגיאה, נסו שוב.' };
  }
}
