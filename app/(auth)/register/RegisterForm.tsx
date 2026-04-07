'use client';

import { useActionState } from 'react';
import { registerAction } from './actions';

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, undefined);
  const fe = state?.fieldErrors;

  return (
    <form action={formAction} className="space-y-4">
      <Field label="שם" name="name" required errors={fe?.name} />
      <Field label="אימייל" name="email" type="email" required errors={fe?.email} />
      <Field
        label="סיסמה"
        name="password"
        type="password"
        required
        errors={fe?.password}
      />
      <Field
        label="כתובת האתר (slug)"
        name="slug"
        required
        placeholder="my-site"
        hint="יהיה זמין בכתובת: my-site.platform.com"
        errors={fe?.slug}
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary py-3 text-sm font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'נרשמים...' : 'צרו חשבון'}
      </button>
    </form>
  );
}

function Field({
  label, name, type = 'text', required, placeholder, hint, errors,
}: {
  label: string; name: string; type?: string; required?: boolean;
  placeholder?: string; hint?: string; errors?: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none"
      />
      {hint && <span className="mt-1 block text-xs text-charcoal/50">{hint}</span>}
      {errors?.map((e) => (
        <span key={e} className="mt-1 block text-xs text-red-600">{e}</span>
      ))}
    </label>
  );
}
