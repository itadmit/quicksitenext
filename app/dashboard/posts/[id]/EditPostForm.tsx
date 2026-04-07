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

export default function EditPostForm({ post, categories }: Props) {
  const [state, formAction, pending] = useActionState<PostActionState, FormData>(updatePostAction, undefined);

  return (
    <div>
      <form action={formAction} className="border border-charcoal/10 bg-white p-6 space-y-5 max-w-3xl">
        <input type="hidden" name="id" value={post.id} />
        {state?.error && <p className="text-sm text-red-600 bg-red-50 p-3 border border-red-200">{state.error}</p>}

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">כותרת</span>
          <input name="title" required defaultValue={post.title} className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none" />
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סלאג (באנגלית)</span>
          <input name="slug" required defaultValue={post.slug} dir="ltr" className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none font-mono text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תקציר</span>
          <textarea name="excerpt" rows={2} defaultValue={post.excerpt ?? ''} className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none resize-y" />
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תוכן</span>
          <textarea name="content" rows={10} defaultValue={post.content} className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none resize-y" />
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תמונת כיסוי (URL)</span>
          <input name="coverImage" type="url" defaultValue={post.coverImage ?? ''} dir="ltr" className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none font-mono text-sm" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סטטוס</span>
            <select name="status" defaultValue={post.status} className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none">
              <option value="draft">טיוטה</option>
              <option value="published">פורסם</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">קטגוריה</span>
            <select name="categoryId" defaultValue={post.categoryId ?? ''} className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none">
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
            className="bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
          >
            {pending ? 'שומר...' : 'שמור שינויים'}
          </button>
          <Link href="/dashboard/posts" className="border border-charcoal/20 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-charcoal hover:border-primary">
            ביטול
          </Link>
        </div>
      </form>

      <form action={deletePostAction} className="mt-6 max-w-3xl border-t border-charcoal/10 pt-6">
        <input type="hidden" name="id" value={post.id} />
        <button
          type="submit"
          onClick={(e) => { if (!confirm('למחוק את הפוסט?')) e.preventDefault(); }}
          className="bg-red-600 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90"
        >
          מחק פוסט
        </button>
      </form>
    </div>
  );
}
