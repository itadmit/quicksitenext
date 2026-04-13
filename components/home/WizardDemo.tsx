'use client';

import { useState, useEffect } from 'react';
import {
  Building2, Palette, LayoutTemplate, Eye, ChevronLeft, ChevronRight,
  Check, Sparkles, Globe, FileText, Mail, Menu as MenuIcon,
} from 'lucide-react';

const COLORS = [
  { name: 'כחול', value: '#635BFF' },
  { name: 'אושן', value: '#0ea5e9' },
  { name: 'ירוק', value: '#059669' },
  { name: 'סגול', value: '#7c3aed' },
  { name: 'ורוד', value: '#e11d48' },
  { name: 'זהב', value: '#a28b5d' },
];

const TEMPLATES = [
  { id: 'business', name: 'עסק', icon: Building2, pages: 3 },
  { id: 'blog', name: 'בלוג', icon: FileText, pages: 2 },
  { id: 'landing', name: 'דף נחיתה', icon: LayoutTemplate, pages: 1 },
];

const steps = [
  { label: 'שם העסק', icon: Building2 },
  { label: 'תבנית', icon: LayoutTemplate },
  { label: 'צבע', icon: Palette },
  { label: 'תצוגה מקדימה', icon: Eye },
];

export default function WizardDemo() {
  const [step, setStep] = useState(0);
  const [bizName, setBizName] = useState('');
  const [template, setTemplate] = useState('business');
  const [color, setColor] = useState('#635BFF');
  const [typingText, setTypingText] = useState('');

  const demoName = bizName || 'העסק שלי';

  useEffect(() => {
    if (step !== 0) return;
    const example = 'הסטודיו של דנה';
    let i = 0;
    const interval = setInterval(() => {
      if (i <= example.length) {
        setTypingText(example.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [step]);

  const next = () => setStep(s => Math.min(s + 1, 3));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const selectedTpl = TEMPLATES.find(t => t.id === template)!;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Step indicators */}
      <div className="mb-10 flex items-center justify-center gap-0">
        {steps.map((s, i) => {
          const done = i < step;
          const active = i === step;
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center">
              <button
                onClick={() => setStep(i)}
                className="flex flex-col items-center"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : active
                        ? 'bg-ocean text-white shadow-lg shadow-ocean/30'
                        : 'bg-white/[0.08] text-white/30'
                  }`}
                >
                  {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span
                  className={`mt-2 text-[11px] font-semibold ${
                    active ? 'text-white' : 'text-white/30'
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`mx-4 mb-5 h-[2px] w-10 rounded-full transition-colors duration-300 ${
                    done ? 'bg-emerald-500' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Content area */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
        {/* Step 0: Business name */}
        <div className={`transition-all duration-300 ${step === 0 ? 'block' : 'hidden'}`}>
          <div className="p-8 md:p-12">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-ocean/20">
                <Building2 className="h-8 w-8 text-ocean-light" />
              </div>
              <h3 className="font-noto text-2xl font-bold text-white">איך קוראים לעסק?</h3>
              <p className="mt-2 text-sm text-white/40">זה יופיע בכותרת הראשית של האתר שלכם</p>

              <div className="relative mt-8">
                <input
                  type="text"
                  value={bizName}
                  onChange={e => setBizName(e.target.value)}
                  placeholder={typingText || 'שם העסק שלכם...'}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-5 py-4 text-center text-lg font-semibold text-white placeholder-white/20 outline-none transition-all focus:border-ocean/40 focus:ring-2 focus:ring-ocean/20"
                />
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-white/25">
                <Globe className="h-3.5 w-3.5" />
                <span dir="ltr">{(bizName || 'my-site').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-א-ת]/g, '')}.quicksite.co.il</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Template */}
        <div className={`transition-all duration-300 ${step === 1 ? 'block' : 'hidden'}`}>
          <div className="p-8 md:p-12">
            <div className="mb-8 text-center">
              <h3 className="font-noto text-2xl font-bold text-white">בחרו תבנית</h3>
              <p className="mt-2 text-sm text-white/40">כל תבנית מגיעה עם עמודים, תפריט ותוכן מוכן</p>
            </div>

            <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4">
              {TEMPLATES.map(t => {
                const Icon = t.icon;
                const selected = template === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`group relative rounded-2xl border p-6 text-center transition-all duration-200 ${
                      selected
                        ? 'border-ocean bg-ocean/10'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div
                      className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
                        selected ? 'bg-ocean/20' : 'bg-white/[0.06]'
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${selected ? 'text-ocean-light' : 'text-white/40'}`} />
                    </div>
                    <p className={`font-noto text-sm font-bold ${selected ? 'text-white' : 'text-white/60'}`}>{t.name}</p>
                    <p className="mt-1 text-[11px] text-white/25">{t.pages} עמודים</p>
                    {selected && (
                      <div className="absolute -top-2 -left-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ocean text-white shadow-md">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 2: Color */}
        <div className={`transition-all duration-300 ${step === 2 ? 'block' : 'hidden'}`}>
          <div className="p-8 md:p-12">
            <div className="mb-8 text-center">
              <h3 className="font-noto text-2xl font-bold text-white">בחרו צבע ראשי</h3>
              <p className="mt-2 text-sm text-white/40">הצבע ישתקף בכפתורים, קישורים ואלמנטים באתר</p>
            </div>

            <div className="mx-auto flex max-w-sm flex-wrap justify-center gap-4">
              {COLORS.map(c => {
                const selected = color === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    className={`group flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                      selected
                        ? 'border-white/20 bg-white/[0.08]'
                        : 'border-transparent hover:bg-white/[0.04]'
                    }`}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                      style={{ backgroundColor: c.value }}
                    >
                      {selected && <Check className="h-5 w-5 text-white" />}
                    </div>
                    <span className={`text-[11px] font-medium ${selected ? 'text-white' : 'text-white/30'}`}>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3: Preview */}
        <div className={`transition-all duration-300 ${step === 3 ? 'block' : 'hidden'}`}>
          <div className="p-6 md:p-10">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="font-noto text-2xl font-bold text-white">האתר שלכם מוכן!</h3>
              <p className="mt-1 text-sm text-white/40">ככה זה ייראה — תוכלו לערוך הכל מהדשבורד</p>
            </div>

            {/* Mini site preview */}
            <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-2 flex-1 rounded-md bg-white px-3 py-1 text-center text-[10px] text-slate-400" dir="ltr">
                  {(bizName || 'my-site').toLowerCase().replace(/\s+/g, '-')}.quicksite.co.il
                </div>
              </div>

              {/* Nav */}
              <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: `2px solid ${color}10` }}>
                <span className="text-sm font-bold text-slate-800">{demoName}</span>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-slate-400">דף הבית</span>
                  <span className="text-[11px] text-slate-400">אודות</span>
                  <span className="text-[11px] text-slate-400">צור קשר</span>
                  <MenuIcon className="h-3.5 w-3.5 text-slate-300" />
                </div>
              </div>

              {/* Hero */}
              <div
                className="px-6 py-10 text-center"
                style={{ background: `linear-gradient(135deg, ${color}08, ${color}15)` }}
              >
                <h4 className="font-noto text-xl font-bold text-slate-800">ברוכים הבאים ל-{demoName}</h4>
                <p className="mx-auto mt-2 max-w-xs text-xs text-slate-500">
                  {selectedTpl.id === 'blog' ? 'מחשבות, רעיונות ותובנות' : selectedTpl.id === 'landing' ? 'הפתרון שחיכיתם לו' : 'הפתרון המושלם לעסק שלכם'}
                </p>
                <button
                  className="mt-4 rounded-full px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: color }}
                >
                  צרו קשר
                </button>
              </div>

              {/* Content blocks preview */}
              <div className="grid grid-cols-3 gap-3 px-6 py-6">
                {[
                  { icon: '⭐', title: 'מקצועיות' },
                  { icon: '⚡', title: 'מהירות' },
                  { icon: '🛡️', title: 'אמינות' },
                ].map(item => (
                  <div key={item.title} className="rounded-lg bg-slate-50 p-3 text-center">
                    <span className="text-lg">{item.icon}</span>
                    <p className="mt-1 text-[10px] font-semibold text-slate-600">{item.title}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 px-6 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-300">© {demoName}</span>
                  <div className="flex gap-3">
                    <FileText className="h-3 w-3 text-slate-300" />
                    <Mail className="h-3 w-3 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-8 py-5">
          <button
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-sm font-medium text-white/40 transition-colors hover:text-white disabled:opacity-0"
          >
            <ChevronRight className="h-4 w-4" />
            הקודם
          </button>

          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-ocean' : 'w-1.5 bg-white/15'
                }`}
              />
            ))}
          </div>

          {step < 3 ? (
            <button
              onClick={next}
              className="flex items-center gap-1.5 rounded-full bg-ocean px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean/85"
            >
              הבא
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : (
            <a
              href="/register"
              className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              <Sparkles className="h-4 w-4" />
              בנו את האתר שלכם
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
