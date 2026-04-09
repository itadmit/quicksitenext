import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/dashboard/PageHeader';
import CategoriesClient from './CategoriesClient';

export const metadata = { title: 'קטגוריות | דשבורד' };

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const categories = await prisma.category.findMany({
    where: { tenantId },
    include: { _count: { select: { posts: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title="קטגוריות" backHref="/dashboard/posts" />
      <CategoriesClient categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
