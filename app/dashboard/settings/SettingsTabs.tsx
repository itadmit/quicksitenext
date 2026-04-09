'use client';

import { useState, useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateSettingsAction, type SettingsActionState } from './actions';
import { addRedirectAction, deleteRedirectAction, type RedirectActionState } from './redirect-actions';
import { applyTemplateAction } from './template-actions';
import { templates } from '@/lib/templates';
import { DataTable, DataTableRow, DataTableCell } from '@/components/dashboard/DataTable';

type Settings = {
  siteName: string; tagline: string; logoUrl: string | null; faviconUrl: string | null;
  primaryColor: string; footerText: string; socialLinks: string; customCss: string;
  analyticsId: string; defaultSeoTitle: string; defaultSeoDesc: string;
};

type RedirectItem = { id: string; fromPath: string; toPath: string; type: number };

const tabs = [
  { id: 'general', label: 'כללי', icon: 'tune' },
  { id: 'template', label: 'תבנית', icon: 'palette' },
  { id: 'seo', label: 'SEO', icon: 'search' },
  { id: 'code', label: 'קוד מותאם', icon: 'code' },
  { id: 'social', label: 'שיתופי', icon: 'share' },
  { id: 'redirects', label: 'הפניות URL', icon: 'alt_route' },
];

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';
const labelCls = 'mb-1 block text-xs font-medium text-slate-500';
const btnCls = 'rounded-full bg-ocean shadow-sm px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50';

