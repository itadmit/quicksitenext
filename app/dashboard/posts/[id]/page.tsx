import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditPostForm from './EditPostForm';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardCard from '@/components/dashboard/DashboardCard';

export const metadata = { title: 'עריכת פוסט | דשבורד' };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.post.findFirst({ where: { id, tenantId } }),
    prisma.category.findMany({ where: { tenantId }, orderBy: { name: 'asc' } }),
  ]);
  if (!post) notFound();

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title="עריכת פוסט" backHref="/dashboard/posts" />
      <DashboardCard>
        <EditPostForm post={JSON.parse(JSON.stringify(post))} categories={JSON.parse(JSON.stringify(categories))} />
      </DashboardCard>
    </div>
  );
}
