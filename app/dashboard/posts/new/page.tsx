import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PostForm from './PostForm';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardCard from '@/components/dashboard/DashboardCard';

export const metadata = { title: 'פוסט חדש | דשבורד' };

export default async function NewPostPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ where: { tenantId }, orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ where: { tenantId }, orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title="פוסט חדש" backHref="/dashboard/posts" />
      <DashboardCard>
        <PostForm categories={JSON.parse(JSON.stringify(categories))} tags={JSON.parse(JSON.stringify(tags))} />
      </DashboardCard>
    </div>
  );
}
