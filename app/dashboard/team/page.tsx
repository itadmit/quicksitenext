import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/dashboard/PageHeader';
import TeamClient from './TeamClient';

export const metadata = { title: 'צוות | דשבורד' };

export default async function TeamPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;

  const members = await prisma.tenantMember.findMany({
    where: { tenantId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { user: { name: 'asc' } },
  });

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title="ניהול צוות" subtitle={`${members.length} חברים`} />
      <TeamClient
        members={JSON.parse(JSON.stringify(members))}
        currentUserId={user!.id}
      />
    </div>
  );
}
