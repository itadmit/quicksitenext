'use client';

import EditableText from '../EditableText';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const inputPreview = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm';

function FormPreview() {
  return (
    <div className="space-y-5 pointer-events-none opacity-70">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">שם מלא *</label>
          <input readOnly className={inputPreview} placeholder="שם מלא" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">אימייל *</label>
          <input readOnly className={inputPreview} placeholder="email@example.com" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">טלפון</label>
          <input readOnly className={inputPreview} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">חברה</label>
          <input readOnly className={inputPreview} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-navy">הודעה</label>
        <textarea readOnly rows={4} className={`${inputPreview} resize-none`} />
      </div>
    </div>
  );
}

function StandaloneVariant({
  title,
  buttonLabel,
  update,
}: {
  title: string;
  buttonLabel: string;
  update: (key: string, value: string) => void;
}) {
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

      <FormPreview />

      <div className="mt-5 text-center pointer-events-auto">
        <div
          className="inline-flex min-h-[48px] items-center justify-center rounded-full px-10 py-3 text-xs font-bold uppercase tracking-widest text-white"
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

function SplitVariant({
  title,
  subtitle,
  buttonLabel,
  update,
}: {
  title: string;
  subtitle: string;
  buttonLabel: string;
  update: (key: string, value: string) => void;
}) {
  return (
    <section className="bg-slate-50 px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        {/* Right column — info */}
        <div className="flex flex-col justify-center">
          <EditableText
            value={title}
            onChange={(v) => update('title', v)}
            tag="h2"
            className="font-noto text-3xl font-black"
            style={{ color: 'var(--tenant-primary)' }}
            placeholder="כותרת הטופס"
          />
          <EditableText
            value={subtitle}
            onChange={(v) => update('subtitle', v)}
            tag="p"
            className="mt-4 text-base leading-relaxed text-navy/60"
            placeholder="תיאור קצר או פרטי יצירת קשר..."
          />
        </div>

        {/* Left column — form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <FormPreview />

          <div className="mt-5 pointer-events-auto">
            <div
              className="flex w-full items-center justify-center rounded-full py-3 text-xs font-bold uppercase tracking-widest text-white"
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
        </div>
      </div>
    </section>
  );
}

export default function EditableContactFormBlock({ data, onChange }: Props) {
  const title = (data.title as string) || 'צור קשר';
  const subtitle = (data.subtitle as string) || '';
  const buttonLabel = (data.buttonLabel as string) || 'שליחה';
  const variant = (data.variant as string) || 'standalone';

  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  if (variant === 'split') {
    return (
      <SplitVariant
        title={title}
        subtitle={subtitle}
        buttonLabel={buttonLabel}
        update={update}
      />
    );
  }

  return (
    <StandaloneVariant
      title={title}
      buttonLabel={buttonLabel}
      update={update}
    />
  );
}
