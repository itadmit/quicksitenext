'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Palette, X, RotateCcw, Check, Loader2 } from 'lucide-react';
import { useEditor, DEFAULT_THEME, type ThemeColors } from './EditorContext';
import { saveThemeAction } from '@/app/dashboard/pages/[id]/visual/actions';

const COLOR_FIELDS: { key: keyof ThemeColors; label: string; group: string }[] = [
  { key: 'primary', label: 'צבע ראשי', group: 'כללי' },
  { key: 'background', label: 'צבע רקע', group: 'כללי' },
  { key: 'headingText', label: 'כותרות', group: 'טקסט' },
  { key: 'bodyText', label: 'גוף טקסט', group: 'טקסט' },
  { key: 'buttonText', label: 'טקסט כפתורים', group: 'טקסט' },
  { key: 'heroGradientFrom', label: 'גרדיאנט - התחלה', group: 'הירו' },
  { key: 'heroGradientTo', label: 'גרדיאנט - סיום', group: 'הירו' },
  { key: 'heroOverlay', label: 'שכבת כהה', group: 'הירו' },
];

const PRESET_PALETTES: { name: string; colors: Partial<ThemeColors> }[] = [
  {
    name: 'זהב קלאסי',
    colors: { primary: '#a28b5d', headingText: '#ffffff', heroGradientFrom: '#a28b5d', heroGradientTo: '#1a1a1a' },
  },
  {
    name: 'כחול מודרני',
    colors: { primary: '#635BFF', headingText: '#ffffff', heroGradientFrom: '#635BFF', heroGradientTo: '#0A2540' },
  },
  {
    name: 'ירוק טבעי',
    colors: { primary: '#059669', headingText: '#ffffff', heroGradientFrom: '#059669', heroGradientTo: '#064e3b' },
  },
  {
    name: 'אדום חם',
    colors: { primary: '#dc2626', headingText: '#ffffff', heroGradientFrom: '#dc2626', heroGradientTo: '#1a1a1a' },
  },
  {
    name: 'סגול עדין',
    colors: { primary: '#7c3aed', headingText: '#ffffff', heroGradientFrom: '#7c3aed', heroGradientTo: '#1e1b4b' },
  },
  {
    name: 'שחור מינימלי',
    colors: { primary: '#171717', headingText: '#ffffff', heroGradientFrom: '#171717', heroGradientTo: '#404040' },
  },
];

export default function ThemePalette() {
  const { theme, setTheme } = useEditor();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  const updateColor = (key: keyof ThemeColors, value: string) => {
    setTheme({ ...theme, [key]: value });
  };

  const resetTheme = () => {
    setTheme({ ...DEFAULT_THEME });
  };

  const applyPreset = (preset: Partial<ThemeColors>) => {
    setTheme({ ...theme, ...preset });
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    await saveThemeAction(JSON.stringify(theme));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [theme]);

  const groups = COLOR_FIELDS.reduce<Record<string, typeof COLOR_FIELDS>>((acc, f) => {
    (acc[f.group] ??= []).push(f);
    return acc;
  }, {});

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer ${
          open ? 'bg-slate-100 text-navy' : 'text-slate-400 hover:bg-slate-50 hover:text-navy'
        }`}
        title="פלטת צבעים"
      >
        <Palette className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-[66] mt-2 w-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/[0.06]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ocean/[0.08]">
                <Palette className="h-3.5 w-3.5 text-ocean" />
              </div>
              <span className="text-[12px] font-bold text-navy">פלטת צבעים</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetTheme}
                className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 hover:text-navy transition-colors cursor-pointer"
                title="איפוס"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 hover:text-navy transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="max-h-[420px] overflow-auto">
            {/* Preset palettes */}
            <div className="border-b border-slate-100 px-4 py-3">
              <span className="mb-2 block text-[9px] font-bold uppercase tracking-widest text-slate-400">ערכות מוכנות</span>
              <div className="grid grid-cols-3 gap-1.5">
                {PRESET_PALETTES.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p.colors)}
                    className="group flex flex-col items-center gap-1 rounded-lg border border-slate-100 p-2 transition-all hover:border-ocean/30 hover:shadow-sm cursor-pointer"
                  >
                    <div className="flex gap-0.5">
                      <div className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: p.colors.primary }} />
                      <div className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: `linear-gradient(135deg, ${p.colors.heroGradientFrom}, ${p.colors.heroGradientTo})` }} />
                    </div>
                    <span className="text-[9px] font-medium text-slate-500 group-hover:text-navy">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color pickers by group */}
            {Object.entries(groups).map(([group, fields]) => (
              <div key={group} className="border-b border-slate-50 px-4 py-3 last:border-0">
                <span className="mb-2.5 block text-[9px] font-bold uppercase tracking-widest text-slate-400">{group}</span>
                <div className="space-y-2">
                  {fields.map((field) => (
                    <ColorRow
                      key={field.key}
                      label={field.label}
                      value={theme[field.key]}
                      onChange={(v) => updateColor(field.key, v)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Hero gradient preview */}
            <div className="border-t border-slate-100 px-4 py-3">
              <span className="mb-2 block text-[9px] font-bold uppercase tracking-widest text-slate-400">תצוגה מקדימה</span>
              <div
                className="h-16 rounded-lg ring-1 ring-black/10"
                style={{ background: `linear-gradient(135deg, ${theme.heroGradientFrom} 0%, ${theme.heroGradientTo} 100%)` }}
              >
                <div className="flex h-full items-center justify-center rounded-lg" style={{ backgroundColor: theme.heroOverlay.replace(')', ', 0.5)').replace('rgb', 'rgba') }}>
                  <div className="text-center">
                    <div className="text-[11px] font-bold" style={{ color: theme.headingText }}>כותרת לדוגמה</div>
                    <div className="mt-0.5 text-[8px]" style={{ color: theme.bodyText }}>טקסט גוף לדוגמה</div>
                    <div className="mx-auto mt-1 rounded-full px-3 py-0.5 text-[7px] font-bold" style={{ backgroundColor: theme.primary, color: theme.buttonText }}>
                      כפתור
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="border-t border-slate-100 px-4 py-2.5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-ocean px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : saved ? (
                <Check className="h-3 w-3" />
              ) : (
                <Palette className="h-3 w-3" />
              )}
              {saving ? 'שומר...' : saved ? 'נשמר!' : 'שמור פלטה'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [showInput, setShowInput] = useState(false);

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <input
          type="color"
          value={value.startsWith('#') ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="h-7 w-7 rounded-lg ring-1 ring-black/10 transition-shadow hover:ring-2 hover:ring-ocean/30 cursor-pointer"
          style={{ backgroundColor: value }}
        />
      </div>
      <div className="flex flex-1 items-center justify-between">
        <span className="text-[12px] font-medium text-navy">{label}</span>
        {showInput ? (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setShowInput(false)}
            autoFocus
            dir="ltr"
            className="w-20 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-navy outline-none focus:border-ocean"
          />
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-400 hover:bg-slate-50 hover:text-navy cursor-pointer"
            dir="ltr"
          >
            {value}
          </button>
        )}
      </div>
    </div>
  );
}
