'use client';

import { Type, MousePointer, Camera, ChevronDown, AlignCenter, Columns, Maximize } from 'lucide-react';
import ImagePickerField from './ImagePickerField';
import LinkPicker from './LinkPicker';
import VariantPicker from './VariantPicker';

const HERO_VARIANTS = [
  { id: 'centered', label: 'ממורכז', Icon: AlignCenter },
  { id: 'split', label: 'מפוצל', Icon: Columns },
  { id: 'fullscreen', label: 'מסך מלא', Icon: Maximize },
  { id: 'minimal', label: 'מינימלי', Icon: Type },
];

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const BTN_VARIANTS = [
  { value: 'filled', label: 'צבע מלא' },
  { value: 'outline', label: 'מתאר' },
  { value: 'underline', label: 'קו תחתון' },
];

const input = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-slate-300 outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/30 transition-colors';

export default function HeroBlockEditor({ data, onChange }: Props) {
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <VariantPicker
        options={HERO_VARIANTS}
        value={(data.variant as string) ?? 'centered'}
        onChange={(v) => update('variant', v)}
      />

      <Section icon={<Type className="h-3 w-3" />} title="תוכן">
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">כותרת</label>
          <input value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={input} />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">תת כותרת</label>
          <input value={(data.subtitle as string) ?? ''} onChange={(e) => update('subtitle', e.target.value)} className={input} />
        </div>
      </Section>

      <Section icon={<Camera className="h-3 w-3" />} title="רקע">
        <ImagePickerField
          value={(data.backgroundImage as string) ?? ''}
          onChange={(url) => update('backgroundImage', url)}
          label="תמונת רקע"
          previewHeight="h-28"
        />
      </Section>

      <Section icon={<MousePointer className="h-3 w-3" />} title="כפתורים">
        <BtnEditor
          labelText="כפתור ראשי"
          nameValue={(data.primaryBtnLabel as string) ?? ''}
          hrefValue={(data.primaryBtnHref as string) ?? ''}
          variantValue={(data.primaryBtnVariant as string) ?? 'filled'}
          onNameChange={(v) => update('primaryBtnLabel', v)}
          onHrefChange={(v) => update('primaryBtnHref', v)}
          onVariantChange={(v) => update('primaryBtnVariant', v)}
        />
        <div className="border-t border-slate-100" />
        <BtnEditor
          labelText="כפתור משני"
          nameValue={(data.secondaryBtnLabel as string) ?? ''}
          hrefValue={(data.secondaryBtnHref as string) ?? ''}
          variantValue={(data.secondaryBtnVariant as string) ?? 'outline'}
          onNameChange={(v) => update('secondaryBtnLabel', v)}
          onHrefChange={(v) => update('secondaryBtnHref', v)}
          onVariantChange={(v) => update('secondaryBtnVariant', v)}
        />
      </Section>
    </div>
  );
}

function BtnEditor({
  labelText,
  nameValue,
  hrefValue,
  variantValue,
  onNameChange,
  onHrefChange,
  onVariantChange,
}: {
  labelText: string;
  nameValue: string;
  hrefValue: string;
  variantValue: string;
  onNameChange: (v: string) => void;
  onHrefChange: (v: string) => void;
  onVariantChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2.5">
      <span className="text-[10px] font-bold text-navy/80">{labelText}</span>
      <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-navy/60">טקסט</label>
        <input value={nameValue} onChange={(e) => onNameChange(e.target.value)} className={input} placeholder="טקסט כפתור" />
      </div>
      <LinkPicker value={hrefValue} onChange={onHrefChange} />
      <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-navy/60">סגנון</label>
        <div className="relative">
          <select
            value={variantValue}
            onChange={(e) => onVariantChange(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-ocean focus:ring-1 focus:ring-ocean/30"
          >
            {BTN_VARIANTS.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-1.5">
        <span className="text-slate-400">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">{title}</span>
      </div>
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-3">
        {children}
      </div>
    </div>
  );
}
