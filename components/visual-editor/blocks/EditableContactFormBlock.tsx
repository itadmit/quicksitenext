'use client';

import EditableText from '../EditableText';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function EditableContactFormBlock({ data, onChange }: Props) {
  const title = (data.title as string) || 'צור קשר';
  const buttonLabel = (data.buttonLabel as string) || 'שליחה';

  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <EditableText
        value={title}
        onChange={(v) => update('title', v)}
        tag="h2"
        className="mb-8 text-center font-noto text-3xl font-black"
        style={{ color: 'var(--tenant-primary)' }}
        placeholder="כותרת הטופס"
      />

      {/* Form preview (non-functional in editor) */}
      <div className="space-y-5 pointer-events-none opacity-70">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">שם מלא *</label>
            <input
              readOnly
              className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-sm"
              placeholder="שם מלא"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">אימייל *</label>
            <input
              readOnly
              className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-sm"
              placeholder="email@example.com"
            />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">טלפון</label>
            <input
              readOnly
              className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">חברה</label>
            <input
              readOnly
              className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">הודעה</label>
          <textarea
            readOnly
            rows={4}
            className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="mt-5 text-center pointer-events-auto">
        <div
          className="inline-flex min-h-[48px] items-center justify-center px-10 py-3 text-xs font-bold uppercase tracking-widest text-white"
          style={{ backgroundColor: 'var(--tenant-primary)' }}
        >
          <EditableText
            value={buttonLabel}
            onChange={(v) => update('buttonLabel', v)}
            tag="span"
            className="text-white"
            placeholder="טקסט כפתור"
          />
        </div>
      </div>
    </section>
  );
}
