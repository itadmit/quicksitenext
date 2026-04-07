'use client';

import { useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { uploadMediaAction, deleteMediaAction } from './actions';

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
  const [deleting, startDelete] = useTransition();
  const [state, formAction, pending] = useActionState(
    async (prev: { error?: string; success?: boolean } | undefined, fd: FormData) => {
      const result = await uploadMediaAction(prev, fd);
      if (result?.success) router.refresh();
      return result;
    },
    undefined,
  );

  function handleDelete(id: string) {
    if (!confirm('למחוק את הקובץ?')) return;
    startDelete(async () => { await deleteMediaAction(id); router.refresh(); });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-noto text-3xl font-black text-charcoal">ספריית מדיה</h1>
      </div>

      <div className="border border-charcoal/10 bg-white p-6 mb-6 max-w-xl">
        <h2 className="font-noto text-lg font-bold text-charcoal mb-4">העלאת קובץ</h2>
        <form action={formAction} className="flex items-end gap-3">
          <label className="flex-1">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">בחר קובץ</span>
            <input
              name="file"
              type="file"
              accept="image/*"
              required
              className="w-full border border-charcoal/20 bg-white px-4 py-2 text-sm text-charcoal file:mr-3 file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-bold file:text-primary"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
          >
            {pending ? 'מעלה...' : 'העלה'}
          </button>
        </form>
        {state?.error && <p className="text-sm text-red-600 mt-2">{state.error}</p>}
        {state?.success && <p className="text-sm text-green-600 mt-2">הקובץ הועלה בהצלחה</p>}
        <p className="text-xs text-charcoal/40 mt-2">מקסימום 5MB. תמונות בלבד (JPG, PNG, GIF, WebP, SVG).</p>
      </div>

      {items.length === 0 ? (
        <div className="border border-charcoal/10 bg-white p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-charcoal/20 mb-3 block">photo_library</span>
          <p className="text-charcoal/50 text-sm">אין קבצי מדיה עדיין</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border border-charcoal/10 bg-white overflow-hidden group">
              <div className="aspect-square bg-charcoal/5 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt || item.filename}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting}
                  className="absolute top-2 left-2 bg-red-600 text-white w-7 h-7 flex items-center justify-center text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
              <div className="p-2">
                <p className="text-xs text-charcoal truncate" title={item.filename}>{item.filename}</p>
                <p className="text-[10px] text-charcoal/40">{formatSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
