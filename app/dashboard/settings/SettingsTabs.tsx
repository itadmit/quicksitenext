'use client';

import { useState, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSettingsAction, type SettingsActionState } from './actions';
import { addRedirectAction, deleteRedirectAction, type RedirectActionState } from './redirect-actions';
import { DataTable, DataTableRow, DataTableCell } from '@/components/dashboard/DataTable';
import { Settings, Search, Code, Share2, GitFork, Phone, Mail, MapPin, Globe } from 'lucide-react';

type SettingsData = {
  siteName: string; tagline: string; logoUrl: string | null; faviconUrl: string | null;
  primaryColor: string; footerText: string; socialLinks: string; customCss: string;
  analyticsId: string; fbPixelId: string; gtmId: string; customHeadCode: string;
  defaultSeoTitle: string; defaultSeoDesc: string;
  siteUrl?: string;
};

type RedirectItem = { id: string; fromPath: string; toPath: string; type: number };

const tabs = [
  { id: 'general', label: 'כללי', Icon: Settings },
  { id: 'seo', label: 'SEO', Icon: Search },
  { id: 'code', label: 'פיקסלים וקוד', Icon: Code },
  { id: 'social', label: 'פוטר ורשתות', Icon: Share2 },
  { id: 'redirects', label: 'הפניות URL', Icon: GitFork },
];

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';
const labelCls = 'mb-1 block text-xs font-medium text-slate-500';
const btnCls = 'cursor-pointer rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy/85 disabled:opacity-50';

