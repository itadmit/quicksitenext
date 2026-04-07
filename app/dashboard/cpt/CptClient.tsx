'use client';

import { useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCptAction, deleteCptAction, type CptActionState } from './actions';

type Cpt = { id: string; name: string; slug: string; _count: { entries: number } };

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
    startDelete(async () => {
      await deleteCptAction(id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-noto text-3xl font-black text-charcoal">סוגי תוכן מותאמים</h1>
      </div>

      <div className="border border-charcoal/10 bg-white p-6 mb-6 max-w-xl">
        <h2 className="font-noto text-lg font-bold text-charcoal mb-4">סוג חדש</h2>
        <form action={formAction} className="flex gap-3 items-end">
          <label className="flex-1">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">שם</span>
            <input name="name" required className="w-full border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-primary focus:outline-none" />
          </label>
          <label className="flex-1">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סלאג</span>
            <input name="slug" required dir="ltr" className="w-full border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-primary focus:outline-none font-mono text-sm" />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
          >
            {pending ? '...' : 'צור'}
          </button>
        </form>
        {state?.error && <p className="text-sm text-red-600 mt-2">{state.error}</p>}
      </div>

      {cpts.length === 0 ? (
        <div className="border border-charcoal/10 bg-white p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-charcoal/20 mb-3 block">extension</span>
          <p className="text-charcoal/50 text-sm">אין סוגי תוכן עדיין</p>
        </div>
      ) : (
        <div className="border border-charcoal/10 bg-white overflow-hidden">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-charcoal/10 bg-charcoal/[0.02]">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">שם</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סלאג</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">רשומות</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {cpts.map((cpt) => (
                <tr key={cpt.id} className="border-b border-charcoal/5 hover:bg-charcoal/[0.01]">
                  <td className="px-4 py-3 font-medium text-charcoal">{cpt.name}</td>
                  <td className="px-4 py-3 text-sm text-charcoal/60 font-mono">{cpt.slug}</td>
                  <td className="px-4 py-3 text-sm text-charcoal/60">{cpt._count.entries}</td>
                  <td className="px-4 py-3 flex gap-3 justify-end">
                    <Link href={`/dashboard/cpt/${cpt.id}`} className="text-primary text-xs font-bold hover:underline">
                      רשומות
                    </Link>
                    <button
                      onClick={() => handleDelete(cpt.id)}
                      disabled={deleting}
                      className="text-red-600 text-xs font-bold hover:underline disabled:opacity-50"
                    >
                      מחק
                    </button>
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
