import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/dashboard/PageHeader';
import { DataTable, DataTableRow, DataTableCell, DataTableEmpty } from '@/components/dashboard/DataTable';

export const metadata = { title: 'לוג פעילות | דשבורד' };

const entityLabels: Record<string, string> = {
  page: 'עמוד', post: 'פוסט', lead: 'ליד', popup: 'פופאפ', domain: 'דומיין',
  menu: 'תפריט', media: 'מדיה', cpt: 'סוג תוכן', cpt_entry: 'רשומה',
  settings: 'הגדרות', team: 'צוות',
};
const actionLabels: Record<string, string> = {
  created: 'יצר/ה', updated: 'עדכן/ה', deleted: 'מחק/ה', published: 'פרסם/ה',
  duplicated: 'שכפל/ה', exported: 'ייצא/ה',
};

export default async function ActivityPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;

  const logs = await prisma.activityLog.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { user: { select: { name: true } } },
  });

  return (
    <div className="space-y-5">
      <PageHeader title="לוג פעילות" subtitle={`${logs.length} פעולות אחרונות`} />

      {logs.length === 0 ? (
        <DataTableEmpty icon="history" text="אין פעילות עדיין" />
      ) : (
        <DataTable headers={['משתמש', 'פעולה', 'ישות', 'מזהה', 'תאריך']}>
          {logs.map(log => (
            <DataTableRow key={log.id}>
              <DataTableCell className="font-medium text-navy">{log.user?.name ?? 'מערכת'}</DataTableCell>
              <DataTableCell className="text-slate-500">{actionLabels[log.action] ?? log.action}</DataTableCell>
              <DataTableCell className="text-slate-500">{entityLabels[log.entity] ?? log.entity}</DataTableCell>
              <DataTableCell className="font-mono text-[11px] text-slate-400">{log.entityId ?? '—'}</DataTableCell>
              <DataTableCell className="text-[11px] text-slate-400">{new Date(log.createdAt).toLocaleString('he-IL')}</DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
