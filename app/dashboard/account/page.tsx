import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardCard from '@/components/dashboard/DashboardCard';
import AccountForms from './AccountForms';

export const metadata = { title: 'חשבון | דשבורד' };

const actionLabels: Record<string, string> = {
  created: 'יצר/ה', updated: 'עדכן/ה', deleted: 'מחק/ה', published: 'פרסם/ה',
  duplicated: 'שכפל/ה', exported: 'ייצא/ה',
};
const entityLabels: Record<string, string> = {
  page: 'עמוד', post: 'פוסט', lead: 'ליד', popup: 'פופאפ', domain: 'דומיין',
  menu: 'תפריט', media: 'מדיה', cpt: 'סוג תוכן', cpt_entry: 'רשומה',
  settings: 'הגדרות', team: 'צוות',
};

const planNames: Record<string, string> = {
  free: 'חינם', starter: 'סטארטר', pro: 'מקצועי', enterprise: 'ארגוני',
};
const planColors: Record<string, string> = {
  free: 'bg-slate-100 text-slate-600',
  starter: 'bg-blue-50 text-blue-700',
  pro: 'bg-ocean/10 text-ocean',
  enterprise: 'bg-amber-50 text-amber-700',
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;

  const [tenant, recentActivity, pageCount, postCount, memberCount, mediaItems] = await Promise.all([
    prisma.tenant.findUnique({ where: { id: tenantId } }),
    prisma.activityLog.findMany({
      where: { tenantId, userId: user!.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.page.count({ where: { tenantId } }),
    prisma.post.count({ where: { tenantId } }),
    prisma.tenantMember.count({ where: { tenantId } }),
    prisma.mediaItem.findMany({ where: { tenantId }, select: { size: true } }),
  ]);

  const storageMb = Math.round(mediaItems.reduce((sum, m) => sum + (m.size ?? 0), 0) / (1024 * 1024));
  const plan = tenant?.plan ?? 'free';

  const usage = [
    { label: 'עמודים', used: pageCount, limit: tenant?.pagesLimit ?? 5, icon: 'description' },
    { label: 'פוסטים', used: postCount, limit: tenant?.postsLimit ?? 20, icon: 'article' },
    { label: 'אחסון', used: storageMb, limit: tenant?.storageLimit ?? 100, unit: 'MB', icon: 'cloud_upload' },
    { label: 'חברי צוות', used: memberCount, limit: tenant?.membersLimit ?? 1, icon: 'group' },
  ];

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title="חשבון" subtitle={user!.email} />

      {/* Current Plan */}
      <DashboardCard title="חבילה נוכחית" headerAction={
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${planColors[plan] ?? planColors.free}`}>
          {planNames[plan] ?? plan}
        </span>
      }>
        <div className="space-y-4">
          {tenant?.planExpiry && (
            <p className="text-xs text-slate-400">
              בתוקף עד {new Date(tenant.planExpiry).toLocaleDateString('he-IL')}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {usage.map(u => {
              const pct = u.limit > 0 ? Math.min((u.used / u.limit) * 100, 100) : 0;
              const isNearLimit = pct >= 80;
              return (
                <div key={u.label} className="rounded-xl bg-slate-50 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">{u.icon}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{u.label}</span>
                  </div>
                  <p className="font-noto text-lg font-bold text-navy">
                    {u.used}<span className="text-sm font-normal text-slate-400">/{u.limit}{u.unit ? ` ${u.unit}` : ''}</span>
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${isNearLimit ? 'bg-red-400' : 'bg-ocean'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {plan === 'free' && (
            <div className="flex items-center justify-between rounded-xl bg-ocean/[0.04] px-4 py-3">
              <p className="text-sm text-navy">שדרגו לחבילת <strong>סטארטר</strong> לקבל יותר עמודים, אחסון וחברי צוות</p>
              <button className="shrink-0 rounded-full bg-ocean px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean/85">שדרוג</button>
            </div>
          )}
        </div>
      </DashboardCard>

      <AccountForms name={user!.name} email={user!.email} />

      <DashboardCard title="הפעילות שלי" description="10 פעולות אחרונות">
        {recentActivity.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">אין פעילות עדיין</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map(log => (
              <div key={log.id} className="flex items-center justify-between">
                <p className="text-sm text-navy">
                  {actionLabels[log.action] ?? log.action}{' '}
                  {entityLabels[log.entity] ?? log.entity}
                </p>
                <span className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleString('he-IL')}</span>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
