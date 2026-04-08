'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'נא להזין שם מלא').max(120),
  phone: z.string().min(9, 'מספר טלפון לא תקין').max(20),
  email: z.string().email('כתובת מייל לא תקינה').max(254),
  business: z.string().min(1, 'נא להזין שם עסק').max(120),
  businessType: z.string().min(1, 'נא לבחור סוג עסק').max(120),
  inspiration: z.string().max(500).optional(),
});

export type PremiumInquiryState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function submitPremiumInquiry(
  _prev: PremiumInquiryState | undefined,
  fd: FormData
): Promise<PremiumInquiryState> {
  const raw = {
    name: fd.get('name') as string,
    phone: fd.get('phone') as string,
    email: fd.get('email') as string,
    business: fd.get('business') as string,
    businessType: fd.get('businessType') as string,
    inspiration: (fd.get('inspiration') as string) || undefined,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.premiumInquiry.create({
      data: {
        name: parsed.data.name.trim(),
        phone: parsed.data.phone.trim(),
        email: parsed.data.email.trim().toLowerCase(),
        business: parsed.data.business.trim(),
        businessType: parsed.data.businessType.trim(),
        inspiration: parsed.data.inspiration?.trim() || null,
      },
    });
  } catch {
    return { error: 'שגיאה בשליחת הטופס. נסו שוב.' };
  }

  return { success: true };
}
