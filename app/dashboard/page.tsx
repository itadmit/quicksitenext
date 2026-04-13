import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DashboardCard from '@/components/dashboard/DashboardCard';
import PageHeader from '@/components/dashboard/PageHeader';
import {
  FileText, BookOpen, Mail, Zap, ArrowUpLeft, Settings,
  Plus, Search, UserPlus, History, MailIcon,
} from 'lucide-react';

export default async function DashboardHome() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;

  const [
    pageCount, postCount, totalLeads, newLeadCount, popupCount,
    publishedPages, recentLeads, drafts, settings, domains,
    recentActivity,
  ] = await Promise.all([
    prisma.page.count({ where: { tenantId } }),
    prisma.post.count({ where: { tenantId } }),
    prisma.lead.count({ where: { tenantId } }),
    prisma.lead.count({ where: { tenantId, status: 'NEW' } }),
    prisma.popup.count({ where: { tenantId, enabled: true } }),
    prisma.page.count({ where: { tenantId, status: 'published' } }),
    prisma.lead.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.page.findMany({ where: { tenantId, status: 'draft' }, orderBy: { updatedAt: 'desc' }, take: 5 }),
    prisma.siteSettings.findUnique({ where: { tenantId } }),
    prisma.domain.findMany({ where: { tenantId } }),
    prisma.activityLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { user: { select: { name: true } } },
    }),
  ]);

  const healthChecks = [
    { label: 'דומיין מאומת', ok: domains.some(d => d.verified), link: '/dashboard/domains' },
    { label: 'SEO ברירת מחדל', ok: !!(settings?.defaultSeoTitle && settings?.defaultSeoDesc), link: '/dashboard/settings' },
    { label: 'לוגו מוגדר', ok: !!settings?.logoUrl, link: '/dashboard/settings' },
    { label: 'Favicon מוגדר', ok: !!settings?.faviconUrl, link: '/dashboard/settings' },
    { label: 'Google Analytics', ok: !!settings?.analyticsId, link: '/dashboard/settings' },
  ];
  const healthScore = healthChecks.filter(h => h.ok).length;
  const healthPct = Math.round((healthScore / healthChecks.length) * 100);

  const entityLabels: Record<string, string> = {
    page: 'עמוד', post: 'פוסט', lead: 'ליד', popup: 'פופאפ', domain: 'דומיין',
    menu: 'תפריט', media: 'מדיה', cpt: 'סוג תוכן', cpt_entry: 'רשומה',
    settings: 'הגדרות', team: 'צוות',
  };
  const actionLabels: Record<string, string> = {
    created: 'יצר/ה', updated: 'עדכן/ה', deleted: 'מחק/ה', published: 'פרסם/ה',
    duplicated: 'שכפל/ה', exported: 'ייצא/ה',
  };
  const statusColors: Record<string, string> = {
    NEW: 'bg-ocean', CONTACTED: 'bg-amber-500', QUALIFIED: 'bg-emerald-500',
    PROPOSAL_SENT: 'bg-purple-500', WON: 'bg-green-500', LOST: 'bg-red-400',
  };
  const statusLabels: Record<string, string> = {
    NEW: 'חדש', CONTACTED: 'נוצר קשר', QUALIFIED: 'מתאים',
    PROPOSAL_SENT: 'הצעה נשלחה', WON: 'זכייה', LOST: 'הפסד',
  };

  const kpiItems = [
    { label: 'עמודים', value: pageCount, Icon: FileText, bg: 'bg-ocean/[0.08]', iconColor: 'text-ocean', href: '/dashboard/pages' },
    { label: 'פוסטים', value: postCount, Icon: BookOpen, bg: 'bg-emerald-500/[0.08]', iconColor: 'text-emerald-500', href: '/dashboard/posts' },
    { label: 'לידים חדשים', value: newLeadCount, Icon: Mail, bg: 'bg-amber-500/[0.08]', iconColor: 'text-amber-500', href: '/dashboard/leads' },
    { label: 'פופאפים', value: popupCount, Icon: Zap, bg: 'bg-purple-500/[0.08]', iconColor: 'text-purple-500', href: '/dashboard/popups' },
  ];

  const quickActions = [
    { label: 'עמוד חדש', href: '/dashboard/pages/new', Icon: FileText, desc: 'צור עמוד תוכן חדש' },
    { label: 'פוסט חדש', href: '/dashboard/posts/new', Icon: BookOpen, desc: 'כתוב פוסט חדש' },
    { label: 'ניהול לידים', href: '/dashboard/leads', Icon: MailIcon, desc: 'צפה וטפל בלידים' },
    { label: 'הגדרות SEO', href: '/dashboard/settings', Icon: Search, desc: 'עדכן הגדרות SEO' },
    { label: 'הזמנת חבר', href: '/dashboard/team', Icon: UserPlus, desc: 'הזמן חבר צוות' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={`שלום, ${user!.name}`} subtitle="ניהול וסקירת האתר שלך" />

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiItems.map(c => (
          <Link key={c.href} href={c.href} className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-ocean/25 hover:shadow-lg hover:shadow-ocean/[0.06]">
            <div className="mb-4 flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.bg}`}>
                <c.Icon className={`h-[18px] w-[18px] ${c.iconColor}`} />
              </div>
              <ArrowUpLeft className="h-4 w-4 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="font-noto text-3xl font-black text-navy">{c.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-400">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left Column - spans 2 */}
        <div className="space-y-5 lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Site Health */}
            <DashboardCard title="בריאות האתר" headerAction={
              <Link href="/dashboard/settings" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-slate-100">
                <Settings className="h-4 w-4 text-slate-400" />
              </Link>
            }>
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 shrink-0">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke={healthPct === 100 ? '#22C55E' : '#635BFF'} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${healthPct * 2.51} 251`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-noto text-lg font-bold text-navy">{healthPct}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {healthChecks.map(h => (
                    <div key={h.label} className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${h.ok ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                      <span className={`text-xs ${h.ok ? 'text-navy' : 'text-slate-400'}`}>{h.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardCard>

            {/* Content Stats */}
            <DashboardCard title="סקירת תוכן" headerAction={
              <Link href="/dashboard/pages" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-slate-100">
                <ArrowUpLeft className="h-4 w-4 text-slate-400" />
              </Link>
            }>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">עמודים מפורסמים</span>
                    <span className="font-semibold text-navy">{publishedPages}/{pageCount}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-ocean transition-all" style={{ width: `${pageCount ? (publishedPages / pageCount) * 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">לידים חדשים</span>
                    <span className="font-semibold text-navy">{newLeadCount}/{totalLeads}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${totalLeads ? (newLeadCount / totalLeads) * 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">פופאפים פעילים</span>
                    <span className="font-semibold text-navy">{popupCount}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: popupCount > 0 ? '100%' : '0%' }} />
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Leads Overview */}
          <DashboardCard title="לידים אחרונים" headerAction={
            <Link href="/dashboard/leads" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-slate-100">
              <ArrowUpLeft className="h-4 w-4 text-slate-400" />
            </Link>
          }>
            {recentLeads.length === 0 ? (
              <div className="py-8 text-center">
                <Mail className="mx-auto mb-2 h-8 w-8 text-slate-200" />
                <p className="text-xs text-slate-400">אין לידים עדיין</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map(lead => (
                  <div key={lead.id} className="flex items-center gap-3">
                    <div className={`h-2 w-2 shrink-0 rounded-full ${statusColors[lead.status] ?? 'bg-slate-300'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-navy">{lead.name}</p>
                        <span className="text-[11px] text-slate-400">{new Date(lead.createdAt).toLocaleDateString('he-IL')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="truncate text-[11px] text-slate-400">{lead.email}</p>
                        <span className="text-[11px] font-medium text-slate-500">{statusLabels[lead.status]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <DashboardCard title="פעולות מהירות" headerAction={
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ocean text-white">
              <Plus className="h-4 w-4" />
            </span>
          }>
            <div className="space-y-1">
              {quickActions.map(a => (
                <Link key={a.href} href={a.href} className="flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-all hover:bg-ocean-bg group">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-ocean group-hover:text-white">
                    <a.Icon className="h-4 w-4 text-slate-400 group-hover:text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy">{a.label}</p>
                    <p className="text-[11px] text-slate-400">{a.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </DashboardCard>

          {/* Activity Feed */}
          <DashboardCard title="פעילות אחרונה" headerAction={
            <Link href="/dashboard/activity" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-slate-100">
              <ArrowUpLeft className="h-4 w-4 text-slate-400" />
            </Link>
          }>
            {recentActivity.length === 0 ? (
              <div className="py-8 text-center">
                <History className="mx-auto mb-2 h-8 w-8 text-slate-200" />
                <p className="text-xs text-slate-400">אין פעילות עדיין</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ocean/[0.08]">
                      <span className="text-[11px] font-bold text-ocean">{(log.user?.name ?? '?')[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs text-navy">
                        <span className="font-semibold">{log.user?.name ?? 'מערכת'}</span>{' '}
                        {actionLabels[log.action] ?? log.action} {entityLabels[log.entity] ?? log.entity}
                      </p>
                      <p className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleDateString('he-IL')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>

          {/* Drafts */}
          {drafts.length > 0 && (
            <DashboardCard title="טיוטות" headerAction={
              <Link href="/dashboard/pages" className="cursor-pointer text-xs font-medium text-ocean hover:underline">הכל</Link>
            }>
              <div className="space-y-2.5">
                {drafts.map(page => (
                  <Link key={page.id} href={`/dashboard/pages/${page.id}`} className="flex cursor-pointer items-center justify-between rounded-xl p-2 transition-all hover:bg-ocean-bg group">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy group-hover:text-ocean transition-colors">{page.title}</p>
                      <p className="text-[11px] text-slate-400">/{page.slug}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">טיוטה</span>
                  </Link>
                ))}
              </div>
            </DashboardCard>
          )}
        </div>
      </div>
    </div>
  );
}
