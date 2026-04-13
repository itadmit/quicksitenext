'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { updatePostAction, deletePostAction, type PostActionState } from './actions';

type Post = {
  id: string; title: string; slug: string; excerpt: string | null;
  content: string; coverImage: string | null; status: string;
  categoryId: string | null;
};
type Category = { id: string; name: string };

type Props = {
  post: Post;
  categories: Category[];
};

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-navy focus:border-ocean focus:ring-1 focus:ring-ocean/20 focus:outline-none transition-colors';
const labelCls = 'mb-1 block text-[10px] font-bold uppercase tracking-widest text-navy/60';

export default function EditPostForm({ post, categories }: Props) {
  const [state, formAction, pending] = useActionState<PostActionState, FormData>(updatePostAction, undefined);

  return (
    <div>
      <form action={formAction} className="rounded-xl border border-slate-100 bg-white p-6 space-y-5">
        <input type="hidden" name="id" value={post.id} />
        {state?.error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{state.error}</p>}

        <label className="block">
          <span className={labelCls}>כותרת</span>
          <input name="title" required defaultValue={post.title} className={inputCls} />
        </label>

        <label className="block">
          <span className={labelCls}>סלאג (באנגלית)</span>
          <input name="slug" required defaultValue={post.slug} dir="ltr" className={inputCls + ' font-mono text-sm'} />
        </label>

        <label className="block">
          <span className={labelCls}>תקציר</span>
          <textarea name="excerpt" rows={2} defaultValue={post.excerpt ?? ''} className={inputCls + ' resize-y'} />
        </label>

        <label className="block">
          <span className={labelCls}>תוכן</span>
          <textarea name="content" rows={10} defaultValue={post.content} className={inputCls + ' resize-y'} />
        </label>

        <label className="block">
          <span className={labelCls}>תמונת כיסוי (URL)</span>
          <input name="coverImage" type="url" defaultValue={post.coverImage ?? ''} dir="ltr" className={inputCls + ' font-mono text-sm'} />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className={labelCls}>סטטוס</span>
            <select name="status" defaultValue={post.status} className={inputCls + ' cursor-pointer'}>
              <option value="draft">טיוטה</option>
              <option value="published">פורסם</option>
            </select>
          </label>

          <label className="block">
            <span className={labelCls}>קטגוריה</span>
            <select name="categoryId" defaultValue={post.categoryId ?? ''} className={inputCls + ' cursor-pointer'}>
              <option value="">ללא קטגוריה</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="bg-navy rounded-lg px-4 py-2 text-[13px] font-semibold text-white hover:bg-navy/85 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
          >
            {pending ? 'שומר...' : 'שמור שינויים'}
          </button>
          <Link href="/dashboard/posts" className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-semibold text-slate-600 hover:border-slate-300 hover:text-navy transition-colors duration-150">
            ביטול
          </Link>
        </div>
      </form>

      <form action={deletePostAction} className="mt-6 border-t border-slate-200 pt-6">
        <input type="hidden" name="id" value={post.id} />
        <button
          type="submit"
          onClick={(e) => { if (!confirm('למחוק את הפוסט?')) e.preventDefault(); }}
          className="bg-red-600 rounded-lg px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer"
        >
          מחק פוסט
        </button>
      </form>
    </div>
  );
}
