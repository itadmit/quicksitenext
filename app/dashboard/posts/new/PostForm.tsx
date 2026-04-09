'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { createPostAction, type PostActionState } from './actions';

type Category = { id: string; name: string };
type Tag = { id: string; name: string; slug: string };

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy focus:border-ocean focus:ring-1 focus:ring-ocean/20 focus:outline-none transition-colors';
const labelCls = 'mb-1 block text-xs font-medium text-slate-500';

export default function PostForm({ categories, tags }: { categories: Category[]; tags: Tag[] }) {
  const [state, formAction, pending] = useActionState<PostActionState, FormData>(createPostAction, undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  function addTag(tagId: string) {
    if (!selectedTags.includes(tagId)) setSelectedTags([...selectedTags, tagId]);
    setTagInput('');
  }

  function removeTag(tagId: string) {
    setSelectedTags(selectedTags.filter(t => t !== tagId));
  }

  const filteredTags = tags.filter(t => !selectedTags.includes(t.id) && t.name.includes(tagInput));

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{state.error}</p>}

      <label className="block"><span className={labelCls}>כותרת</span><input name="title" required className={inputCls} /></label>
      <label className="block"><span className={labelCls}>סלאג (באנגלית)</span><input name="slug" required dir="ltr" className={inputCls + ' font-mono'} /></label>
      <label className="block"><span className={labelCls}>תקציר</span><textarea name="excerpt" rows={2} className={inputCls + ' resize-y'} /></label>
      <label className="block"><span className={labelCls}>תוכן</span><textarea name="content" rows={8} className={inputCls + ' resize-y'} /></label>
      <label className="block"><span className={labelCls}>תמונת כיסוי (URL)</span><input name="coverImage" type="url" dir="ltr" className={inputCls + ' font-mono'} /></label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block"><span className={labelCls}>סטטוס</span>
          <select name="status" defaultValue="draft" className={inputCls + ' cursor-pointer'}><option value="draft">טיוטה</option><option value="published">פורסם</option></select>
        </label>
        <label className="block"><span className={labelCls}>קטגוריה</span>
          <select name="categoryId" defaultValue="" className={inputCls + ' cursor-pointer'}><option value="">ללא</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </label>
      </div>

      {/* Tags */}
      <div>
        <span className={labelCls}>תגיות</span>
        <input type="hidden" name="tagIds" value={selectedTags.join(',')} />
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedTags.map(tid => {
            const tag = tags.find(t => t.id === tid);
            return tag ? (
              <span key={tid} className="flex items-center gap-1 rounded-full bg-ocean/[0.08] px-3 py-1 text-xs font-medium text-ocean">
                {tag.name}
                <button type="button" onClick={() => removeTag(tid)} className="text-ocean/60 hover:text-ocean">×</button>
              </span>
            ) : null;
          })}
        </div>
        <div className="relative">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="הקלד לחיפוש תגיות..." className={inputCls} />
          {tagInput && filteredTags.length > 0 && (
            <div className="absolute top-full z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
              {filteredTags.slice(0, 5).map(t => (
                <button key={t.id} type="button" onClick={() => addTag(t.id)} className="block w-full px-4 py-2 text-right text-sm text-navy hover:bg-slate-50">{t.name}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className="rounded-full bg-ocean px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50">{pending ? 'שומר...' : 'צור פוסט'}</button>
        <Link href="/dashboard/posts" className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-ocean hover:text-ocean">ביטול</Link>
      </div>
    </form>
  );
}
