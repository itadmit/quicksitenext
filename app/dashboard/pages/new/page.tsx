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

export default function NewPagePage() {
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
    <div dir="rtl" className="mx-auto max-w-xl">
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/dashboard/pages"
          className="flex items-center justify-center w-8 h-8 border border-charcoal/20 hover:border-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px] text-charcoal/60">arrow_forward</span>
        </Link>
        <h1 className="font-noto text-3xl font-black text-charcoal">עמוד חדש</h1>
      </div>

      {state.error && (
        <div className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      <form action={formAction} className="space-y-5 border border-charcoal/10 bg-white p-6">
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">
            כותרת
          </label>
          <input
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
            placeholder="שם העמוד"
          />
          {state.fieldErrors?.title && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.title[0]}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">
            נתיב (Slug)
          </label>
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
            className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm font-mono text-charcoal outline-none focus:border-primary transition-colors"
            placeholder="page-slug"
          />
          {state.fieldErrors?.slug && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.slug[0]}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">
            תבנית
          </label>
          <select
            name="template"
            defaultValue="blank"
            className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
          >
            {templateOptions.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">
            סטטוס
          </label>
          <select
            name="status"
            defaultValue="draft"
            className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
          >
            <option value="draft">טיוטה</option>
            <option value="published">פורסם</option>
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? 'יוצר...' : 'צור עמוד'}
          </button>
          <Link
            href="/dashboard/pages"
            className="border border-charcoal/20 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-charcoal hover:border-primary transition-colors"
          >
            ביטול
          </Link>
        </div>
      </form>
    </div>
  );
}
