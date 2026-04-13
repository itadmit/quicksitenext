'use client';

import { useState, useActionState } from 'react';
import { saveLeadSettingsAction, type LeadSettingsState } from './settings-actions';
import { Settings, Mail, Webhook, MessageSquareReply, Info, ChevronDown, ChevronUp } from 'lucide-react';

type LeadSettingsData = {
  leadNotifyEmail: string;
  leadWebhookUrl: string;
  leadAutoReply: boolean;
  leadAutoReplyMsg: string;
};

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';
const labelCls = 'mb-1 block text-xs font-medium text-slate-500';

export default function LeadSettings({ settings }: { settings: LeadSettingsData }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<LeadSettingsState, FormData>(saveLeadSettingsAction, undefined);
  const [autoReply, setAutoReply] = useState(settings.leadAutoReply);
  const [showWebhookInfo, setShowWebhookInfo] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center gap-2.5 px-5 py-4 text-right"
      >
        <Settings className="h-4 w-4 text-slate-400" />
        <span className="flex-1 text-[14px] font-semibold text-navy">הגדרות לידים</span>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 py-5">
          {state?.error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{state.error}</p>}
          {state?.success && <p className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">ההגדרות נשמרו בהצלחה</p>}

          <form action={formAction} className="space-y-6">
            {/* Email notification */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <h3 className="text-[13px] font-semibold text-navy">התראת ליד חדש</h3>
              </div>
              <label className="block">
                <span className={labelCls}>כתובת מייל לקבלת התראות</span>
                <input
                  name="leadNotifyEmail"
                  type="email"
                  defaultValue={settings.leadNotifyEmail}
                  placeholder="you@example.com"
                  dir="ltr"
                  className={inputCls + ' font-mono'}
                />
                <p className="mt-1 text-[10px] text-slate-400">השאירו ריק לשליחה לבעל האתר (ברירת מחדל)</p>
              </label>
            </div>

            {/* Auto reply */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <MessageSquareReply className="h-4 w-4 text-slate-400" />
                <h3 className="text-[13px] font-semibold text-navy">מייל תשובה אוטומטי ללקוח</h3>
              </div>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="leadAutoReply"
                    checked={autoReply}
                    onChange={e => setAutoReply(e.target.checked)}
                    className="h-4 w-4 cursor-pointer accent-navy"
                  />
                  <span className="text-sm text-navy">שלח מייל אישור אוטומטי ללקוח שהשאיר ליד</span>
                </label>
                {autoReply && (
                  <label className="block">
                    <span className={labelCls}>הודעה מותאמת (אופציונלי)</span>
                    <textarea
                      name="leadAutoReplyMsg"
                      rows={3}
                      defaultValue={settings.leadAutoReplyMsg}
                      placeholder="תודה שפנית אלינו! נחזור אליך בהקדם."
                      className={inputCls + ' resize-y'}
                    />
                    <p className="mt-1 text-[10px] text-slate-400">השאירו ריק לשימוש בהודעת ברירת המחדל</p>
                  </label>
                )}
              </div>
            </div>

            {/* Webhook */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Webhook className="h-4 w-4 text-slate-400" />
                <h3 className="text-[13px] font-semibold text-navy">Webhook (אופציונלי)</h3>
                <button
                  type="button"
                  onClick={() => setShowWebhookInfo(!showWebhookInfo)}
                  className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
                >
                  <Info className="h-3 w-3" />
                </button>
              </div>

              {showWebhookInfo && (
                <div className="mb-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-semibold text-navy">מה זה Webhook?</p>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    כשליד חדש מגיע, המערכת שולחת בקשת POST לכתובת שתגדירו עם פרטי הליד. זה מאפשר לשלב עם מערכות חיצוניות כמו Zapier, Make, CRM וכו׳.
                  </p>
                  <p className="mt-3 mb-1 text-[10px] font-semibold text-navy">דוגמה למידע שנשלח:</p>
                  <pre className="rounded-lg bg-navy p-3 text-[10px] leading-relaxed text-slate-300" dir="ltr">{`{
  "event": "new_lead",
  "lead": {
    "name": "ישראל ישראלי",
    "email": "israel@example.com",
    "phone": "050-1234567",
    "company": "חברה בע״מ",
    "message": "מעוניין בפרטים נוספים",
    "source": "website_contact",
    "created_at": "2026-04-13T12:00:00Z"
  }
}`}</pre>
                </div>
              )}

              <label className="block">
                <span className={labelCls}>כתובת Webhook URL</span>
                <input
                  name="leadWebhookUrl"
                  type="url"
                  defaultValue={settings.leadWebhookUrl}
                  placeholder="https://hooks.zapier.com/..."
                  dir="ltr"
                  className={inputCls + ' font-mono'}
                />
              </label>
            </div>

            <button type="submit" disabled={pending} className="cursor-pointer rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy/85 disabled:opacity-50">
              {pending ? 'שומר...' : 'שמור הגדרות'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
