'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Building2, Palette, Sparkles, Check, ChevronLeft, ChevronRight,
  Globe, FileText, Mail, Menu as MenuIcon, Eye,
} from 'lucide-react';
import { completeOnboardingAction } from './actions';

const COLORS = [
  { name: 'כחול', value: '#635BFF' },
  { name: 'אושן', value: '#0ea5e9' },
  { name: 'ירוק', value: '#059669' },
  { name: 'סגול', value: '#7c3aed' },
  { name: 'ורוד', value: '#e11d48' },
  { name: 'זהב', value: '#a28b5d' },
  { name: 'כתום', value: '#ea580c' },
  { name: 'כחול כהה', value: '#0A2540' },
];

const steps = [
  { label: 'שם', icon: Building2 },
  { label: 'צבע', icon: Palette },
  { label: 'תצוגה', icon: Eye },
];

type Props = {
  initialName: string;
  initialColor: string;
  initialTagline: string;
  slug: string;
};

export default function OnboardingWizard({ initialName, initialColor, initialTagline, slug }: Props) {
  const [step, setStep] = useState(0);
  const [siteName, setSiteName] = useState(initialName);
  const [color, setColor] = useState(initialColor || '#635BFF');
  const [tagline, setTagline] = useState(initialTagline);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const displayName = siteName || 'האתר שלי';

  const next = () => {
    if (step === 0 && !siteName.trim()) {
      setError('הזינו שם לאתר');
      return;
    }
    setError('');
    setStep(s => Math.min(s + 1, 2));
  };
  const prev = () => { setError(''); setStep(s => Math.max(s - 1, 0)); };

  function finish() {
    startTransition(async () => {
      const result = await completeOnboardingAction({
        siteName: siteName.trim(),
        primaryColor: color,
        tagline: tagline.trim(),
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-12">
      {/* Logo */}
      <Link href="/" className="mb-10 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean">
          <span className="font-logo text-base font-bold leading-none text-white">Q</span>
        </div>
        <span className="font-logo text-xl font-bold text-navy" style={{ letterSpacing: '-0.02em' }}>
          Quick<span className="text-ocean">Site</span>
        </span>
      </Link>

      <div className="w-full max-w-2xl">
        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-center gap-0">
          {steps.map((s, i) => {
            const done = i < step;
            const active = i === step;
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                      done
                        ? 'bg-emerald-500 text-white'
                        : active
                          ? 'bg-ocean text-white shadow-lg shadow-ocean/30'
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={`mt-2 text-[11px] font-semibold ${active ? 'text-navy' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`mx-4 mb-5 h-[2px] w-12 rounded-full transition-colors duration-300 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          {error && (
            <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-600">{error}</div>
          )}

          {/* Step 0: Site name + tagline */}
          <div className={`transition-all duration-300 ${step === 0 ? 'block' : 'hidden'}`}>
            <div className="p-8 md:p-12">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean/10">
                  <Building2 className="h-7 w-7 text-ocean" />
                </div>
                <h2 className="font-noto text-2xl font-bold text-navy">איך קוראים לאתר?</h2>
                <p className="mt-2 text-sm text-slate-400">הכותרת הראשית שתופיע באתר שלכם</p>

                <div className="mt-8 space-y-4 text-right">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-400">שם האתר</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={e => setSiteName(e.target.value)}
                      placeholder="למשל: הסטודיו של דנה"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-navy outline-none transition-all focus:border-ocean focus:ring-2 focus:ring-ocean/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-400">תיאור קצר (אופציונלי)</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={e => setTagline(e.target.value)}
                      placeholder="למשל: עיצוב גרפי ומיתוג"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-navy outline-none transition-all focus:border-ocean focus:ring-2 focus:ring-ocean/10"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-slate-300">
                  <Globe className="h-3.5 w-3.5" />
                  <span dir="ltr">{slug}.quicksite.co.il</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Color */}
          <div className={`transition-all duration-300 ${step === 1 ? 'block' : 'hidden'}`}>
            <div className="p-8 md:p-12">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean/10">
                  <Palette className="h-7 w-7 text-ocean" />
                </div>
                <h2 className="font-noto text-2xl font-bold text-navy">בחרו צבע ראשי</h2>
                <p className="mt-2 text-sm text-slate-400">ישתקף בכפתורים, קישורים ואלמנטים באתר</p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  {COLORS.map(c => {
                    const selected = color === c.value;
                    return (
                      <button
                        key={c.value}
                        onClick={() => setColor(c.value)}
                        className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                          selected ? 'border-slate-300 bg-slate-50' : 'border-transparent hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110"
                          style={{ backgroundColor: c.value }}
                        >
                          {selected && <Check className="h-5 w-5 text-white" />}
                        </div>
                        <span className={`text-[10px] font-medium ${selected ? 'text-navy' : 'text-slate-400'}`}>{c.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Live preview strip */}
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button className="rounded-full px-4 py-2 text-xs font-semibold text-white" style={{ backgroundColor: color }}>כפתור ראשי</button>
                  <button className="rounded-full border-2 px-4 py-2 text-xs font-semibold" style={{ borderColor: color, color }}>כפתור משני</button>
                  <span className="text-sm font-semibold" style={{ color }}>קישור</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Preview + finish */}
          <div className={`transition-all duration-300 ${step === 2 ? 'block' : 'hidden'}`}>
            <div className="p-6 md:p-10">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                </div>
                <h2 className="font-noto text-2xl font-bold text-navy">נראה מעולה!</h2>
                <p className="mt-1 text-sm text-slate-400">ככה ייראה האתר שלכם — לחצו &quot;סיום&quot; כדי להמשיך לדשבורד</p>
              </div>

              {/* Mini preview */}
              <div className="mx-auto max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="mx-2 flex-1 rounded-md bg-white px-3 py-1 text-center text-[10px] text-slate-400" dir="ltr">
                    {slug}.quicksite.co.il
                  </div>
                </div>

                <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `2px solid ${color}15` }}>
                  <span className="text-sm font-bold text-slate-800">{displayName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">דף הבית</span>
                    <span className="text-[11px] text-slate-400">אודות</span>
                    <span className="text-[11px] text-slate-400">צור קשר</span>
                    <MenuIcon className="h-3.5 w-3.5 text-slate-300" />
                  </div>
                </div>

                <div className="px-5 py-8 text-center" style={{ background: `linear-gradient(135deg, ${color}06, ${color}12)` }}>
                  <h4 className="font-noto text-lg font-bold text-slate-800">ברוכים הבאים ל-{displayName}</h4>
                  {tagline && <p className="mt-1 text-xs text-slate-500">{tagline}</p>}
                  <button className="mt-4 rounded-full px-5 py-2 text-xs font-semibold text-white" style={{ backgroundColor: color }}>צרו קשר</button>
                </div>

                <div className="grid grid-cols-3 gap-3 px-5 py-5">
                  {['⭐ מקצועיות', '⚡ מהירות', '🛡️ אמינות'].map(t => (
                    <div key={t} className="rounded-lg bg-slate-50 p-2.5 text-center text-[10px] font-semibold text-slate-600">{t}</div>
                  ))}
                </div>

                <div className="border-t border-slate-100 px-5 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-300">© {displayName}</span>
                    <div className="flex gap-2">
                      <FileText className="h-3 w-3 text-slate-300" />
                      <Mail className="h-3 w-3 text-slate-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-slate-100 px-8 py-5">
            <button
              onClick={prev}
              disabled={step === 0}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-navy disabled:opacity-0"
            >
              <ChevronRight className="h-4 w-4" />
              הקודם
            </button>

            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? 'w-6 bg-ocean' : 'w-1.5 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {step < 2 ? (
              <button
                onClick={next}
                className="flex items-center gap-1.5 rounded-full bg-ocean px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean/85"
              >
                הבא
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={finish}
                disabled={isPending}
                className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    שומר...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    סיום — לדשבורד
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Skip link */}
        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-sm text-slate-400 transition-colors hover:text-ocean">
            דלגו, אגדיר אחר כך →
          </Link>
        </div>
      </div>
    </div>
  );
}
