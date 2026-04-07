type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default function TextBlock({ data }: Props) {
  const content = (data.content as string) || '';

  if (!content) return null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div
        className="prose prose-lg max-w-none prose-headings:font-display prose-a:underline"
        style={{ '--tw-prose-links': 'var(--tenant-primary)' } as React.CSSProperties}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}
