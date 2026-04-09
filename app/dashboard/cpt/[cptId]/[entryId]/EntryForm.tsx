'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { updateEntryAction, type CptActionState } from '../../actions';

type Field = { name: string; label: string; type: string; required?: boolean; options?: string[] };
type Entry = {
  id: string; title: string; slug: string; status: string; data: string;
  cpt: { id: string; name: string; fields: string };
};

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy focus:border-ocean focus:ring-1 focus:ring-ocean/20 focus:outline-none transition-colors';
const labelCls = 'mb-1 block text-xs font-medium text-slate-500';

export default function EntryForm({ entry, cptId }: { entry: Entry; cptId: string }) {
  const [state, formAction, pending] = useActionState<CptActionState, FormData>(updateEntryAction, undefined);

  const fields: Field[] = JSON.parse(entry.cpt.fields || '[]');
  const entryData: Record<string, string> = JSON.parse(entry.data || '{}');

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="entryId" value={entry.id} />
      <input type="hidden" name="cptId" value={cptId} />

      {state?.error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{state.error}</p>}

      <label className="block">
        <span className={labelCls}>כותרת</span>
        <input name="title" required defaultValue={entry.title} className={inputCls} />
      </label>

      <label className="block">
        <span className={labelCls}>סלאג</span>
        <input name="slug" required defaultValue={entry.slug} dir="ltr" className={inputCls + ' font-mono'} />
      </label>

      <label className="block">
        <span className={labelCls}>סטטוס</span>
        <select name="status" defaultValue={entry.status} className={inputCls + ' cursor-pointer'}>
          <option value="draft">טיוטה</option>
          <option value="published">פורסם</option>
        </select>
      </label>

      {fields.length > 0 && (
        <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
          <h3 className="font-noto text-sm font-semibold text-navy">שדות מותאמים</h3>
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className={labelCls}>
                {field.label || field.name}
                {field.required && <span className="mr-1 text-red-500">*</span>}
              </span>
              {field.type === 'textarea' ? (
                <textarea
                  name={`field_${field.name}`}
                  rows={4}
                  required={field.required}
                  defaultValue={entryData[field.name] ?? ''}
                  className={inputCls + ' resize-y'}
                />
              ) : field.type === 'select' && field.options ? (
                <select
                  name={`field_${field.name}`}
                  required={field.required}
                  defaultValue={entryData[field.name] ?? ''}
                  className={inputCls + ' cursor-pointer'}
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
                  className={inputCls}
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
          className="rounded-full bg-ocean px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50"
        >
          {pending ? 'שומר...' : 'שמור'}
        </button>
        <Link href={`/dashboard/cpt/${cptId}`} className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-ocean hover:text-ocean">
          ביטול
        </Link>
      </div>
    </form>
  );
}
