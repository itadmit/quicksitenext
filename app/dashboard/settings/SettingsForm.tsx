'use client';

import { useActionState } from 'react';
import { updateSettingsAction, type SettingsActionState } from './actions';

type Settings = {
  siteName: string; tagline: string; logoUrl: string | null; faviconUrl: string | null;
  primaryColor: string; footerText: string; socialLinks: string; customCss: string;
  analyticsId: string; defaultSeoTitle: string; defaultSeoDesc: string;
};

const inputCls = 'w-full border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none';
const labelCls = 'mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60';

export default function SettingsForm({ settings }: { settings: Settings | null }) {
  const [state, formAction, pending] = useActionState<SettingsActionState, FormData>(updateSettingsAction, undefined);

  const s = settings ?? {
    siteName: '', tagline: '', logoUrl: '', faviconUrl: '',
    primaryColor: '#a28b5d', footerText: '', socialLinks: '[]',
    customCss: '', analyticsId: '', defaultSeoTitle: '', defaultSeoDesc: '',
  };

  return (
    <form action={formAction} className="border border-charcoal/10 bg-white p-6 space-y-5 max-w-3xl">
      {state?.error && <p className="text-sm text-red-600 bg-red-50 p-3 border border-red-200">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600 bg-green-50 p-3 border border-green-200">ההגדרות נשמרו בהצלחה</p>}

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className={labelCls}>שם האתר</span>
          <input name="siteName" defaultValue={s.siteName} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>תיאור קצר (Tagline)</span>
          <input name="tagline" defaultValue={s.tagline} className={inputCls} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className={labelCls}>לוגו (URL)</span>
          <input name="logoUrl" defaultValue={s.logoUrl ?? ''} dir="ltr" className={inputCls + ' font-mono text-sm'} />
        </label>
        <label className="block">
          <span className={labelCls}>Favicon (URL)</span>
          <input name="faviconUrl" defaultValue={s.faviconUrl ?? ''} dir="ltr" className={inputCls + ' font-mono text-sm'} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className={labelCls}>צבע ראשי</span>
          <div className="flex items-center gap-2">
            <input name="primaryColor" defaultValue={s.primaryColor} dir="ltr" className={inputCls + ' font-mono text-sm'} />
          </div>
        </label>
        <label className="block">
          <span className={labelCls}>Analytics ID</span>
          <input name="analyticsId" defaultValue={s.analyticsId} dir="ltr" className={inputCls + ' font-mono text-sm'} />
        </label>
      </div>

      <label className="block">
        <span className={labelCls}>טקסט פוטר</span>
        <input name="footerText" defaultValue={s.footerText} className={inputCls} />
      </label>

      <label className="block">
        <span className={labelCls}>קישורים חברתיים (JSON)</span>
        <textarea name="socialLinks" rows={3} defaultValue={s.socialLinks} dir="ltr" className={inputCls + ' font-mono text-sm resize-y'} />
      </label>

      <label className="block">
        <span className={labelCls}>CSS מותאם</span>
        <textarea name="customCss" rows={5} defaultValue={s.customCss} dir="ltr" className={inputCls + ' font-mono text-sm resize-y'} />
      </label>

      <div className="border-t border-charcoal/10 pt-5">
        <h3 className="font-noto text-sm font-bold text-charcoal/70 mb-4">SEO ברירת מחדל</h3>
        <div className="space-y-4">
          <label className="block">
            <span className={labelCls}>כותרת SEO</span>
            <input name="defaultSeoTitle" defaultValue={s.defaultSeoTitle} className={inputCls} />
          </label>
          <label className="block">
            <span className={labelCls}>תיאור SEO</span>
            <textarea name="defaultSeoDesc" rows={2} defaultValue={s.defaultSeoDesc} className={inputCls + ' resize-y'} />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'שומר...' : 'שמור הגדרות'}
      </button>
    </form>
  );
}
