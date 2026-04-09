'use client';

import { useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createCategoryAction, deleteCategoryAction, type CategoryActionState } from './actions';
import { DataTable, DataTableRow, DataTableCell } from '@/components/dashboard/DataTable';

type Cat = { id: string; name: string; slug: string; _count: { posts: number } };

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';

export default function CategoriesClient({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [deleting, startDelete] = useTransition();
  const [state, formAction, pending] = useActionState<CategoryActionState, FormData>(
    async (prev, fd) => { const r = await createCategoryAction(prev, fd); if (!r?.error) router.refresh(); return r; },
    undefined,
  );

  function handleDelete(id: string) {
    if (!confirm('למחוק קטגוריה?')) return;
    startDelete(async () => { await deleteCategoryAction(id); router.refresh(); });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-noto text-[15px] font-semibold text-navy">קטגוריה חדשה</h2>
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

      {categories.length > 0 && (
        <DataTable headers={['שם', 'סלאג', 'פוסטים', { label: '', className: 'w-20' }]}>
          {categories.map(c => (
            <DataTableRow key={c.id}>
              <DataTableCell className="font-medium text-navy">{c.name}</DataTableCell>
              <DataTableCell className="font-mono text-slate-500">{c.slug}</DataTableCell>
              <DataTableCell className="text-slate-500">{c._count.posts}</DataTableCell>
              <DataTableCell className="text-left">
                <button onClick={() => handleDelete(c.id)} disabled={deleting} className="text-[13px] font-medium text-red-600 hover:underline disabled:opacity-50">מחק</button>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
