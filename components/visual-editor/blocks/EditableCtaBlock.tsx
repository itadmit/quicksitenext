'use client';

import EditableText from '../EditableText';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

function resolveVariant(raw: string): 'dark' | 'light' | 'banner' {
  if (raw === 'primary' || raw === 'dark') return 'dark';
  if (raw === 'secondary' || raw === 'light') return 'light';
  if (raw === 'banner') return 'banner';
  return 'dark';
}

export default function EditableCtaBlock({ data, onChange }: Props) {
  const title = (data.title as string) ?? '';
  const description = (data.description as string) ?? '';
  const buttonLabel = (data.buttonLabel as string) ?? '';
  const variant = resolveVariant((data.variant as string) ?? 'dark');

  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  if (variant === 'banner') {
    return (
      <section
        className="px-6 py-10 md:py-14"
        style={{ background: 'linear-gradient(135deg, var(--tenant-primary), var(--tenant-primary-dark, var(--tenant-primary)) 80%)' }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-right">
          <div className="min-w-0 flex-1">
            <EditableText
              value={title}
              onChange={(v) => update('title', v)}
              tag="h2"
              className="font-noto text-2xl font-black text-white md:text-3xl"
              placeholder="כותרת באנר"
            />
            <EditableText
              value={description}
              onChange={(v) => update('description', v)}
              tag="p"
              className="mt-2 text-sm leading-relaxed text-white/70 md:text-base"
              placeholder="תיאור קצר"
            />
          </div>
          <div className="shrink-0">
            <div
              className="rounded-full bg-white px-8 py-3.5 text-sm font-bold"
              style={{ color: 'var(--tenant-primary)' }}
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

  const isDark = variant === 'dark';

  return (
    <section className={`px-6 py-16 text-center ${isDark ? 'bg-navy text-white' : 'bg-ocean-bg'}`}>
      <div className="mx-auto max-w-2xl">
        <EditableText
          value={title}
          onChange={(v) => update('title', v)}
          tag="h2"
          className={`font-noto text-3xl font-black ${isDark ? 'text-white' : 'text-navy'}`}
          placeholder="כותרת קריאה לפעולה"
        />
        <EditableText
          value={description}
          onChange={(v) => update('description', v)}
          tag="p"
          className={`mt-3 text-lg leading-relaxed ${isDark ? 'text-white/60' : 'text-navy/60'}`}
          placeholder="תיאור קצר"
        />
        <div className="mt-8 inline-block">
          <div
            className={`rounded-full px-10 py-3.5 text-sm font-bold transition-colors ${
              isDark
                ? 'bg-white text-navy'
                : 'text-white'
            }`}
            style={!isDark ? { backgroundColor: 'var(--tenant-primary)' } : undefined}
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
