'use client';

import EditableText from '../EditableText';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function EditableCtaBlock({ data, onChange }: Props) {
  const title = (data.title as string) ?? '';
  const description = (data.description as string) ?? '';
  const buttonLabel = (data.buttonLabel as string) ?? '';
  const variant = (data.variant as string) ?? 'primary';
  const isPrimary = variant === 'primary';

  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <section className={`px-6 py-16 text-center ${isPrimary ? 'bg-charcoal text-white' : 'bg-nude'}`}>
      <div className="mx-auto max-w-2xl">
        <EditableText
          value={title}
          onChange={(v) => update('title', v)}
          tag="h2"
          className={`font-noto text-3xl font-black ${isPrimary ? '' : 'text-charcoal'}`}
          placeholder="כותרת קריאה לפעולה"
        />
        <EditableText
          value={description}
          onChange={(v) => update('description', v)}
          tag="p"
          className={`mt-3 text-lg ${isPrimary ? 'text-white/70' : 'text-charcoal/70'}`}
          placeholder="תיאור קצר"
        />
        <div className="mt-8 inline-block">
          <div
            className={`px-10 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition ${
              isPrimary ? 'bg-white text-charcoal' : 'text-white'
            }`}
            style={!isPrimary ? { backgroundColor: 'var(--tenant-primary)' } : undefined}
          >
            <EditableText
              value={buttonLabel}
              onChange={(v) => update('buttonLabel', v)}
              tag="span"
              placeholder="טקסט כפתור"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
