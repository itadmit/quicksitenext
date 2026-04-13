'use client';

import { trackEvent } from '@/lib/tracking';

type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

function btnClasses(variant: string) {
  const base = 'inline-block px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition';
  switch (variant) {
    case 'outline':
      return `${base} border border-white/30 hover:border-white/60`;
    case 'underline':
      return `${base} border-b-2 border-white/50 hover:border-white`;
    default:
      return `${base} hover:opacity-90`;
  }
}

function btnClassesDark(variant: string) {
  const base = 'inline-block px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition';
  switch (variant) {
    case 'outline':
      return `${base} border border-slate-300 hover:border-slate-500`;
    case 'underline':
      return `${base} border-b-2 border-slate-400 hover:border-slate-600`;
    default:
      return `${base} hover:opacity-90`;
  }
}

function btnStyle(variant: string): React.CSSProperties {
  if (variant === 'filled' || !variant) {
    return { backgroundColor: 'var(--tenant-primary)', color: 'var(--theme-btn-text, #ffffff)' };
  }
  return { color: 'var(--theme-btn-text, #ffffff)' };
}

function btnStyleDark(variant: string): React.CSSProperties {
  if (variant === 'filled' || !variant) {
    return { backgroundColor: 'var(--tenant-primary)', color: 'var(--theme-btn-text, #ffffff)' };
  }
  return { color: 'var(--theme-heading, #0A2540)' };
}

export default function HeroBlock({ data }: Props) {
  const variant = (data.variant as string) ?? 'centered';
  const title = (data.title as string) ?? '';
  const subtitle = (data.subtitle as string) ?? '';
  const bg = (data.backgroundImage as string) ?? '';
  const btn1Label = (data.primaryBtnLabel as string) ?? '';
  const btn1Href = (data.primaryBtnHref as string) ?? '#';
  const btn1Variant = (data.primaryBtnVariant as string) ?? 'filled';
  const btn2Label = (data.secondaryBtnLabel as string) ?? '';
  const btn2Href = (data.secondaryBtnHref as string) ?? '#';
  const btn2Variant = (data.secondaryBtnVariant as string) ?? 'outline';

  const track = (label: string, href: string, position: string) =>
    trackEvent('ClickCTA', { label, href, position });

  /* ── Buttons (light-on-dark) ── */
  const renderButtons = () => {
    if (!btn1Label && !btn2Label) return null;
    return (
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        {btn1Label && (
          <a href={btn1Href} className={btnClasses(btn1Variant)} style={btnStyle(btn1Variant)} onClick={() => track(btn1Label, btn1Href, 'hero_primary')}>
            {btn1Label}
          </a>
        )}
        {btn2Label && (
          <a href={btn2Href} className={btnClasses(btn2Variant)} style={btnStyle(btn2Variant)} onClick={() => track(btn2Label, btn2Href, 'hero_secondary')}>
            {btn2Label}
          </a>
        )}
      </div>
    );
  };

  /* ── Buttons (dark-on-light) ── */
  const renderButtonsDark = () => {
    if (!btn1Label && !btn2Label) return null;
    return (
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        {btn1Label && (
          <a href={btn1Href} className={btnClassesDark(btn1Variant)} style={btnStyleDark(btn1Variant)} onClick={() => track(btn1Label, btn1Href, 'hero_primary')}>
            {btn1Label}
          </a>
        )}
        {btn2Label && (
          <a href={btn2Href} className={btnClassesDark(btn2Variant)} style={btnStyleDark(btn2Variant)} onClick={() => track(btn2Label, btn2Href, 'hero_secondary')}>
            {btn2Label}
          </a>
        )}
      </div>
    );
  };

  /* ── Variant: centered (default) ── */
  if (variant === 'centered') {
    return (
      <section
        className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24"
        style={
          bg
            ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, var(--theme-grad-from, var(--tenant-primary)) 0%, var(--theme-grad-to, #1a1a1a) 100%)' }
        }
      >
        {bg && <div className="absolute inset-0" style={{ backgroundColor: 'var(--theme-overlay, rgba(0,0,0,0.5))' }} />}
        <div className="relative z-10 max-w-3xl text-center">
          {title && (
            <h1 className="font-noto text-4xl font-black leading-tight md:text-6xl" style={{ color: 'var(--theme-heading, #ffffff)' }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-4 text-lg md:text-xl" style={{ color: 'var(--theme-body, rgba(255,255,255,0.7))' }}>
              {subtitle}
            </p>
          )}
          {renderButtons()}
        </div>
      </section>
    );
  }

  /* ── Variant: split ── */
  if (variant === 'split') {
    return (
      <section className="flex min-h-[70vh] flex-col md:flex-row-reverse">
        <div className="flex flex-1 flex-col items-start justify-center px-8 py-16 md:px-16 lg:px-24">
          {title && (
            <h1 className="font-noto text-4xl font-black leading-tight md:text-5xl" style={{ color: 'var(--theme-heading, #0A2540)' }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-4 text-lg leading-relaxed" style={{ color: 'var(--theme-body, #64748b)' }}>
              {subtitle}
            </p>
          )}
          {renderButtonsDark()}
        </div>
        <div
          className="flex-1"
          style={
            bg
              ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { backgroundColor: 'var(--tenant-primary, #635BFF)' }
          }
        >
          {!bg && <div className="flex h-full min-h-[300px] items-center justify-center" />}
        </div>
      </section>
    );
  }

  /* ── Variant: fullscreen ── */
  if (variant === 'fullscreen') {
    return (
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32"
        style={
          bg
            ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, var(--theme-grad-from, var(--tenant-primary)) 0%, var(--theme-grad-to, #1a1a1a) 100%)' }
        }
      >
        <div className="absolute inset-0" style={{ backgroundColor: bg ? 'var(--theme-overlay, rgba(0,0,0,0.55))' : 'rgba(0,0,0,0.25)' }} />
        <div className="relative z-10 max-w-4xl text-center">
          {title && (
            <h1 className="font-noto text-5xl font-black leading-tight md:text-7xl" style={{ color: 'var(--theme-heading, #ffffff)' }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-6 text-xl md:text-2xl" style={{ color: 'var(--theme-body, rgba(255,255,255,0.7))' }}>
              {subtitle}
            </p>
          )}
          {renderButtons()}
        </div>
      </section>
    );
  }

  /* ── Variant: minimal ── */
  return (
    <section className="bg-white px-6 py-32">
      <div className="mx-auto max-w-3xl text-center">
        {title && (
          <h1 className="font-noto text-5xl font-black leading-tight md:text-7xl" style={{ color: 'var(--theme-heading, #0A2540)' }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-4 text-lg" style={{ color: 'var(--theme-body, #64748b)' }}>
            {subtitle}
          </p>
        )}
        {btn1Label && (
          <div className="mt-10">
            <a
              href={btn1Href}
              className="inline-block px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition hover:opacity-90"
              style={{ backgroundColor: 'var(--tenant-primary)', color: 'var(--theme-btn-text, #ffffff)' }}
              onClick={() => track(btn1Label, btn1Href, 'hero_primary')}
            >
              {btn1Label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
