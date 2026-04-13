'use client';

import { useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
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
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-[14px] font-semibold text-navy">רשומה חדשה</h2>
        </div>
        <div className="px-5 py-4">
          <form action={formAction} className="flex items-end gap-3">
            <input type="hidden" name="cptId" value={cpt.id} />
            <label className="flex-1"><span className="mb-1 block text-xs font-medium text-slate-500">כותרת</span><input name="title" required className={inputCls} /></label>
            <label className="flex-1"><span className="mb-1 block text-xs font-medium text-slate-500">סלאג</span><input name="slug" required dir="ltr" className={inputCls + ' font-mono'} /></label>
            <button type="submit" disabled={pending} className="whitespace-nowrap rounded-lg bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-navy/85 disabled:opacity-50">{pending ? '...' : 'הוסף'}</button>
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
                <div className="flex items-center justify-end gap-0.5">
                  <Link
                    href={`/dashboard/cpt/${cpt.id}/${entry.id}`}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-navy"
                    title="עריכה"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    disabled={deleting}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                    title="מחק"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
