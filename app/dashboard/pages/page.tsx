import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = { title: 'עמודים | דשבורד' };

export default async function PagesListPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const tenantId = user.memberships[0]?.tenantId;
  if (!tenantId) redirect('/register');

  const pages = await prisma.page.findMany({
    where: { tenantId },
    orderBy: { sortOrder: 'asc' },
  });

  const statusLabels: Record<string, string> = {
    draft: 'טיוטה',
    published: 'פורסם',
  };

  return (
    <div dir="rtl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-noto text-3xl font-black text-charcoal">עמודים</h1>
        <Link
          href="/dashboard/pages/new"
          className="bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 transition-opacity"
        >
          עמוד חדש
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="border border-charcoal/10 bg-white p-12 text-center">
          <span className="material-symbols-outlined mb-3 text-4xl text-charcoal/20">description</span>
          <p className="text-charcoal/50">אין עמודים עדיין. צרו את העמוד הראשון שלכם.</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-charcoal/10 bg-white">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-charcoal/10 bg-charcoal/[0.02]">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">כותרת</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">נתיב</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סטטוס</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תבנית</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סוג</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60"></th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-charcoal/5 last:border-b-0 hover:bg-charcoal/[0.01] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-charcoal">{page.title}</td>
                  <td className="px-4 py-3 text-sm text-charcoal/60 font-mono">/{page.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                        page.status === 'published'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-charcoal/5 text-charcoal/50'
                      }`}
                    >
                      {statusLabels[page.status] ?? page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal/60">{page.template}</td>
                  <td className="px-4 py-3">
                    {page.isHome && (
                      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                        דף הבית
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-left">
                    <Link
                      href={`/dashboard/pages/${page.id}`}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      עריכה
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
