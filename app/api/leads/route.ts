import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const tenantLeadSchema = z.object({
  name: z.string().min(1, 'שם נדרש').max(120),
  email: z.string().email('אימייל לא תקין').max(254),
  phone: z.string().max(40).optional().nullable(),
  company: z.string().max(120).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
  source: z.string().max(80).optional().default('website_contact'),
  tenantId: z.string().min(1, 'tenantId נדרש'),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = tenantLeadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const tenant = await prisma.tenant.findUnique({
      where: { id: data.tenantId },
      select: { id: true },
    });
    if (!tenant) {
      return NextResponse.json(
        { ok: false, error: 'tenant_not_found' },
        { status: 404 }
      );
    }

    const lead = await prisma.lead.create({
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

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