export default function SettingsTabs({ settings, redirects }: { settings: SettingsData | null; redirects: RedirectItem[] }) {
  const [activeTab, setActiveTab] = useState('general');
  const [state, formAction, pending] = useActionState<SettingsActionState, FormData>(updateSettingsAction, undefined);
  const s = settings ?? {
    siteName: '', tagline: '', logoUrl: '', faviconUrl: '',
    primaryColor: '#a28b5d', footerText: '', socialLinks: '[]',
    customCss: '', analyticsId: '', fbPixelId: '', gtmId: '', customHeadCode: '',
    defaultSeoTitle: '', defaultSeoDesc: '',
  };

  return (
    <div className="flex gap-5">
      {/* Sidebar Navigation */}
      <div className="w-52 shrink-0">
        <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-2">
          <nav className="space-y-0.5">
            {tabs.map(t => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-navy/[0.06] text-navy font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-navy'
                  }`}
                >
                  <t.Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-w-0 flex-1">
        {state?.error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{state.error}</p>}
        {state?.success && <p className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">ההגדרות נשמרו בהצלחה</p>}

        {activeTab === 'redirects' ? (
          <RedirectsSection redirects={redirects} />
        ) : (
          <form action={formAction}>
            {activeTab === 'general' && (
              <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="text-[14px] font-semibold text-navy">הגדרות כלליות</h2>
                </div>
                <div className="space-y-4 px-5 py-4">
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
            )}

            {activeTab === 'seo' && (
              <SeoTab seoTitle={s.defaultSeoTitle} seoDesc={s.defaultSeoDesc} siteName={s.siteName} siteUrl={s.siteUrl} />
            )}

            {activeTab === 'code' && (
              <div className="space-y-5">
                {/* Tracking Pixels */}
                <div className="rounded-2xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="text-[14px] font-semibold text-navy">פיקסלים ומעקב</h2>
                    <p className="mt-0.5 text-xs text-slate-400">קודי מעקב גלובליים — מוטמעים פעם אחת בכל עמודי האתר אוטומטית</p>
                  </div>
                  <div className="space-y-4 px-5 py-4">
                    <label className="block">
                      <span className={labelCls}>Facebook Pixel ID</span>
                      <input name="fbPixelId" defaultValue={s.fbPixelId} placeholder="123456789012345" dir="ltr" className={inputCls + ' font-mono'} />
                      <p className="mt-1 text-[10px] text-slate-400">מזהה הפיקסל מ-Meta Business Suite</p>
                    </label>
                    <label className="block">
                      <span className={labelCls}>Google Tag Manager ID</span>
                      <input name="gtmId" defaultValue={s.gtmId} placeholder="GTM-XXXXXXX" dir="ltr" className={inputCls + ' font-mono'} />
                      <p className="mt-1 text-[10px] text-slate-400">אם יש לכם GTM, אין צורך להוסיף בנפרד Google Analytics — הוסיפו אותו דרך GTM</p>
                    </label>
                    <label className="block">
                      <span className={labelCls}>Google Analytics ID</span>
                      <input name="analyticsId" defaultValue={s.analyticsId} placeholder="G-XXXXXXXXXX" dir="ltr" className={inputCls + ' font-mono'} />
                      <p className="mt-1 text-[10px] text-slate-400">רק אם אתם לא משתמשים ב-GTM</p>
                    </label>
                  </div>
                </div>

                {/* Custom Head Code */}
                <div className="rounded-2xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="text-[14px] font-semibold text-navy">קוד מותאם (HEAD)</h2>
                    <p className="mt-0.5 text-xs text-slate-400">קוד שיוזרק בתגית HEAD — מתאים ל-Hotjar, Clarity, צ׳אטבוטים וכו׳</p>
                  </div>
                  <div className="px-5 py-4">
                    <textarea name="customHeadCode" rows={5} defaultValue={s.customHeadCode} placeholder={'<script>\n  // קוד מעקב מותאם\n</script>'} dir="ltr" className={inputCls + ' font-mono text-xs resize-y'} />
                  </div>
                </div>

                {/* Custom CSS */}
                <div className="rounded-2xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="text-[14px] font-semibold text-navy">CSS מותאם</h2>
                    <p className="mt-0.5 text-xs text-slate-400">סטיילים מותאמים שיחולו על כל עמודי האתר</p>
                  </div>
                  <div className="px-5 py-4">
                    <textarea name="customCss" rows={6} defaultValue={s.customCss} placeholder=".my-class {\n  color: red;\n}" dir="ltr" className={inputCls + ' font-mono text-xs resize-y'} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <SocialTab footerText={s.footerText} socialLinks={s.socialLinks} />
            )}

            <button type="submit" disabled={pending} className={btnCls + ' mt-5'}>
              {pending ? 'שומר...' : 'שמור הגדרות'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function SeoTab({ seoTitle, seoDesc, siteName, siteUrl }: { seoTitle: string; seoDesc: string; siteName: string; siteUrl?: string }) {
  const [title, setTitle] = useState(seoTitle);
  const [desc, setDesc] = useState(seoDesc);

  const previewTitle = title || siteName || 'שם האתר שלך';
  const previewDesc = desc || 'תיאור האתר יופיע כאן. כתבו תיאור קצר ומושך שמסביר מה האתר שלכם מציע.';
  const previewUrl = siteUrl || 'yoursite.quicksite.co.il';

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-[14px] font-semibold text-navy">SEO ברירת מחדל</h2>
          <p className="mt-0.5 text-xs text-slate-400">הגדרות אלו ישמשו כברירת מחדל לעמודים שלא הוגדרו להם כותרת ותיאור ייעודיים</p>
        </div>
        <div className="space-y-4 px-5 py-4">
          <label className="block">
            <div className="flex items-center justify-between">
              <span className={labelCls}>כותרת SEO</span>
              <span className={`text-[10px] ${title.length > 60 ? 'text-red-500 font-semibold' : 'text-slate-300'}`}>{title.length}/60</span>
            </div>
            <input name="defaultSeoTitle" value={title} onChange={e => setTitle(e.target.value)} placeholder="הכותרת שתופיע בתוצאות גוגל" className={inputCls} />
          </label>
          <label className="block">
            <div className="flex items-center justify-between">
              <span className={labelCls}>תיאור SEO</span>
              <span className={`text-[10px] ${desc.length > 160 ? 'text-red-500 font-semibold' : 'text-slate-300'}`}>{desc.length}/160</span>
            </div>
            <textarea name="defaultSeoDesc" rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="תיאור קצר שיופיע מתחת לכותרת בתוצאות החיפוש" className={inputCls + ' resize-y'} />
          </label>
        </div>
      </div>

      {/* Google Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-slate-400" />
            <h2 className="text-[14px] font-semibold text-navy">תצוגה מקדימה בגוגל</h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">כך האתר שלכם ייראה בתוצאות החיפוש של גוגל (בקירוב)</p>
        </div>
        <div className="px-5 py-5">
          <div className="rounded-xl border border-slate-100 bg-white p-5" dir="ltr">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
                <span className="text-xs font-bold text-slate-500">{(siteName || 'Q')[0].toUpperCase()}</span>
              </div>
              <div>
                <p className="text-[13px] text-slate-700">{siteName || 'שם האתר'}</p>
                <p className="text-[12px] text-slate-400">{previewUrl}</p>
              </div>
            </div>
            <h3 className="mt-2 text-xl font-normal leading-snug text-[#1a0dab]">{previewTitle}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[#4d5156]">{previewDesc.length > 160 ? previewDesc.slice(0, 160) + '...' : previewDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SvgIcon({ d }: { d: string }) {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d={d} /></svg>;
}

const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', placeholder: 'https://facebook.com/your-page', color: '#1877F2' },
  { key: 'instagram', label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z', placeholder: 'https://instagram.com/your-handle', color: '#E4405F' },
  { key: 'twitter', label: 'X (Twitter)', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', placeholder: 'https://x.com/your-handle', color: '#000000' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', placeholder: 'https://linkedin.com/company/your-page', color: '#0A66C2' },
  { key: 'youtube', label: 'YouTube', icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z', placeholder: 'https://youtube.com/@your-channel', color: '#FF0000' },
  { key: 'tiktok', label: 'TikTok', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z', placeholder: 'https://tiktok.com/@your-handle', color: '#000000' },
];

function SocialTab({ footerText, socialLinks }: { footerText: string; socialLinks: string }) {
  let parsed: { platform: string; url: string }[] = [];
  try { parsed = JSON.parse(socialLinks); } catch { /* ignore */ }

  const initialUrls: Record<string, string> = {};
  for (const p of parsed) {
    if (p.platform && p.url) initialUrls[p.platform] = p.url;
  }

  const [urls, setUrls] = useState<Record<string, string>>(initialUrls);

  function updateUrl(platform: string, url: string) {
    setUrls(prev => ({ ...prev, [platform]: url }));
  }

  const serialized = JSON.stringify(
    Object.entries(urls)
      .filter(([, url]) => url.trim())
      .map(([platform, url]) => ({ platform, url: url.trim() }))
  );

  return (
    <div className="space-y-5">
      {/* Footer */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-[14px] font-semibold text-navy">פוטר</h2>
          <p className="mt-0.5 text-xs text-slate-400">טקסט שמופיע בתחתית האתר</p>
        </div>
        <div className="space-y-4 px-5 py-4">
          <label className="block">
            <span className={labelCls}>טקסט פוטר</span>
            <input name="footerText" defaultValue={footerText} placeholder="© 2026 שם החברה. כל הזכויות שמורות." className={inputCls} />
          </label>
        </div>
      </div>

      {/* Social Networks */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-[14px] font-semibold text-navy">רשתות חברתיות</h2>
          <p className="mt-0.5 text-xs text-slate-400">הקישורים יוצגו בפוטר של האתר. השאירו ריק כדי להסתיר</p>
        </div>
        <div className="px-5 py-4">
          <div className="space-y-3">
            {SOCIAL_PLATFORMS.map(({ key, label, icon, placeholder, color }) => (
              <div key={key} className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${color}10`, color }}
                >
                  <SvgIcon d={icon} />
                </div>
                <div className="flex-1">
                  <input
                    value={urls[key] || ''}
                    onChange={e => updateUrl(key, e.target.value)}
                    placeholder={placeholder}
                    dir="ltr"
                    className={inputCls + ' font-mono text-xs'}
                  />
                </div>
                {urls[key]?.trim() && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">פעיל</span>
                )}
              </div>
            ))}
          </div>
          <input type="hidden" name="socialLinks" value={serialized} />
        </div>
      </div>

      {/* Contact Info hint */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-[14px] font-semibold text-navy">פרטי קשר</h2>
          <p className="mt-0.5 text-xs text-slate-400">פרטים אלו יוצגו בפוטר ובעמוד צור קשר (אם קיים)</p>
        </div>
        <div className="space-y-4 px-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className={labelCls}>טלפון</span>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-slate-300" />
                <input name="contactPhone" defaultValue="" placeholder="050-000-0000" dir="ltr" className={inputCls + ' font-mono'} />
              </div>
            </label>
            <label className="block">
              <span className={labelCls}>אימייל</span>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-slate-300" />
                <input name="contactEmail" defaultValue="" placeholder="info@example.com" dir="ltr" className={inputCls + ' font-mono'} />
              </div>
            </label>
          </div>
          <label className="block">
            <span className={labelCls}>כתובת</span>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-slate-300" />
              <input name="contactAddress" defaultValue="" placeholder="רחוב הרצל 1, תל אביב" className={inputCls} />
            </div>
          </label>
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
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-[14px] font-semibold text-navy">הוסף הפנייה</h2>
        </div>
        <div className="px-5 py-4">
          <form action={formAction} className="flex items-end gap-3">
            <label className="flex-1"><span className={labelCls}>מנתיב</span><input name="fromPath" required dir="ltr" placeholder="/old-page" className={inputCls + ' font-mono'} /></label>
            <label className="flex-1"><span className={labelCls}>לנתיב</span><input name="toPath" required dir="ltr" placeholder="/new-page" className={inputCls + ' font-mono'} /></label>
            <label className="w-24"><span className={labelCls}>סוג</span>
              <select name="type" className={inputCls}><option value="301">301</option><option value="302">302</option></select>
            </label>
            <button type="submit" disabled={pending} className="cursor-pointer whitespace-nowrap rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy/85 disabled:opacity-50">
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
                <button onClick={() => handleDelete(r.id)} className="cursor-pointer text-[13px] font-medium text-red-600 hover:underline">מחק</button>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
