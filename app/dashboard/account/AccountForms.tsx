'use client';

import { useActionState } from 'react';
import { updateProfileAction, changePasswordAction, type AccountActionState } from './actions';

const inputCls = 'w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none';
const labelCls = 'mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60';

export default function AccountForms({ name, email }: { name: string; email: string }) {
  const [profileState, profileAction, profilePending] =
    useActionState<AccountActionState, FormData>(updateProfileAction, undefined);

  const [passwordState, passwordAction, passwordPending] =
    useActionState<AccountActionState, FormData>(changePasswordAction, undefined);

  return (
    <div className="space-y-6 max-w-xl">
      <form action={profileAction} className="border border-charcoal/10 bg-white p-6 space-y-4">
        <h2 className="font-noto text-lg font-bold text-charcoal">פרטים אישיים</h2>

        {profileState?.error && <p className="text-sm text-red-600">{profileState.error}</p>}
        {profileState?.success && <p className="text-sm text-green-600">הפרופיל עודכן בהצלחה</p>}

        <label className="block">
          <span className={labelCls}>אימייל</span>
          <input value={email} disabled className={inputCls + ' bg-charcoal/5 text-charcoal/50'} />
        </label>

        <label className="block">
          <span className={labelCls}>שם</span>
          <input name="name" required defaultValue={name} className={inputCls} />
        </label>

        <button
          type="submit"
          disabled={profilePending}
          className="bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
        >
          {profilePending ? 'שומר...' : 'עדכן פרופיל'}
        </button>
      </form>

      <form action={passwordAction} className="border border-charcoal/10 bg-white p-6 space-y-4">
        <h2 className="font-noto text-lg font-bold text-charcoal">שינוי סיסמה</h2>

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
          className="bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
        >
          {passwordPending ? 'שומר...' : 'שנה סיסמה'}
        </button>
      </form>
    </div>
  );
}
