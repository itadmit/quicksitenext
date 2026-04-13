'use client';

import { trackEvent } from '@/lib/tracking';

type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

function resolveVariant(raw: string): 'dark' | 'light' | 'banner' {
  if (raw === 'primary' || raw === 'dark') return 'dark';
  if (raw === 'secondary' || raw === 'light') return 'light';
  if (raw === 'banner') return 'banner';
  return 'dark';
}

export default function CtaBlock({ data }: Props) {
  const title = (data.title as string) ?? '';
  const description = (data.description as string) ?? '';
  const buttonLabel = (data.buttonLabel as string) ?? '';
  const buttonHref = (data.buttonHref as string) ?? '#';
  const variant = resolveVariant((data.variant as string) ?? 'dark');

  const handleClick = () =>
    trackEvent('ClickCTA', { label: buttonLabel, href: buttonHref, position: 'cta_block' });

  if (variant === 'banner') {
    return (
      <section
        className="px-6 py-10 md:py-14"
        style={{ background: 'linear-gradient(135deg, var(--tenant-primary), var(--tenant-primary-dark, var(--tenant-primary)) 80%)' }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-right">
          <div className="min-w-0 flex-1">
            {title && <h2 className="font-noto text-2xl font-black text-white md:text-3xl">{title}</h2>}
            {description && <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-base">{description}</p>}
          </div>
          {buttonLabel && (
            <a
              href={buttonHref}
              onClick={handleClick}
              className="shrink-0 rounded-full bg-white px-8 py-3.5 text-sm font-bold transition-colors hover:bg-white/90"
              style={{ color: 'var(--tenant-primary)' }}
            >
              {buttonLabel}
            </a>
          )}
        </div>
      </section>
    );
  }

  const isDark = variant === 'dark';

  return (
    <section className={`px-6 py-16 text-center ${isDark ? 'bg-navy text-white' : 'bg-ocean-bg'}`}>
      <div className="mx-auto max-w-2xl">
        {title && (
          <h2 className={`font-noto text-3xl font-black ${isDark ? 'text-white' : 'text-navy'}`}>{title}</h2>
        )}
        {description && (
          <p className={`mt-3 text-lg leading-relaxed ${isDark ? 'text-white/60' : 'text-navy/60'}`}>{description}</p>
        )}
        {buttonLabel && (
          <a
            href={buttonHref}
            onClick={handleClick}
            className={`mt-8 inline-block rounded-full px-10 py-3.5 text-sm font-bold transition-colors ${
              isDark
                ? 'bg-white text-navy hover:bg-white/90'
                : 'text-white hover:opacity-90'
            }`}
            style={!isDark ? { backgroundColor: 'var(--tenant-primary)' } : undefined}
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </section>
  );
}
