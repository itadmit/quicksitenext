'use client';

import EditableText from '../EditableText';
import { useEditor } from '../EditorContext';
import { Camera } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
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
    return { backgroundColor: 'var(--tenant-primary)', color: 'var(--theme-btn-text)' };
  }
  return { color: 'var(--theme-btn-text)' };
}

function btnStyleDark(variant: string): React.CSSProperties {
  if (variant === 'filled' || !variant) {
    return { backgroundColor: 'var(--tenant-primary)', color: 'var(--theme-btn-text, #ffffff)' };
  }
  return { color: 'var(--theme-heading, #0A2540)' };
}

export default function EditableHeroBlock({ data, onChange }: Props) {
  const { openImagePicker } = useEditor();
  const variant = (data.variant as string) ?? 'centered';
  const title = (data.title as string) ?? '';
  const subtitle = (data.subtitle as string) ?? '';
  const bg = (data.backgroundImage as string) ?? '';
  const btn1Label = (data.primaryBtnLabel as string) ?? '';
  const btn1Variant = (data.primaryBtnVariant as string) ?? 'filled';
  const btn2Label = (data.secondaryBtnLabel as string) ?? '';
  const btn2Variant = (data.secondaryBtnVariant as string) ?? 'outline';

  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  const handleBgChange = () => {
    openImagePicker((url) => update('backgroundImage', url));
  };

  const bgButton = (
    <button
      onClick={handleBgChange}
      className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-105 cursor-pointer"
      data-no-select
    >
      <Camera className="h-3.5 w-3.5" />
      החלף רקע
    </button>
  );

  /* ── Editable buttons (light-on-dark) ── */
  const renderButtons = () => (
    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <div className={btnClasses(btn1Variant)} style={btnStyle(btn1Variant)}>
        <EditableText
          value={btn1Label}
          onChange={(v) => update('primaryBtnLabel', v)}
          tag="span"
          className=""
          placeholder="טקסט כפתור"
          style={{ color: 'inherit' }}
        />
      </div>
      {(btn2Label || true) && (
        <div className={btnClasses(btn2Variant)} style={btnStyle(btn2Variant)}>
          <EditableText
            value={btn2Label}
            onChange={(v) => update('secondaryBtnLabel', v)}
            tag="span"
            className=""
            placeholder="כפתור משני"
            style={{ color: 'inherit' }}
          />
        </div>
      )}
    </div>
  );

  /* ── Editable buttons (dark-on-light) ── */
  const renderButtonsDark = () => (
    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <div className={btnClassesDark(btn1Variant)} style={btnStyleDark(btn1Variant)}>
        <EditableText
          value={btn1Label}
          onChange={(v) => update('primaryBtnLabel', v)}
          tag="span"
          className=""
          placeholder="טקסט כפתור"
          style={{ color: 'inherit' }}
        />
      </div>
      {(btn2Label || true) && (
        <div className={btnClassesDark(btn2Variant)} style={btnStyleDark(btn2Variant)}>
          <EditableText
            value={btn2Label}
            onChange={(v) => update('secondaryBtnLabel', v)}
            tag="span"
            className=""
            placeholder="כפתור משני"
            style={{ color: 'inherit' }}
          />
        </div>
      )}
    </div>
  );

  /* ── Variant: centered (default) ── */
  if (variant === 'centered') {
    return (
      <section
        className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24"
        style={
          bg
            ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, var(--theme-grad-from) 0%, var(--theme-grad-to) 100%)' }
        }
      >
        {bg && <div className="absolute inset-0" style={{ backgroundColor: 'var(--theme-overlay)' }} />}
        {bgButton}
        <div className="relative z-10 max-w-3xl text-center">
          <EditableText
            value={title}
            onChange={(v) => update('title', v)}
            tag="h1"
            className="font-noto text-4xl font-black leading-tight md:text-6xl"
            placeholder="כותרת ראשית"
            style={{ color: 'var(--theme-heading)' }}
          />
          <EditableText
            value={subtitle}
            onChange={(v) => update('subtitle', v)}
            tag="p"
            className="mt-4 text-lg md:text-xl"
            placeholder="תת כותרת"
            style={{ color: 'var(--theme-body)' }}
          />
          {renderButtons()}
        </div>
      </section>
    );
  }

  /* ── Variant: split ── */
  if (variant === 'split') {
    return (
      <section className="relative flex min-h-[70vh] flex-col md:flex-row-reverse">
        {bgButton}
        <div className="flex flex-1 flex-col items-start justify-center px-8 py-16 md:px-16 lg:px-24">
          <EditableText
            value={title}
            onChange={(v) => update('title', v)}
            tag="h1"
            className="font-noto text-4xl font-black leading-tight md:text-5xl"
            placeholder="כותרת ראשית"
            style={{ color: 'var(--theme-heading, #0A2540)' }}
          />
          <EditableText
            value={subtitle}
            onChange={(v) => update('subtitle', v)}
            tag="p"
            className="mt-4 text-lg leading-relaxed"
            placeholder="תת כותרת"
            style={{ color: 'var(--theme-body, #64748b)' }}
          />
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
            : { background: 'linear-gradient(135deg, var(--theme-grad-from) 0%, var(--theme-grad-to) 100%)' }
        }
      >
        <div className="absolute inset-0" style={{ backgroundColor: bg ? 'var(--theme-overlay, rgba(0,0,0,0.55))' : 'rgba(0,0,0,0.25)' }} />
        {bgButton}
        <div className="relative z-10 max-w-4xl text-center">
          <EditableText
            value={title}
            onChange={(v) => update('title', v)}
            tag="h1"
            className="font-noto text-5xl font-black leading-tight md:text-7xl"
            placeholder="כותרת ראשית"
            style={{ color: 'var(--theme-heading)' }}
          />
          <EditableText
            value={subtitle}
            onChange={(v) => update('subtitle', v)}
            tag="p"
            className="mt-6 text-xl md:text-2xl"
            placeholder="תת כותרת"
            style={{ color: 'var(--theme-body)' }}
          />
          {renderButtons()}
        </div>
      </section>
    );
  }

  /* ── Variant: minimal ── */
  return (
    <section className="relative bg-white px-6 py-32">
      {bgButton}
      <div className="mx-auto max-w-3xl text-center">
        <EditableText
          value={title}
          onChange={(v) => update('title', v)}
          tag="h1"
          className="font-noto text-5xl font-black leading-tight md:text-7xl"
          placeholder="כותרת ראשית"
          style={{ color: 'var(--theme-heading, #0A2540)' }}
        />
        <EditableText
          value={subtitle}
          onChange={(v) => update('subtitle', v)}
          tag="p"
          className="mt-4 text-lg"
          placeholder="תת כותרת"
          style={{ color: 'var(--theme-body, #64748b)' }}
        />
        <div className="mt-10">
          <div
            className="inline-block px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition hover:opacity-90"
            style={{ backgroundColor: 'var(--tenant-primary)', color: 'var(--theme-btn-text, #ffffff)' }}
          >
            <EditableText
              value={btn1Label}
              onChange={(v) => update('primaryBtnLabel', v)}
              tag="span"
              className=""
              placeholder="טקסט כפתור"
              style={{ color: 'inherit' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
