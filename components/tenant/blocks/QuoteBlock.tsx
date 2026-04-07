type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default function QuoteBlock({ data }: Props) {
  const text = (data.text as string) ?? '';
  const author = (data.author as string) ?? '';
  const role = (data.role as string) ?? '';

  if (!text) return null;

  return (
    <section className="px-6 py-20 bg-nude/30">
      <div className="mx-auto max-w-3xl text-center">
        <span
          className="block text-6xl leading-none opacity-20"
          style={{ color: 'var(--tenant-primary)' }}
        >
          &ldquo;
        </span>
        <blockquote className="mt-2 font-noto text-2xl font-medium italic leading-relaxed text-charcoal md:text-3xl">
          {text}
        </blockquote>
        {(author || role) && (
          <div className="mt-6">
            <div
              className="mx-auto mb-4 h-px w-12"
              style={{ backgroundColor: 'var(--tenant-primary)' }}
            />
            {author && (
              <p className="text-sm font-bold text-charcoal">{author}</p>
            )}
            {role && (
              <p className="mt-0.5 text-xs text-charcoal/50">{role}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
