'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { updateEntryAction, type CptActionState } from '../../actions';

type Field = { name: string; label: string; type: string; required?: boolean; options?: string[] };
type Entry = {
  id: string; title: string; slug: string; status: string; data: string;
  cpt: { id: string; name: string; fields: string };
};

export default function EntryForm({ entry, cptId }: { entry: Entry; cptId: string }) {
  const [state, formAction, pending] = useActionState<CptActionState, FormData>(updateEntryAction, undefined);

  const fields: Field[] = JSON.parse(entry.cpt.fields || '[]');
  const entryData: Record<string, string> = JSON.parse(entry.data || '{}');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href={`/dashboard/cpt/${cptId}`} className="text-xs text-charcoal/50 hover:text-primary mb-1 block">
            ← חזרה ל{entry.cpt.name}
          </Link>
          <h1 className="font-noto text-3xl font-black text-charcoal">עריכת רשומה</h1>
        </div>
      </div>

      <form action={formAction} className="border border-charcoal/10 bg-white p-6 space-y-5 max-w-3xl">
        <input type="hidden" name="entryId" value={entry.id} />
        <input type="hidden" name="cptId" value={cptId} />

        {state?.error && <p className="text-sm text-red-600 bg-red-50 p-3 border border-red-200">{state.error}</p>}

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">כותרת</span>
          <input name="title" required defaultValue={entry.title} className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none" />
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סלאג</span>
          <input name="slug" required defaultValue={entry.slug} dir="ltr" className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none font-mono text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סטטוס</span>
          <select name="status" defaultValue={entry.status} className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none">
            <option value="draft">טיוטה</option>
            <option value="published">פורסם</option>
          </select>
        </label>

        {fields.length > 0 && (
          <div className="border-t border-charcoal/10 pt-5 mt-5 space-y-5">
            <h3 className="font-noto text-sm font-bold text-charcoal/70">שדות מותאמים</h3>
            {fields.map((field) => (
              <label key={field.name} className="block">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">
                  {field.label || field.name}
                  {field.required && <span className="text-red-500 mr-1">*</span>}
                </span>
                {field.type === 'textarea' ? (
                  <textarea
                    name={`field_${field.name}`}
                    rows={4}
                    required={field.required}
                    defaultValue={entryData[field.name] ?? ''}
                    className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none resize-y"
                  />
                ) : field.type === 'select' && field.options ? (
                  <select
                    name={`field_${field.name}`}
                    required={field.required}
                    defaultValue={entryData[field.name] ?? ''}
                    className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none"
                  >
                    <option value="">בחר...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={`field_${field.name}`}
                    type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
                    required={field.required}
                    defaultValue={entryData[field.name] ?? ''}
                    className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none"
                  />
                )}
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
          >
            {pending ? 'שומר...' : 'שמור'}
          </button>
          <Link href={`/dashboard/cpt/${cptId}`} className="border border-charcoal/20 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-charcoal hover:border-primary">
            ביטול
          </Link>
        </div>
      </form>
    </div>
  );
}
