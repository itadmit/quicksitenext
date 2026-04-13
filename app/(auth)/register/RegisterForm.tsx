'use client';

import { useActionState, useState, useCallback, useEffect, useTransition, useRef } from 'react';
import { registerAction } from './actions';
import { checkSlugAction } from './check-slug';
import { templates } from '@/lib/templates';
import { User, Palette, Rocket, Check, CheckCircle, XCircle, ArrowLeft, FileText } from 'lucide-react';
import TemplatePreview from '@/app/dashboard/templates/TemplatePreview';

type RegisterState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

const STEPS = [
  { label: 'פרטים', Icon: User },
  { label: 'תבנית', Icon: Palette },
  { label: 'יצירה', Icon: Rocket },
];

export default function RegisterForm() {
  const [step, setStep] = useState(0);
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(registerAction, undefined);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slug, setSlug] = useState('');
  const [templateId, setTemplateId] = useState('business');

  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [, startSlugCheck] = useTransition();
  const slugTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});

  const onSlugChange = useCallback((val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(clean);
    setSlugStatus('idle');

    if (slugTimer.current) clearTimeout(slugTimer.current);
    if (clean.length < 2) return;

    slugTimer.current = setTimeout(() => {
      setSlugStatus('checking');
      startSlugCheck(async () => {
        const result = await checkSlugAction(clean);
        setSlugStatus(result.available ? 'available' : 'taken');
      });
    }, 400);
  }, []);

  function validateStep1(): boolean {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'שם נדרש';
    if (!email.trim()) errors.email = 'אימייל נדרש';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'אימייל לא תקין';
    if (password.length < 6) errors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    if (slug.length < 2) errors.slug = 'לפחות 2 תווים';
    if (slugStatus === 'taken') errors.slug = 'כתובת תפוסה';
    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  }

  function goToStep2() {
    if (validateStep1()) setStep(1);
  }

  function goToStep3() {
    setStep(2);
    const fd = new FormData();
    fd.set('name', name);
    fd.set('email', email);
    fd.set('password', password);
    fd.set('slug', slug);
    fd.set('templateId', templateId);
    formAction(fd);
  }

  useEffect(() => {
    if (state?.error || state?.fieldErrors) {
      setStep(0);
    }
  }, [state]);

  return (
    <div className="w-full">
      {/* Progress */}
      <div className="mb-10 flex items-center justify-center gap-0">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                  done ? 'bg-emerald-500 text-white' : active ? 'bg-ocean text-white shadow-[0_4px_20px_0_rgba(99,91,255,0.25)]' : 'bg-slate-100 text-slate-400'
                }`}>
                  {done ? (
                    <Check className="h-[18px] w-[18px]" />
                  ) : (
                    <s.Icon className="h-[18px] w-[18px]" />
                  )}
                </div>
                <span className={`mt-2 text-[11px] font-semibold ${active ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-3 mb-5 h-[2px] w-12 rounded-full transition-colors duration-300 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Details */}
      <div className={`transition-all duration-300 ${step === 0 ? 'block' : 'hidden'}`}>
        <div className="mb-6 text-center">
          <h2 className="font-noto text-xl font-bold text-slate-800">יצירת חשבון</h2>
          <p className="mt-1 text-sm text-slate-500">מלאו את הפרטים כדי להתחיל</p>
        </div>

        {state?.error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>}

        <div className="space-y-5">
          <Field label="שם" value={name} onChange={setName} error={step1Errors.name || state?.fieldErrors?.name?.[0]} />
          <Field label="אימייל" value={email} onChange={setEmail} type="email" error={step1Errors.email || state?.fieldErrors?.email?.[0]} />
          <Field label="סיסמה" value={password} onChange={setPassword} type="password" error={step1Errors.password || state?.fieldErrors?.password?.[0]} />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">כתובת האתר</label>
            <div className="relative">
              <input
                value={slug}
                onChange={e => onSlugChange(e.target.value)}
                placeholder="my-site"
                dir="ltr"
                className="w-full rounded-xl border border-[#d0d4e4] bg-white px-4 py-3 pl-10 text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-ocean focus:outline-none focus:ring-[3px] focus:ring-ocean/10"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {slugStatus === 'checking' && <span className="block h-4 w-4 animate-spin rounded-full border-2 border-ocean/30 border-t-ocean" />}
                {slugStatus === 'available' && <CheckCircle className="h-[18px] w-[18px] text-emerald-500" />}
                {slugStatus === 'taken' && <XCircle className="h-[18px] w-[18px] text-red-500" />}
              </div>
            </div>
            <span className="mt-1.5 block text-[11px] text-slate-400" dir="ltr">{slug || 'my-site'}.quicksite.co.il</span>
            {step1Errors.slug && <span className="mt-1 block text-xs text-red-600">{step1Errors.slug}</span>}
            {state?.fieldErrors?.slug?.[0] && <span className="mt-1 block text-xs text-red-600">{state.fieldErrors.slug[0]}</span>}
          </div>
        </div>

        <button
          type="button"
          onClick={goToStep2}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ocean py-3 px-4 font-semibold text-white shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] transition-all duration-200 hover:bg-ocean/90 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-ocean/20 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          המשך לבחירת תבנית
        </button>
      </div>

      {/* Step 2: Template Selection */}
      <div className={`transition-all duration-300 ${step === 1 ? 'block' : 'hidden'}`}>
        <div className="mb-6 text-center">
          <h2 className="font-noto text-xl font-bold text-slate-800">בחרו תבנית</h2>
          <p className="mt-1 text-sm text-slate-500">בחרו את העיצוב שמתאים לכם, תמיד אפשר לשנות אחר כך</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map(t => {
            const selected = templateId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-white text-right transition-all duration-200 ${
                  selected
                    ? 'border-ocean shadow-[0_4px_20px_0_rgba(99,91,255,0.12)]'
                    : 'border-[#d0d4e4] hover:border-slate-300 hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.05)]'
                }`}
              >
                <div className="transition-transform duration-200 group-hover:scale-[1.02]">
                  <TemplatePreview template={t} />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-noto text-sm font-bold text-slate-800">{t.name}</h3>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                      selected ? 'border-ocean bg-ocean' : 'border-slate-300'
                    }`}>
                      {selected && <Check className="h-3 w-3 text-white" />}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{t.description}</p>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                    <FileText className="h-3.5 w-3.5" />
                    {t.pages.length} {t.pages.length === 1 ? 'עמוד' : 'עמודים'}
                  </div>
                </div>

                {selected && (
                  <div className="absolute left-2 top-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ocean text-white shadow-md">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => setStep(0)}
            className="rounded-xl border border-[#d0d4e4] bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-ocean cursor-pointer"
          >
            חזרה
          </button>
          <button
            type="button"
            onClick={goToStep3}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ocean py-3 px-4 font-semibold text-white shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] transition-all duration-200 hover:bg-ocean/90 hover:scale-[1.02] cursor-pointer"
          >
            <Rocket className="h-4 w-4" />
            צרו לי את האתר
          </button>
        </div>
      </div>

      {/* Step 3: Creating */}
      <div className={`transition-all duration-300 ${step === 2 ? 'block' : 'hidden'}`}>
        <div className="flex flex-col items-center py-12 text-center">
          <div className="relative mb-6">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-100 border-t-ocean" />
            <Rocket className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-ocean" />
          </div>
          <h2 className="font-noto text-xl font-bold text-slate-800">מכינים את האתר שלכם...</h2>
          <p className="mt-2 text-sm text-slate-500">יצירת דפים, תפריטים והגדרות — רק עוד רגע</p>
          <div className="mt-6 flex items-center gap-2 text-[12px] text-slate-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ocean" />
            <span>יוצר חשבון ומגדיר את האתר</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', error }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        type={type}
        dir={type === 'email' ? 'ltr' : undefined}
        className="w-full rounded-xl border border-[#d0d4e4] bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-ocean focus:outline-none focus:ring-[3px] focus:ring-ocean/10"
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </div>
  );
}
