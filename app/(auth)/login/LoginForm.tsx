'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      {/* Email */}
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
            placeholder="הזן אימייל"
            className="w-full rounded-xl border border-[#d0d4e4] bg-white py-3 pr-4 pl-11 text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-ocean focus:outline-none focus:ring-[3px] focus:ring-ocean/10"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-[18px] w-[18px] text-slate-400" />
          </div>
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-600">
          סיסמה
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="הזן סיסמה"
            className="w-full rounded-xl border border-[#d0d4e4] bg-white py-3 pr-4 pl-11 text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-ocean focus:outline-none focus:ring-[3px] focus:ring-ocean/10"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-[18px] w-[18px] text-slate-400" />
          </div>
        </div>
      </div>

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between">
        <label className="group flex cursor-pointer items-center">
          <input type="checkbox" className="peer sr-only" />
          <div className="h-5 w-5 rounded border-2 border-slate-300 bg-white transition-colors duration-200 group-hover:border-ocean peer-checked:border-ocean peer-checked:bg-ocean" />
          <span className="mr-3 text-sm text-slate-600 transition-colors duration-200 group-hover:text-slate-800">
            זכור אותי
          </span>
        </label>
        <a href="/forgot-password" className="text-sm text-ocean transition-colors duration-200 hover:text-ocean/80 cursor-pointer">
          שכחת סיסמה?
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-ocean py-3 px-4 font-semibold text-white shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] transition-all duration-200 hover:bg-ocean/90 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-ocean/20 disabled:opacity-50 cursor-pointer"
      >
        <span className="flex items-center justify-center">
          {pending ? (
            <>
              <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              מתחברים...
            </>
          ) : (
            <>
              <LogIn className="ml-2 h-[18px] w-[18px]" />
              התחבר
            </>
          )}
        </span>
      </button>
    </form>
  );
}
