'use client';

import { useActionState } from 'react';
import { resetPasswordAction } from './actions';
import { Lock, ArrowLeft } from 'lucide-react';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="token" value={token} />

      {state?.error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-600">
          סיסמה חדשה
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="לפחות 6 תווים"
            className="w-full rounded-xl border border-[#d0d4e4] bg-white py-3 pr-4 pl-11 text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-ocean focus:outline-none focus:ring-[3px] focus:ring-ocean/10"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-[18px] w-[18px] text-slate-400" />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-600">
          אימות סיסמה
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            placeholder="הזינו שוב את הסיסמה"
            className="w-full rounded-xl border border-[#d0d4e4] bg-white py-3 pr-4 pl-11 text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-ocean focus:outline-none focus:ring-[3px] focus:ring-ocean/10"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-[18px] w-[18px] text-slate-400" />
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
              מעדכן...
            </>
          ) : (
            <>
              <ArrowLeft className="ml-2 h-[18px] w-[18px]" />
              עדכון סיסמה
            </>
          )}
        </span>
      </button>
    </form>
  );
}
