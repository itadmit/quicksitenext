'use client';

import { FileText } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function EditablePostsGridBlock({ data }: Props) {
  const count = typeof data.count === 'number' ? data.count : 6;
  const columns = typeof data.columns === 'number' ? data.columns : 3;

  const gridClass =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className={`grid gap-8 ${gridClass}`}>
        {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-charcoal/10 bg-white"
          >
            <div className="aspect-video bg-slate-100 flex items-center justify-center">
              <FileText className="h-8 w-8 text-slate-300" />
            </div>
            <div className="p-5">
              <span className="mb-2 inline-block text-xs font-bold uppercase tracking-wider text-slate-300">
                קטגוריה
              </span>
              <div className="h-4 w-3/4 rounded bg-slate-100" />
              <div className="mt-2 h-3 w-full rounded bg-slate-50" />
              <div className="mt-1 h-3 w-2/3 rounded bg-slate-50" />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">
        תצוגה מקדימה של רשת פוסטים ({count} פוסטים, {columns} עמודות) — ערכו בפנל המאפיינים
      </p>
    </section>
  );
}
