import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ListPageLayout from '@/components/dashboard/ListPageLayout';
import { CreateToggleProvider, CreateToggleButton } from '@/components/dashboard/CreateToggle';
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
    <CreateToggleProvider>
      <ListPageLayout
        title="ניהול צוות"
        subtitle={`${members.length} חברים`}
        actionSlot={<CreateToggleButton label="+ הזמנת חבר" />}
        searchBasePath="/dashboard/team"
        searchPlaceholder="חיפוש לפי שם או אימייל..."
      >
        <TeamClient
          members={JSON.parse(JSON.stringify(members))}
          currentUserId={user!.id}
        />
      </ListPageLayout>
    </CreateToggleProvider>
  );
}
