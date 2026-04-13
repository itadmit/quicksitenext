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

  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="group border border-charcoal/5 bg-white p-8 text-center transition-shadow hover:shadow-lg"
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
              className="mt-4 font-noto text-lg font-bold text-charcoal"
              placeholder="כותרת"
            />
            <EditableText
              value={item.description}
              onChange={(v) => updateItem(i, 'description', v)}
              tag="p"
              className="mt-2 text-sm leading-relaxed text-charcoal/60"
              placeholder="תיאור"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
