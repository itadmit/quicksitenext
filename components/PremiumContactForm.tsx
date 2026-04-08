'use client';

import { useActionState } from 'react';
import { submitPremiumInquiry, type PremiumInquiryState } from '@/app/actions/premium-inquiry';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const businessTypes = [
  'עסק קטן / עצמאי',
  'חברה / סטארטאפ',
  'עורך דין / רואה חשבון',
  'קליניקה / רפואה',
  'מסעדה / קפה',
  'נדל"ן',
  'חינוך / קורסים',
  'אומנות / עיצוב',
  'אחר',
];

export default function PremiumContactForm() {
  const [state, action, pending] = useActionState<PremiumInquiryState | undefined, FormData>(
    submitPremiumInquiry,
    undefined
  );

  if (state?.success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle className="mb-4 h-12 w-12 text-emerald-500" />
        <h3 className="font-noto text-xl font-bold text-navy">הפנייה נשלחה בהצלחה!</h3>
        <p className="mt-2 text-sm text-slate-500">נחזור אליכם תוך 24 שעות עם הצעה מותאמת.</p>
      </div>
    );
  }

  const fieldErr = state?.fieldErrors;

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pf-name" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy/60">
            שם מלא
          </label>
          <input
            id="pf-name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-300 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
            placeholder="ישראל ישראלי"
          />
          {fieldErr?.name && <p className="mt-1 text-xs text-red-500">{fieldErr.name[0]}</p>}
        </div>

        <div>
          <label htmlFor="pf-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy/60">
            טלפון
          </label>
          <input
            id="pf-phone"
            name="phone"
            type="tel"
            required
            dir="ltr"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-300 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
            placeholder="050-0000000"
          />
          {fieldErr?.phone && <p className="mt-1 text-xs text-red-500">{fieldErr.phone[0]}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="pf-email" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy/60">
          אימייל
        </label>
        <input
          id="pf-email"
          name="email"
          type="email"
          required
          dir="ltr"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-300 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
          placeholder="you@example.com"
        />
        {fieldErr?.email && <p className="mt-1 text-xs text-red-500">{fieldErr.email[0]}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pf-business" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy/60">
            שם העסק
          </label>
          <input
            id="pf-business"
            name="business"
            type="text"
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-300 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
            placeholder="שם החברה / העסק"
          />
          {fieldErr?.business && <p className="mt-1 text-xs text-red-500">{fieldErr.business[0]}</p>}
        </div>

        <div>
          <label htmlFor="pf-type" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy/60">
            סוג העסק
          </label>
          <select
            id="pf-type"
            name="businessType"
            required
            className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
            defaultValue=""
          >
            <option value="" disabled>בחרו סוג עסק</option>
            {businessTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {fieldErr?.businessType && <p className="mt-1 text-xs text-red-500">{fieldErr.businessType[0]}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="pf-inspiration" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-navy/60">
          אתר השראה (אופציונלי)
        </label>
        <input
          id="pf-inspiration"
          name="inspiration"
          type="url"
          dir="ltr"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-300 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
          placeholder="https://example.com"
        />
        <p className="mt-1 text-xs text-slate-400">קישור לאתר שמעצב לכם, לסגנון שאתם אוהבים</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ocean px-8 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ocean/85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            שולח...
          </span>
        ) : (
          <>
            שלחו פנייה
            <Send className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
