'use client';

import { useActionState, useState, useEffect } from 'react';
import { createPageAction, type CreatePageState } from './actions';
import Link from 'next/link';

const templateOptions = [
  { value: 'blank', label: 'ריק' },
  { value: 'home', label: 'דף הבית' },
  { value: 'contact', label: 'צור קשר' },
  { value: 'landing', label: 'דף נחיתה' },
  { value: 'blog', label: 'בלוג' },
  { value: 'agency', label: 'סוכנות' },
];

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0590-\u05FF\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/20 transition-colors';
const labelCls = 'mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60';

export default function NewPageForm() {
  const [state, formAction, isPending] = useActionState<CreatePageState, FormData>(
    createPageAction,
    {},
  );
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched]);

  return (
    <>
      {state.error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      <form action={formAction} className="space-y-5 rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <div>
          <label className={labelCls}>כותרת</label>
          <input
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            placeholder="שם העמוד"
          />
          {state.fieldErrors?.title && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.title[0]}</p>
          )}
        </div>

        <div>
          <label className={labelCls}>נתיב (Slug)</label>
          <input
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            dir="ltr"
            className={inputCls + ' font-mono'}
            placeholder="page-slug"
          />
          {state.fieldErrors?.slug && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.slug[0]}</p>
          )}
        </div>

        <div>
          <label className={labelCls}>תבנית</label>
          <select name="template" defaultValue="blank" className={inputCls + ' cursor-pointer'}>
            {templateOptions.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>סטטוס</label>
          <select name="status" defaultValue="draft" className={inputCls + ' cursor-pointer'}>
            <option value="draft">טיוטה</option>
            <option value="published">פורסם</option>
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer rounded-full bg-ocean px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-ocean/85 disabled:opacity-50"
          >
            {isPending ? 'יוצר...' : 'צור עמוד'}
          </button>
          <Link
            href="/dashboard/pages"
            className="rounded-full border border-slate-200 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-navy transition-colors hover:border-ocean hover:text-ocean"
          >
            ביטול
          </Link>
        </div>
      </form>
    </>
  );
}
