'use client';

import { useActionState } from 'react';
import { forgotPasswordAction } from './actions';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, undefined);

  if (state?.success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle className="h-7 w-7 text-emerald-500" />
        </div>
        <h3 className="font-noto text-lg font-bold text-slate-800">נשלח בהצלחה</h3>
        <p className="mt-2 text-sm text-slate-500">
          אם קיים חשבון עם האימייל שהזנתם, תקבלו הודעה עם קישור לאיפוס הסיסמה.
        </p>
        <a
          href="/login"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ocean transition-colors hover:text-ocean/80 cursor-pointer"
        >
          <ArrowRight className="h-4 w-4" />
          חזרה להתחברות
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-600">
          אימייל
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            required
            dir="ltr"
            placeholder="הזן את האימייל שלך"
            className="w-full rounded-xl border border-[#d0d4e4] bg-white py-3 pr-4 pl-11 text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-ocean focus:outline-none focus:ring-[3px] focus:ring-ocean/10"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-[18px] w-[18px] text-slate-400" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-ocean py-3 px-4 font-semibold text-white shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] transition-all duration-200 hover:bg-ocean/90 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-ocean/20 disabled:opacity-50 cursor-pointer"
      >
        <span className="flex items-center justify-center">
          {pending ? (
            <>
              <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              שולח...
            </>
          ) : (
            <>
              <ArrowLeft className="ml-2 h-[18px] w-[18px]" />
              שלחו קישור איפוס
            </>
          )}
        </span>
      </button>
    </form>
  );
}
