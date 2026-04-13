'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendNewLeadEmail, sendLeadConfirmationEmail } from '@/lib/email';

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
      select: {
        id: true,
        name: true,
        members: {
          where: { role: 'owner' },
          select: { user: { select: { email: true, name: true } } },
          take: 1,
        },
        siteSettings: {
          select: {
            leadNotifyEmail: true,
            leadWebhookUrl: true,
            leadAutoReply: true,
            leadAutoReplyMsg: true,
          },
        },
      },
    });
    if (!tenant) return { error: 'אתר לא נמצא' };

    const leadName = data.name.trim();
    const leadEmail = data.email.trim().toLowerCase();
    const leadPhone = data.phone?.trim() || null;
    const leadCompany = data.company?.trim() || null;
    const leadMessage = data.message?.trim() || null;
    const leadSource = data.source?.trim() || 'website_contact';

    await prisma.lead.create({
      data: {
        tenantId: data.tenantId,
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        company: leadCompany,
        message: leadMessage,
        source: leadSource,
      },
    });

    const owner = tenant.members[0]?.user;
    const settings = tenant.siteSettings;

    // Notify email: custom address or fallback to owner
    const notifyEmail = settings?.leadNotifyEmail?.trim() || owner?.email;
    const notifyName = owner?.name || '';
    if (notifyEmail) {
      sendNewLeadEmail(notifyEmail, notifyName, {
        name: leadName,
        email: leadEmail,
        phone: leadPhone || undefined,
        message: leadMessage || undefined,
      }).catch(console.error);
    }

    // Auto-reply to lead
    if (settings?.leadAutoReply !== false) {
      sendLeadConfirmationEmail(leadEmail, leadName, tenant.name).catch(console.error);
    }

    // Webhook
    if (settings?.leadWebhookUrl) {
      fetch(settings.leadWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'new_lead',
          lead: {
            name: leadName,
            email: leadEmail,
            phone: leadPhone,
            company: leadCompany,
            message: leadMessage,
            source: leadSource,
            created_at: new Date().toISOString(),
          },
        }),
      }).catch(console.error);
    }

    return { success: true };
  } catch (e) {
    console.error('submitLeadAction error:', e);
    return { error: 'אירעה שגיאה, נסו שוב.' };
  }
}
