'use client';

import { Star } from 'lucide-react';
import EditableText from '../EditableText';

type Item = { icon: string; title: string; description: string };

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function EditableAboutBlock({ data, onChange }: Props) {
  const items = (data.items as Item[]) ?? [];
  const variant = (data.variant as string) ?? 'grid';

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  if (!items.length) {
    return (
      <section className="px-6 py-20 text-center text-sm text-slate-400">
        הוסיפו פריטים דרך פנל המאפיינים
      </section>
    );
  }

  if (variant === 'horizontal') {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-10">
          {items.map((item, i) => (
            <div key={i} className="flex w-56 flex-col items-center text-center">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'color-mix(in srgb, var(--tenant-primary) 10%, transparent)' }}
              >
                <Star className="h-7 w-7" style={{ color: 'var(--tenant-primary)' }} />
              </div>
              <EditableText
                value={item.title}
                onChange={(v) => updateItem(i, 'title', v)}
                tag="h3"
                className="mt-4 font-noto text-xl font-black text-navy"
                placeholder="כותרת"
              />
              <EditableText
                value={item.description}
                onChange={(v) => updateItem(i, 'description', v)}
                tag="p"
                className="mt-2 text-sm leading-relaxed text-slate-500"
                placeholder="תיאור"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === 'alternating') {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl divide-y divide-slate-200">
          {items.map((item, i) => {
            const even = i % 2 === 0;
            return (
              <div
                key={i}
                className={`flex items-center gap-10 py-10 ${even ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex shrink-0 items-center justify-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-lg"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--tenant-primary) 10%, transparent)' }}
                  >
                    <Star className="h-7 w-7" style={{ color: 'var(--tenant-primary)' }} />
                  </div>
                </div>
                <div className="flex-1">
                  <EditableText
                    value={item.title}
                    onChange={(v) => updateItem(i, 'title', v)}
                    tag="h3"
                    className="font-noto text-lg font-bold text-navy"
                    placeholder="כותרת"
                  />
                  <EditableText
                    value={item.description}
                    onChange={(v) => updateItem(i, 'description', v)}
                    tag="p"
                    className="mt-2 text-sm leading-relaxed text-slate-500"
                    placeholder="תיאור"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="group rounded-2xl border border-slate-200 bg-white p-8 text-center transition-shadow hover:shadow-lg"
          >
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'color-mix(in srgb, var(--tenant-primary) 10%, transparent)' }}
            >
              <Star className="h-6 w-6" style={{ color: 'var(--tenant-primary)' }} />
            </div>
            <EditableText
              value={item.title}
              onChange={(v) => updateItem(i, 'title', v)}
              tag="h3"
              className="mt-4 font-noto text-lg font-bold text-navy"
              placeholder="כותרת"
            />
            <EditableText
              value={item.description}
              onChange={(v) => updateItem(i, 'description', v)}
              tag="p"
              className="mt-2 text-sm leading-relaxed text-navy/60"
              placeholder="תיאור"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
