import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import PageHeader from '@/components/dashboard/PageHeader';
import TableSearch from '@/components/dashboard/TableSearch';
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
    <div className="space-y-5">
      <PageHeader title="פוסטים" subtitle={`${posts.length} פוסטים`}>
        <Link href="/dashboard/posts/categories" className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-navy transition-colors hover:border-ocean hover:text-ocean">קטגוריות</Link>
        <Link href="/dashboard/posts/new" className="rounded-full bg-ocean px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean/85">פוסט חדש</Link>
      </PageHeader>

      <TableSearch
        placeholder="חיפוש לפי כותרת..."
        basePath="/dashboard/posts"
        filters={[{ name: 'status', label: 'כל הסטטוסים', options: [{ value: 'draft', label: 'טיוטה' }, { value: 'published', label: 'פורסם' }] }]}
      />

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
                <Link href={`/dashboard/posts/${post.id}`} className="text-[13px] font-medium text-ocean hover:underline">עריכה</Link>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
