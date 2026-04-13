import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ListPageLayout from '@/components/dashboard/ListPageLayout';
import { CreateToggleProvider, CreateToggleButton } from '@/components/dashboard/CreateToggle';
import LeadsClient from './LeadsClient';
import LeadSettings from './LeadSettings';

export const metadata = { title: 'לידים | דשבורד' };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const { status, q } = await searchParams;

  const where: Record<string, unknown> = { tenantId };
  if (status && status !== 'ALL') where.status = status;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { company: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [leads, totalCount, siteSettings] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' } }),
    prisma.lead.count({ where: { tenantId } }),
    prisma.siteSettings.findUnique({
      where: { tenantId },
      select: { leadNotifyEmail: true, leadWebhookUrl: true, leadAutoReply: true, leadAutoReplyMsg: true },
    }),
  ]);

  return (
    <CreateToggleProvider>
      <ListPageLayout
        title="לידים"
        subtitle={`${totalCount} לידים סה״כ`}
        actionSlot={<CreateToggleButton label="+ ליד חדש" />}
        searchPlaceholder="חיפוש שם, אימייל, חברה..."
        searchBasePath="/dashboard/leads"
        searchFilters={[
          {
            name: 'status',
            label: 'כל הסטטוסים',
            options: [
              { value: 'NEW', label: 'חדש' },
              { value: 'CONTACTED', label: 'נוצר קשר' },
              { value: 'QUALIFIED', label: 'מתאים' },
              { value: 'PROPOSAL_SENT', label: 'הצעה נשלחה' },
              { value: 'WON', label: 'זכייה' },
              { value: 'LOST', label: 'הפסד' },
            ],
          },
        ]}
      >
        <LeadSettings settings={siteSettings ?? { leadNotifyEmail: '', leadWebhookUrl: '', leadAutoReply: true, leadAutoReplyMsg: '' }} />
        <LeadsClient leads={JSON.parse(JSON.stringify(leads))} />
      </ListPageLayout>
    </CreateToggleProvider>
  );
}
