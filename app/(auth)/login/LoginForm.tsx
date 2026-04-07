'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">
          אימייל
        </span>
        <input
          name="email"
          type="email"
          required
          className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">
          סיסמה
        </span>
        <input
          name="password"
          type="password"
          required
          className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none"
        />
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary py-3 text-sm font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'מתחברים...' : 'כניסה'}
      </button>
    </form>
  );
}
