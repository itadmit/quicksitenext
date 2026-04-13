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

function btnStyle(variant: string): React.CSSProperties {
  if (variant === 'filled' || !variant) {
    return { backgroundColor: 'var(--tenant-primary)', color: 'var(--theme-btn-text)' };
  }
  return { color: 'var(--theme-btn-text)' };
}

export default function EditableHeroBlock({ data, onChange }: Props) {
  const { openImagePicker } = useEditor();
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

      <button
        onClick={handleBgChange}
        className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-105 cursor-pointer"
        data-no-select
      >
        <Camera className="h-3.5 w-3.5" />
        החלף רקע
      </button>

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
        {(btn1Label || btn2Label || true) && (
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
        )}
      </div>
    </section>
  );
}
