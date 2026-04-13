import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import ListPageLayout from '@/components/dashboard/ListPageLayout';
import { DataTable, DataTableRow, DataTableCell, StatusBadge, DataTableEmpty } from '@/components/dashboard/DataTable';

export const metadata = { title: 'פוסטים | דשבורד' };

const statusMap: Record<string, { label: string; color: string }> = {
  draft: { label: 'טיוטה', color: 'bg-slate-100 text-slate-500' },
  published: { label: 'פורסם', color: 'bg-green-50 text-green-700' },
};

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const { q, status } = await searchParams;

  const where: Record<string, unknown> = { tenantId };
  if (q) where.title = { contains: q, mode: 'insensitive' };
  if (status) where.status = status;

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, slug: true, status: true, publishedAt: true, category: { select: { name: true } } },
  });

  return (
    <ListPageLayout
      title="פוסטים"
      subtitle={`${posts.length} פוסטים`}
      actionHref="/dashboard/posts/new"
      actionLabel="+ פוסט חדש"
      secondaryActions={
        <Link href="/dashboard/posts/categories" className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-semibold text-slate-600 transition-colors duration-150 hover:border-slate-300 hover:text-navy">קטגוריות</Link>
      }
      searchPlaceholder="חיפוש לפי כותרת..."
      searchBasePath="/dashboard/posts"
      searchFilters={[{ name: 'status', label: 'כל הסטטוסים', options: [{ value: 'draft', label: 'טיוטה' }, { value: 'published', label: 'פורסם' }] }]}
    >
      {posts.length === 0 ? (
        <DataTableEmpty icon="article" text={`אין פוסטים${q ? ' תואמים לחיפוש' : ' עדיין'}`} />
      ) : (
        <DataTable headers={['כותרת', 'סטטוס', 'תאריך', 'קטגוריה', { label: '', className: 'w-20' }]}>
          {posts.map(post => (
            <DataTableRow key={post.id}>
              <DataTableCell className="font-medium text-navy">{post.title}</DataTableCell>
              <DataTableCell><StatusBadge status={post.status} map={statusMap} /></DataTableCell>
              <DataTableCell className="text-[11px] text-slate-400">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('he-IL') : '—'}</DataTableCell>
              <DataTableCell className="text-slate-500">{post.category?.name ?? '—'}</DataTableCell>
              <DataTableCell className="text-left">
                <Link
                  href={`/dashboard/posts/${post.id}`}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-navy"
                  title="עריכה"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </ListPageLayout>
  );
}
