'use client';

import { useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createEntryAction, deleteEntryAction, type CptActionState } from '../actions';
import { DataTable, DataTableRow, DataTableCell, StatusBadge, DataTableEmpty } from '@/components/dashboard/DataTable';

type Entry = { id: string; title: string; slug: string; status: string; createdAt: string };
type Cpt = { id: string; name: string; slug: string; entries: Entry[] };

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';

const statusMap: Record<string, { label: string; color: string }> = {
  draft: { label: 'טיוטה', color: 'bg-slate-100 text-slate-500' },
  published: { label: 'פורסם', color: 'bg-green-50 text-green-700' },
};

export default function EntriesClient({ cpt }: { cpt: Cpt }) {
  const router = useRouter();
  const [deleting, startDelete] = useTransition();
  const [state, formAction, pending] = useActionState<CptActionState, FormData>(
    async (prev, fd) => { const result = await createEntryAction(prev, fd); if (!result?.error) router.refresh(); return result; },
    undefined,
  );

  function handleDeleteEntry(entryId: string) {
    if (!confirm('למחוק רשומה זו?')) return;
    startDelete(async () => { await deleteEntryAction(entryId, cpt.id); router.refresh(); });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-noto text-[15px] font-semibold text-navy">רשומה חדשה</h2>
        </div>
        <div className="px-6 py-5">
          <form action={formAction} className="flex items-end gap-3">
            <input type="hidden" name="cptId" value={cpt.id} />
            <label className="flex-1"><span className="mb-1 block text-xs font-medium text-slate-500">כותרת</span><input name="title" required className={inputCls} /></label>
            <label className="flex-1"><span className="mb-1 block text-xs font-medium text-slate-500">סלאג</span><input name="slug" required dir="ltr" className={inputCls + ' font-mono'} /></label>
            <button type="submit" disabled={pending} className="whitespace-nowrap rounded-full bg-ocean px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50">{pending ? '...' : 'הוסף'}</button>
          </form>
          {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
        </div>
      </div>

      {cpt.entries.length === 0 ? (
        <DataTableEmpty icon="list" text="אין רשומות עדיין" />
      ) : (
        <DataTable headers={['כותרת', 'סלאג', 'סטטוס', { label: '', className: 'w-32' }]}>
          {cpt.entries.map(entry => (
            <DataTableRow key={entry.id}>
              <DataTableCell className="font-medium text-navy">{entry.title}</DataTableCell>
              <DataTableCell className="font-mono text-slate-500">{entry.slug}</DataTableCell>
              <DataTableCell><StatusBadge status={entry.status} map={statusMap} /></DataTableCell>
              <DataTableCell>
                <div className="flex justify-end gap-3">
                  <Link href={`/dashboard/cpt/${cpt.id}/${entry.id}`} className="text-[13px] font-medium text-ocean hover:underline">עריכה</Link>
                  <button onClick={() => handleDeleteEntry(entry.id)} disabled={deleting} className="text-[13px] font-medium text-red-600 hover:underline disabled:opacity-50">מחק</button>
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