export default function SettingsTabs({ settings, redirects }: { settings: Settings | null; redirects: RedirectItem[] }) {
  const [activeTab, setActiveTab] = useState('general');
  const [state, formAction, pending] = useActionState<SettingsActionState, FormData>(updateSettingsAction, undefined);
  const s = settings ?? {
    siteName: '', tagline: '', logoUrl: '', faviconUrl: '',
    primaryColor: '#a28b5d', footerText: '', socialLinks: '[]',
    customCss: '', analyticsId: '', defaultSeoTitle: '', defaultSeoDesc: '',
  };

  return (
    <div>
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-1.5">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-ocean/[0.08] text-ocean' : 'text-slate-500 hover:text-navy'}`}
          >
            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {state?.error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">ההגדרות נשמרו בהצלחה</p>}

      <form action={formAction} className="space-y-5">
        {/* General Tab */}
        <div className={activeTab === 'general' ? '' : 'hidden'}>
          <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-noto text-base font-semibold text-navy">הגדרות כלליות</h2>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div className="grid grid-cols-2 gap-4">
                <label className="block"><span className={labelCls}>שם האתר</span><input name="siteName" defaultValue={s.siteName} className={inputCls} /></label>
                <label className="block"><span className={labelCls}>תיאור קצר (Tagline)</span><input name="tagline" defaultValue={s.tagline} className={inputCls} /></label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block"><span className={labelCls}>לוגו (URL)</span><input name="logoUrl" defaultValue={s.logoUrl ?? ''} dir="ltr" className={inputCls + ' font-mono'} /></label>
                <label className="block"><span className={labelCls}>Favicon (URL)</span><input name="faviconUrl" defaultValue={s.faviconUrl ?? ''} dir="ltr" className={inputCls + ' font-mono'} /></label>
              </div>
              <label className="block"><span className={labelCls}>צבע ראשי</span><input name="primaryColor" defaultValue={s.primaryColor} dir="ltr" className={inputCls + ' font-mono'} /></label>
            </div>
          </div>
        </div>

        {/* SEO Tab */}
        <div className={activeTab === 'seo' ? '' : 'hidden'}>
          <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-noto text-base font-semibold text-navy">SEO ברירת מחדל</h2>
            </div>
            <div className="space-y-4 px-6 py-5">
              <label className="block"><span className={labelCls}>כותרת SEO</span><input name="defaultSeoTitle" defaultValue={s.defaultSeoTitle} className={inputCls} /></label>
              <label className="block"><span className={labelCls}>תיאור SEO</span><textarea name="defaultSeoDesc" rows={3} defaultValue={s.defaultSeoDesc} className={inputCls + ' resize-y'} /></label>
            </div>
          </div>
        </div>

        {/* Code Tab */}
        <div className={activeTab === 'code' ? '' : 'hidden'}>
          <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-noto text-base font-semibold text-navy">קוד מותאם</h2>
            </div>
            <div className="space-y-4 px-6 py-5">
              <label className="block"><span className={labelCls}>Analytics ID</span><input name="analyticsId" defaultValue={s.analyticsId} dir="ltr" className={inputCls + ' font-mono'} /></label>
              <label className="block"><span className={labelCls}>CSS מותאם</span><textarea name="customCss" rows={6} defaultValue={s.customCss} dir="ltr" className={inputCls + ' font-mono resize-y'} /></label>
            </div>
          </div>
        </div>

        {/* Social Tab */}
        <div className={activeTab === 'social' ? '' : 'hidden'}>
          <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-noto text-base font-semibold text-navy">שיתופי</h2>
            </div>
            <div className="space-y-4 px-6 py-5">
              <label className="block"><span className={labelCls}>טקסט פוטר</span><input name="footerText" defaultValue={s.footerText} className={inputCls} /></label>
              <label className="block"><span className={labelCls}>קישורים חברתיים (JSON)</span><textarea name="socialLinks" rows={4} defaultValue={s.socialLinks} dir="ltr" className={inputCls + ' font-mono resize-y'} /></label>
            </div>
          </div>
        </div>

        {activeTab !== 'redirects' && activeTab !== 'template' && (
          <button type="submit" disabled={pending} className={btnCls}>
            {pending ? 'שומר...' : 'שמור הגדרות'}
          </button>
        )}
      </form>

      {/* Template Tab */}
      {activeTab === 'template' && (
        <TemplateSection />
      )}

      {/* Redirects Tab */}
      {activeTab === 'redirects' && (
        <RedirectsSection redirects={redirects} />
      )}
    </div>
  );
}

function TemplateSection() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [applying, startApply] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: boolean } | null>(null);

  function handleApply() {
    if (!selected) return;
    const t = templates.find(tpl => tpl.id === selected);
    if (!confirm(`להחליף לתבנית "${t?.name}"?\n\nשימו לב: כל העמודים והתפריטים הקיימים יוחלפו בתוכן התבנית.`)) return;

    setResult(null);
    startApply(async () => {
      const res = await applyTemplateAction(selected);
      setResult(res ?? null);
      if (res?.success) router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-noto text-base font-semibold text-navy">החלפת תבנית</h2>
          <p className="mt-1 text-xs text-slate-400">בחרו תבנית חדשה — העמודים, התפריטים והגדרות העיצוב יוחלפו בהתאם</p>
        </div>
        <div className="px-6 py-5">
          {result?.error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{result.error}</p>}
          {result?.success && <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">התבנית הוחלה בהצלחה! העמודים והתפריטים עודכנו.</p>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map(t => {
              const isSelected = selected === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelected(isSelected ? null : t.id)}
                  disabled={applying}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white text-right transition-all duration-200 disabled:opacity-50 ${
                    isSelected
                      ? 'border-ocean shadow-lg shadow-ocean/10'
                      : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                  }`}
                >
                  <div
                    className="flex h-28 items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]"
                    style={{ background: `linear-gradient(135deg, ${t.primaryColor}15, ${t.primaryColor}08)` }}
                  >
                    <span
                      className="material-symbols-outlined text-[40px] transition-transform duration-200 group-hover:scale-110"
                      style={{ color: t.primaryColor }}
                    >
                      {t.icon}
                    </span>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-noto text-sm font-bold text-navy">{t.name}</h3>
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                        isSelected ? 'border-ocean bg-ocean' : 'border-slate-200'
                      }`}>
                        {isSelected && <span className="material-symbols-outlined text-[14px] text-white">check</span>}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-400">{t.description}</p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-300">
                      <span className="material-symbols-outlined text-[14px]">description</span>
                      {t.pages.length} {t.pages.length === 1 ? 'עמוד' : 'עמודים'}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute left-2 top-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ocean text-white shadow-md">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="mt-5 flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
              <p className="text-sm text-amber-800">
                <span className="material-symbols-outlined mr-1 align-middle text-[16px]">warning</span>
                החלפת תבנית תמחק את כל העמודים והתפריטים הקיימים
              </p>
              <button
                type="button"
                onClick={handleApply}
                disabled={applying}
                className="shrink-0 rounded-full bg-ocean px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50"
              >
                {applying ? 'מחיל...' : 'החל תבנית'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RedirectsSection({ redirects }: { redirects: RedirectItem[] }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<RedirectActionState, FormData>(
    async (prev, fd) => {
      const res = await addRedirectAction(prev, fd);
      if (res?.success) router.refresh();
      return res;
    },
    undefined,
  );

  async function handleDelete(id: string) {
    if (!confirm('למחוק הפנייה?')) return;
    await deleteRedirectAction(id);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-noto text-base font-semibold text-navy">הוסף הפנייה</h2>
        </div>
        <div className="px-6 py-5">
          <form action={formAction} className="flex items-end gap-3">
            <label className="flex-1"><span className={labelCls}>מנתיב</span><input name="fromPath" required dir="ltr" placeholder="/old-page" className={inputCls + ' font-mono'} /></label>
            <label className="flex-1"><span className={labelCls}>לנתיב</span><input name="toPath" required dir="ltr" placeholder="/new-page" className={inputCls + ' font-mono'} /></label>
            <label className="w-24"><span className={labelCls}>סוג</span>
              <select name="type" className={inputCls}><option value="301">301</option><option value="302">302</option></select>
            </label>
            <button type="submit" disabled={pending} className="whitespace-nowrap rounded-full bg-ocean shadow-sm px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50">
              {pending ? '...' : 'הוסף'}
            </button>
          </form>
          {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
        </div>
      </div>

      {redirects.length > 0 && (
        <DataTable headers={['מנתיב', 'לנתיב', 'סוג', { label: '', className: 'w-20' }]}>
          {redirects.map(r => (
            <DataTableRow key={r.id}>
              <DataTableCell className="font-mono font-medium text-navy" dir="ltr">{r.fromPath}</DataTableCell>
              <DataTableCell className="font-mono text-slate-500" dir="ltr">{r.toPath}</DataTableCell>
              <DataTableCell className="text-slate-500">{r.type}</DataTableCell>
              <DataTableCell className="text-left">
                <button onClick={() => handleDelete(r.id)} className="text-[13px] font-medium text-red-600 hover:underline">מחק</button>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
