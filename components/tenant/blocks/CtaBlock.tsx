type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default function CtaBlock({ data }: Props) {
  const title = (data.title as string) ?? '';
  const description = (data.description as string) ?? '';
  const buttonLabel = (data.buttonLabel as string) ?? '';
  const buttonHref = (data.buttonHref as string) ?? '#';
  const variant = (data.variant as string) ?? 'primary';

  const isPrimary = variant === 'primary';

  return (
    <section className={`px-6 py-16 text-center ${isPrimary ? 'bg-charcoal text-white' : 'bg-nude'}`}>
      <div className="mx-auto max-w-2xl">
        {title && (
          <h2 className={`font-noto text-3xl font-black ${isPrimary ? '' : 'text-charcoal'}`}>{title}</h2>
        )}
        {description && (
          <p className={`mt-3 text-lg ${isPrimary ? 'text-white/70' : 'text-charcoal/70'}`}>{description}</p>
        )}
        {buttonLabel && (
          <a
            href={buttonHref}
            className={`mt-8 inline-block px-10 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition hover:opacity-90 ${
              isPrimary
                ? 'text-charcoal bg-white'
                : 'text-white'
            }`}
            style={!isPrimary ? { backgroundColor: 'var(--tenant-primary)' } : undefined}
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </section>
  );
}
