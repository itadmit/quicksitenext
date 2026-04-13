'use client';

import { useActionState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCptAction, deleteCptAction, type CptActionState } from './actions';
import { DataTable, DataTableRow, DataTableCell, DataTableEmpty } from '@/components/dashboard/DataTable';
import { useCreateToggle } from '@/components/dashboard/CreateToggle';

type Cpt = { id: string; name: string; slug: string; _count: { entries: number } };

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';

export default function CptClient({ cpts }: { cpts: Cpt[] }) {
  const router = useRouter();
  const { isOpen, close } = useCreateToggle();
  const [deleting, startDelete] = useTransition();
  const [state, formAction, pending] = useActionState<CptActionState, FormData>(
    async (prev, fd) => {
      const result = await createCptAction(prev, fd);
      if (!result?.error) { close(); router.refresh(); }
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
      {isOpen && (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-[14px] font-semibold text-navy">סוג חדש</h2>
          </div>
          <div className="px-5 py-4">
            <form action={formAction} className="flex items-end gap-3">
              <label className="flex-1"><span className="mb-1 block text-xs font-medium text-slate-500">שם</span><input name="name" required className={inputCls} /></label>
              <label className="flex-1"><span className="mb-1 block text-xs font-medium text-slate-500">סלאג</span><input name="slug" required dir="ltr" className={inputCls + ' font-mono'} /></label>
              <button type="submit" disabled={pending} className="cursor-pointer whitespace-nowrap rounded-lg bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-navy/85 disabled:opacity-50">{pending ? '...' : 'צור'}</button>
            </form>
            {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
          </div>
        </div>
      )}

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
                  <Link href={`/dashboard/cpt/${cpt.id}`} className="text-[13px] font-medium text-navy hover:underline">רשומות</Link>
                  <Link href={`/dashboard/cpt/${cpt.id}/fields`} className="text-[13px] font-medium text-slate-500 hover:text-navy hover:underline">שדות</Link>
                  <button onClick={() => handleDelete(cpt.id)} disabled={deleting} className="cursor-pointer text-[13px] font-medium text-slate-400 hover:text-red-500 disabled:opacity-50">מחק</button>
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
