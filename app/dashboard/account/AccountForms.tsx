'use client';

import { useActionState } from 'react';
import { updateProfileAction, changePasswordAction, type AccountActionState } from './actions';

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';
const labelCls = 'mb-1 block text-xs font-medium text-slate-500';

export default function AccountForms({ name, email }: { name: string; email: string }) {
  const [profileState, profileAction, profilePending] =
    useActionState<AccountActionState, FormData>(updateProfileAction, undefined);

  const [passwordState, passwordAction, passwordPending] =
    useActionState<AccountActionState, FormData>(changePasswordAction, undefined);

  return (
    <div className="space-y-5">
      <form action={profileAction} className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-noto text-base font-semibold text-navy">פרטים אישיים</h2>
        </div>
        <div className="space-y-4 px-6 py-5">
          {profileState?.error && <p className="text-sm text-red-600">{profileState.error}</p>}
          {profileState?.success && <p className="text-sm text-green-600">הפרופיל עודכן בהצלחה</p>}

          <label className="block">
            <span className={labelCls}>אימייל</span>
            <input value={email} disabled className={inputCls + ' bg-slate-50 text-slate-400'} />
          </label>

          <label className="block">
            <span className={labelCls}>שם</span>
            <input name="name" required defaultValue={name} className={inputCls} />
          </label>

          <button
            type="submit"
            disabled={profilePending}
            className="rounded-full bg-ocean shadow-sm px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50"
          >
            {profilePending ? 'שומר...' : 'עדכן פרופיל'}
          </button>
        </div>
      </form>

      <form action={passwordAction} className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-noto text-base font-semibold text-navy">שינוי סיסמה</h2>
        </div>
        <div className="space-y-4 px-6 py-5">
          {passwordState?.error && <p className="text-sm text-red-600">{passwordState.error}</p>}
          {passwordState?.success && <p className="text-sm text-green-600">הסיסמה שונתה בהצלחה</p>}

          <label className="block">
            <span className={labelCls}>סיסמה נוכחית</span>
            <input name="currentPassword" type="password" required className={inputCls} />
          </label>

          <label className="block">
            <span className={labelCls}>סיסמה חדשה</span>
            <input name="newPassword" type="password" required minLength={6} className={inputCls} />
          </label>

          <label className="block">
            <span className={labelCls}>אישור סיסמה חדשה</span>
            <input name="confirmPassword" type="password" required minLength={6} className={inputCls} />
          </label>

          <button
            type="submit"
            disabled={passwordPending}
            className="rounded-full bg-ocean shadow-sm px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50"
          >
            {passwordPending ? 'שומר...' : 'שנה סיסמה'}
          </button>
        </div>
      </form>
    </div>
  );
}
