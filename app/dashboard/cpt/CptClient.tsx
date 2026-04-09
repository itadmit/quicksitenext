'use client';

import { useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCptAction, deleteCptAction, type CptActionState } from './actions';
import { DataTable, DataTableRow, DataTableCell, DataTableEmpty } from '@/components/dashboard/DataTable';

type Cpt = { id: string; name: string; slug: string; _count: { entries: number } };

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';

export default function CptClient({ cpts }: { cpts: Cpt[] }) {
  const router = useRouter();
  const [deleting, startDelete] = useTransition();
  const [state, formAction, pending] = useActionState<CptActionState, FormData>(
    async (prev, fd) => {
      const result = await createCptAction(prev, fd);
      if (!result?.error) router.refresh();
      return result;
    },
    undefined,
  );

  function handleDelete(id: string) {
    if (!confirm('למחוק את סוג התוכן? כל הרשומות שלו יימחקו.')) return;
    startDelete(async () => { await deleteCptAction(id); router.refresh(); });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-noto text-[15px] font-semibold text-navy">סוג חדש</h2>
        </div>
        <div className="px-6 py-5">
          <form action={formAction} className="flex items-end gap-3">
            <label className="flex-1"><span className="mb-1 block text-xs font-medium text-slate-500">שם</span><input name="name" required className={inputCls} /></label>
            <label className="flex-1"><span className="mb-1 block text-xs font-medium text-slate-500">סלאג</span><input name="slug" required dir="ltr" className={inputCls + ' font-mono'} /></label>
            <button type="submit" disabled={pending} className="whitespace-nowrap rounded-full bg-ocean px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50">{pending ? '...' : 'צור'}</button>
          </form>
          {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
        </div>
      </div>

      {cpts.length === 0 ? (
        <DataTableEmpty icon="extension" text="אין סוגי תוכן עדיין" />
      ) : (
        <DataTable headers={['שם', 'סלאג', 'רשומות', { label: '', className: 'w-40' }]}>
          {cpts.map(cpt => (
            <DataTableRow key={cpt.id}>
              <DataTableCell className="font-medium text-navy">{cpt.name}</DataTableCell>
              <DataTableCell className="font-mono text-slate-500">{cpt.slug}</DataTableCell>
              <DataTableCell className="text-slate-500">{cpt._count.entries}</DataTableCell>
              <DataTableCell>
                <div className="flex justify-end gap-3">
                  <Link href={`/dashboard/cpt/${cpt.id}`} className="text-[13px] font-medium text-ocean hover:underline">רשומות</Link>
                  <Link href={`/dashboard/cpt/${cpt.id}/fields`} className="text-[13px] font-medium text-slate-500 hover:text-ocean hover:underline">שדות</Link>
                  <button onClick={() => handleDelete(cpt.id)} disabled={deleting} className="text-[13px] font-medium text-red-600 hover:underline disabled:opacity-50">מחק</button>
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
