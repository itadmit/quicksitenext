import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import PageHeader from '@/components/dashboard/PageHeader';
import TableSearch from '@/components/dashboard/TableSearch';
import { DataTable, DataTableRow, DataTableCell, StatusBadge, DataTableEmpty } from '@/components/dashboard/DataTable';
import PageActions from './PageActions';

export const metadata = { title: 'עמודים | דשבורד' };

const statusMap: Record<string, { label: string; color: string }> = {
  draft: { label: 'טיוטה', color: 'bg-slate-100 text-slate-500' },
  published: { label: 'פורסם', color: 'bg-green-50 text-green-700' },
  scheduled: { label: 'מתוזמן', color: 'bg-blue-50 text-blue-700' },
};

export default async function PagesListPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const { q, status } = await searchParams;

  const where: Record<string, unknown> = { tenantId };
  if (q) where.title = { contains: q, mode: 'insensitive' };
  if (status) where.status = status;

  const pages = await prisma.page.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    select: { id: true, title: true, slug: true, status: true, isHome: true, updatedAt: true },
  });

  return (
    <div className="space-y-5">
      <PageHeader title="עמודים" subtitle={`${pages.length} עמודים`}>
        <Link href="/dashboard/pages/new" className="rounded-full bg-ocean px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean/85">עמוד חדש</Link>
      </PageHeader>

      <TableSearch
        placeholder="חיפוש לפי כותרת..."
        basePath="/dashboard/pages"
        filters={[{ name: 'status', label: 'כל הסטטוסים', options: [{ value: 'draft', label: 'טיוטה' }, { value: 'published', label: 'פורסם' }] }]}
      />

      {pages.length === 0 ? (
        <DataTableEmpty icon="description" text={`אין עמודים${q ? ' תואמים לחיפוש' : ' עדיין'}`} />
      ) : (
        <DataTable headers={['כותרת', 'נתיב', 'סטטוס', 'עודכן', 'סוג', { label: '', className: 'w-20' }]}>
          {pages.map(page => (
            <DataTableRow key={page.id}>
              <DataTableCell className="font-medium text-navy">{page.title}</DataTableCell>
              <DataTableCell className="font-mono text-slate-500">/{page.slug}</DataTableCell>
              <DataTableCell><StatusBadge status={page.status} map={statusMap} /></DataTableCell>
              <DataTableCell className="text-[11px] text-slate-400">{new Date(page.updatedAt).toLocaleDateString('he-IL')}</DataTableCell>
              <DataTableCell>
                {page.isHome && <span className="inline-flex items-center rounded-full bg-ocean/[0.08] px-2.5 py-0.5 text-[11px] font-semibold text-ocean">דף הבית</span>}
              </DataTableCell>
              <DataTableCell className="text-left"><PageActions pageId={page.id} /></DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
