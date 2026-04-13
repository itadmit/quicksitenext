'use client';

import EditableText from '../EditableText';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function EditableTextBlock({ data, onChange }: Props) {
  const content = (data.content as string) || '';

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <EditableText
        value={content}
        onChange={(v) => onChange({ ...data, content: v })}
        tag="div"
        className="prose prose-lg max-w-none prose-headings:font-display prose-a:underline"
        placeholder="<p>הכניסו תוכן כאן...</p>"
        richText
        style={{ '--tw-prose-links': 'var(--tenant-primary)' } as React.CSSProperties}
      />
    </section>
  );
}
