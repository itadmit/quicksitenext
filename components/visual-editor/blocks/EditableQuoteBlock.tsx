'use client';

import EditableText from '../EditableText';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function EditableQuoteBlock({ data, onChange }: Props) {
  const text = (data.text as string) ?? '';
  const author = (data.author as string) ?? '';
  const role = (data.role as string) ?? '';

  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <section className="px-6 py-20 bg-nude/30">
      <div className="mx-auto max-w-3xl text-center">
        <span
          className="block text-6xl leading-none opacity-20"
          style={{ color: 'var(--tenant-primary)' }}
        >
          &ldquo;
        </span>
        <EditableText
          value={text}
          onChange={(v) => update('text', v)}
          tag="blockquote"
          className="mt-2 font-noto text-2xl font-medium italic leading-relaxed text-charcoal md:text-3xl"
          placeholder="ציטוט מעורר השראה"
        />
        <div className="mt-6">
          <div
            className="mx-auto mb-4 h-px w-12"
            style={{ backgroundColor: 'var(--tenant-primary)' }}
          />
          <EditableText
            value={author}
            onChange={(v) => update('author', v)}
            tag="p"
            className="text-sm font-bold text-charcoal"
            placeholder="שם המחבר"
          />
          <EditableText
            value={role}
            onChange={(v) => update('role', v)}
            tag="p"
            className="mt-0.5 text-xs text-charcoal/50"
            placeholder="תפקיד"
          />
        </div>
      </div>
    </section>
  );
}
