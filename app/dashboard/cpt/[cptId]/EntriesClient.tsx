'use client';

import { useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createEntryAction, deleteEntryAction, type CptActionState } from '../actions';

type Entry = { id: string; title: string; slug: string; status: string; createdAt: string };
type Cpt = { id: string; name: string; slug: string; entries: Entry[] };

export default function EntriesClient({ cpt }: { cpt: Cpt }) {
  const router = useRouter();
  const [deleting, startDelete] = useTransition();

  const [state, formAction, pending] = useActionState<CptActionState, FormData>(
    async (prev, fd) => {
      const result = await createEntryAction(prev, fd);
      if (!result?.error) router.refresh();
      return result;
    },
    undefined,
  );

  function handleDeleteEntry(entryId: string) {
    if (!confirm('למחוק רשומה זו?')) return;
    startDelete(async () => {
      await deleteEntryAction(entryId, cpt.id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard/cpt" className="text-xs text-charcoal/50 hover:text-primary mb-1 block">
            ← סוגי תוכן
          </Link>
          <h1 className="font-noto text-3xl font-black text-charcoal">{cpt.name}</h1>
        </div>
      </div>

      <div className="border border-charcoal/10 bg-white p-6 mb-6 max-w-xl">
        <h2 className="font-noto text-lg font-bold text-charcoal mb-4">רשומה חדשה</h2>
        <form action={formAction} className="flex gap-3 items-end">
          <input type="hidden" name="cptId" value={cpt.id} />
          <label className="flex-1">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">כותרת</span>
            <input name="title" required className="w-full border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-primary focus:outline-none" />
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
            {pending ? '...' : 'הוסף'}
          </button>
        </form>
        {state?.error && <p className="text-sm text-red-600 mt-2">{state.error}</p>}
      </div>

      {cpt.entries.length === 0 ? (
        <div className="border border-charcoal/10 bg-white p-12 text-center">
          <p className="text-charcoal/50 text-sm">אין רשומות עדיין</p>
        </div>
      ) : (
        <div className="border border-charcoal/10 bg-white overflow-hidden">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-charcoal/10 bg-charcoal/[0.02]">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">כותרת</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סלאג</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סטטוס</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {cpt.entries.map((entry) => (
                <tr key={entry.id} className="border-b border-charcoal/5 hover:bg-charcoal/[0.01]">
                  <td className="px-4 py-3 font-medium text-charcoal">{entry.title}</td>
                  <td className="px-4 py-3 text-sm text-charcoal/60 font-mono">{entry.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded ${entry.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-charcoal/10 text-charcoal/60'}`}>
                      {entry.status === 'published' ? 'פורסם' : 'טיוטה'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3 justify-end">
                    <Link href={`/dashboard/cpt/${cpt.id}/${entry.id}`} className="text-primary text-xs font-bold hover:underline">
                      עריכה
                    </Link>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
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
