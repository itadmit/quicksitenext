import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ExternalLink } from 'lucide-react';
import ListPageLayout from '@/components/dashboard/ListPageLayout';
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

  const [pages, tenant] = await Promise.all([
    prisma.page.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      select: { id: true, title: true, slug: true, status: true, isHome: true, updatedAt: true },
    }),
    prisma.tenant.findUnique({ where: { id: tenantId }, select: { slug: true } }),
  ]);

  const platformDomain = process.env.PLATFORM_DOMAIN ?? 'localhost:3000';
  const isLocal = platformDomain.includes('localhost') || platformDomain.includes('127.');
  const protocol = isLocal ? 'http' : 'https';
  const siteBase = tenant?.slug ? `${protocol}://${tenant.slug}.${platformDomain}` : null;

  return (
    <ListPageLayout
      title="עמודים"
      subtitle={`${pages.length} עמודים`}
      actionHref="/dashboard/pages/new"
      actionLabel="+ עמוד חדש"
      searchPlaceholder="חיפוש לפי כותרת..."
      searchBasePath="/dashboard/pages"
      searchFilters={[{ name: 'status', label: 'כל הסטטוסים', options: [{ value: 'draft', label: 'טיוטה' }, { value: 'published', label: 'פורסם' }] }]}
    >
      {pages.length === 0 ? (
        <DataTableEmpty icon="description" text={`אין עמודים${q ? ' תואמים לחיפוש' : ' עדיין'}`} />
      ) : (
        <DataTable headers={['כותרת', 'נתיב', 'סטטוס', 'עודכן', 'סוג', { label: '', className: 'w-20' }]}>
          {pages.map(page => (
            <DataTableRow key={page.id}>
              <DataTableCell className="font-medium text-navy">{page.title}</DataTableCell>
              <DataTableCell>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-slate-500" dir="ltr">/{page.slug}</span>
                  {siteBase && page.status === 'published' && (
                    <a
                      href={`${siteBase}/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-300 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
                      title="פתח בכרטיסייה חדשה"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </DataTableCell>
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
    </ListPageLayout>
  );
}
