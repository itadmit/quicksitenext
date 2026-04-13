'use client';

import { useActionState, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { uploadMediaAction, deleteMediaAction, updateMediaAltAction } from './actions';
import { useCreateToggle } from '@/components/dashboard/CreateToggle';

type MediaItem = {
  id: string; filename: string; url: string; mimeType: string;
  size: number; alt: string; createdAt: Date | string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaClient({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const { isOpen: showUpload, close: closeUpload } = useCreateToggle();
  const [deleting, startDelete] = useTransition();
  const [editingAlt, setEditingAlt] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState(
    async (prev: { error?: string; success?: boolean } | undefined, fd: FormData) => {
      const result = await uploadMediaAction(prev, fd);
      if (result?.success) { closeUpload(); router.refresh(); }
      return result;
    },
    undefined,
  );

  function handleDelete(id: string) {
    if (!confirm('למחוק את הקובץ?')) return;
    startDelete(async () => { await deleteMediaAction(id); router.refresh(); });
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
  }

  async function saveAlt(id: string, alt: string) {
    await updateMediaAltAction(id, alt);
    setEditingAlt(null);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {showUpload && (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-6 py-4"><h2 className="text-[14px] font-semibold text-navy">העלאת קובץ</h2></div>
          <div className="px-6 py-5">
            <form action={formAction} className="flex items-end gap-3">
              <label className="flex-1"><span className="mb-1 block text-xs font-medium text-slate-500">בחר קובץ</span>
                <input name="file" type="file" accept="image/*" required multiple className="w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 file:mr-3 file:border-0 file:bg-ocean/[0.08] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-ocean file:rounded-full focus:outline-none focus:ring-2 focus:ring-ocean/20" />
              </label>
              <button type="submit" disabled={pending} className="cursor-pointer whitespace-nowrap rounded-lg bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-navy/85 disabled:opacity-50">{pending ? 'מעלה...' : 'העלה'}</button>
            </form>
            {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
            {state?.success && <p className="mt-2 text-sm text-green-600">הקובץ הועלה בהצלחה</p>}
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
          <span className="material-symbols-outlined mb-3 block text-4xl text-slate-300">photo_library</span>
          <p className="text-sm text-slate-500">אין קבצי מדיה עדיין</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map(item => (
            <div key={item.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="relative aspect-square bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.alt || item.filename} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-start justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => copyUrl(item.url)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-navy shadow"><span className="material-symbols-outlined text-sm">content_copy</span></button>
                  <button onClick={() => handleDelete(item.id)} disabled={deleting} className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow disabled:opacity-50"><span className="material-symbols-outlined text-sm">delete</span></button>
                </div>
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-medium text-navy" title={item.filename}>{item.filename}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">{formatSize(item.size)}</p>
                  <button onClick={() => setEditingAlt(editingAlt === item.id ? null : item.id)} className="text-[10px] text-ocean hover:underline">alt</button>
                </div>
                {editingAlt === item.id && (
                  <div className="mt-2">
                    <input defaultValue={item.alt ?? ''} onBlur={e => saveAlt(item.id, e.target.value)} onKeyDown={e => { if (e.key === 'Enter') saveAlt(item.id, (e.target as HTMLInputElement).value); }} className="w-full rounded border border-slate-200 px-2 py-1 text-xs text-navy focus:border-ocean focus:outline-none" placeholder="טקסט חלופי..." autoFocus />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
