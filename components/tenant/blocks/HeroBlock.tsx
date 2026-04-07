type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default function HeroBlock({ data }: Props) {
  const title = (data.title as string) ?? '';
  const subtitle = (data.subtitle as string) ?? '';
  const bg = (data.backgroundImage as string) ?? '';
  const btn1Label = (data.primaryBtnLabel as string) ?? '';
  const btn1Href = (data.primaryBtnHref as string) ?? '#';
  const btn2Label = (data.secondaryBtnLabel as string) ?? '';
  const btn2Href = (data.secondaryBtnHref as string) ?? '#';

  return (
    <section
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24"
      style={bg ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: 'linear-gradient(135deg, var(--tenant-primary) 0%, #1a1a1a 100%)' }}
    >
      {bg && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative z-10 max-w-3xl text-center">
        {title && (
          <h1 className="font-noto text-4xl font-black leading-tight text-white md:text-6xl">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-4 text-lg text-white/70 md:text-xl">{subtitle}</p>
        )}
        {(btn1Label || btn2Label) && (
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {btn1Label && (
              <a
                href={btn1Href}
                className="inline-block px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--tenant-primary)' }}
              >
                {btn1Label}
              </a>
            )}
            {btn2Label && (
              <a
                href={btn2Href}
                className="inline-block border border-white/30 px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:border-white/60"
              >
                {btn2Label}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
