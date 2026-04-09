'use client';

import { useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addDomainAction, removeDomainAction, verifyDomainAction, type DomainActionState } from './actions';
import { DataTable, DataTableRow, DataTableCell, StatusBadge, DataTableEmpty } from '@/components/dashboard/DataTable';

type Domain = {
  id: string; hostname: string; type: string;
  verified: boolean; verifiedAt: Date | string | null; createdAt: Date | string;
};

const verifyMap: Record<string, { label: string; color: string }> = {
  true: { label: 'מאומת', color: 'bg-green-50 text-green-700' },
  false: { label: 'ממתין', color: 'bg-yellow-50 text-yellow-700' },
};

const sslMap: Record<string, { label: string; color: string }> = {
  true: { label: 'SSL Active', color: 'bg-green-50 text-green-700' },
  false: { label: '—', color: 'bg-slate-100 text-slate-400' },
};

export default function DomainsClient({ domains }: { domains: Domain[] }) {
  const router = useRouter();
  const [acting, startAction] = useTransition();
  const [state, formAction, pending] = useActionState<DomainActionState, FormData>(
    async (prev, fd) => { const result = await addDomainAction(prev, fd); if (result?.success) router.refresh(); return result; },
    undefined,
  );

  function handleRemove(id: string) {
    if (!confirm('להסיר את הדומיין?')) return;
    startAction(async () => { await removeDomainAction(id); router.refresh(); });
  }

  function handleVerify(id: string) {
    startAction(async () => { await verifyDomainAction(id); router.refresh(); });
  }

  const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 font-mono text-sm text-navy ring-1 ring-slate-200/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean/20';

  return (
    <div className="space-y-5">
      {/* Add Domain Form */}
      <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-slate-100 px-6 py-4"><h2 className="font-noto text-[15px] font-semibold text-navy">הוסף דומיין מותאם</h2></div>
        <div className="px-6 py-5">
          <form action={formAction} className="flex items-end gap-3">
            <label className="flex-1"><span className="mb-1 block text-xs font-medium text-slate-500">שם דומיין</span>
              <input name="hostname" required dir="ltr" placeholder="example.com" className={inputCls} />
            </label>
            <button type="submit" disabled={pending} className="whitespace-nowrap rounded-full bg-ocean px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50">{pending ? '...' : 'הוסף'}</button>
          </form>
          {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
          {state?.success && <p className="mt-2 text-sm text-green-600">דומיין נוסף בהצלחה</p>}
        </div>
      </div>

      {/* DNS Instructions */}
      <div className="rounded-2xl bg-ocean/[0.03] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-ocean/10 px-6 py-4"><h2 className="font-noto text-[15px] font-semibold text-navy">הוראות DNS</h2></div>
        <div className="space-y-3 px-6 py-5 text-sm text-navy">
          <p>כדי לחבר דומיין מותאם, הגדרו את רשומות ה-DNS הבאות:</p>
          <DataTable headers={[
            { label: 'Type', className: 'text-left' },
            { label: 'Name', className: 'text-left' },
            { label: 'Value', className: 'text-left' },
          ]}>
            <DataTableRow>
              <DataTableCell className="font-mono text-[11px]">CNAME</DataTableCell>
              <DataTableCell className="font-mono text-[11px]">www</DataTableCell>
              <DataTableCell className="font-mono text-[11px]">cname.quicksite.co.il</DataTableCell>
            </DataTableRow>
            <DataTableRow>
              <DataTableCell className="font-mono text-[11px]">A</DataTableCell>
              <DataTableCell className="font-mono text-[11px]">@</DataTableCell>
              <DataTableCell className="font-mono text-[11px]">76.76.21.21</DataTableCell>
            </DataTableRow>
          </DataTable>
          <p className="text-xs text-slate-500">לאחר הגדרת ה-DNS, לחצו &quot;אמת&quot; ליד הדומיין. האימות עלול לקחת עד 24 שעות.</p>
        </div>
      </div>

      {/* Domains Table */}
      {domains.length === 0 ? (
        <DataTableEmpty icon="language" text="אין דומיינים עדיין" />
      ) : (
        <DataTable headers={['דומיין', 'סוג', 'סטטוס', 'SSL', { label: '', className: 'w-32' }]}>
          {domains.map(domain => (
            <DataTableRow key={domain.id}>
              <DataTableCell className="font-mono font-medium text-navy" dir="ltr">{domain.hostname}</DataTableCell>
              <DataTableCell className="text-slate-500">{domain.type === 'subdomain' ? 'סאב-דומיין' : 'מותאם'}</DataTableCell>
              <DataTableCell><StatusBadge status={String(domain.verified)} map={verifyMap} /></DataTableCell>
              <DataTableCell><StatusBadge status={String(domain.verified)} map={sslMap} /></DataTableCell>
              <DataTableCell>
                <div className="flex justify-end gap-3">
                  {!domain.verified && <button onClick={() => handleVerify(domain.id)} disabled={acting} className="text-[13px] font-medium text-ocean hover:underline disabled:opacity-50">אמת</button>}
                  {domain.type === 'custom' && <button onClick={() => handleRemove(domain.id)} disabled={acting} className="text-[13px] font-medium text-red-600 hover:underline disabled:opacity-50">הסר</button>}
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
