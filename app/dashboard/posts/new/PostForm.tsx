'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { createPostAction, type PostActionState } from './actions';

type Category = { id: string; name: string };

type Props = {
  categories: Category[];
};

export default function PostForm({ categories }: Props) {
  const [state, formAction, pending] = useActionState<PostActionState, FormData>(createPostAction, undefined);

  return (
    <form action={formAction} className="border border-charcoal/10 bg-white p-6 space-y-5 max-w-3xl">
      {state?.error && <p className="text-sm text-red-600 bg-red-50 p-3 border border-red-200">{state.error}</p>}

      <label className="block">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">כותרת</span>
        <input name="title" required className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none" />
      </label>

      <label className="block">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סלאג (באנגלית)</span>
        <input name="slug" required dir="ltr" className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none font-mono text-sm" />
      </label>

      <label className="block">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תקציר</span>
        <textarea name="excerpt" rows={2} className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none resize-y" />
      </label>

      <label className="block">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תוכן</span>
        <textarea name="content" rows={10} className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none resize-y" />
      </label>

      <label className="block">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תמונת כיסוי (URL)</span>
        <input name="coverImage" type="url" dir="ltr" className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none font-mono text-sm" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סטטוס</span>
          <select name="status" defaultValue="draft" className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none">
            <option value="draft">טיוטה</option>
            <option value="published">פורסם</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">קטגוריה</span>
          <select name="categoryId" defaultValue="" className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none">
            <option value="">ללא קטגוריה</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
        >
          {pending ? 'שומר...' : 'צור פוסט'}
        </button>
        <Link href="/dashboard/posts" className="border border-charcoal/20 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-charcoal hover:border-primary">
          ביטול
        </Link>
      </div>
    </form>
  );
}
