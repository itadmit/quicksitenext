'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPopupAction, updatePopupAction, deletePopupAction, duplicatePopupAction, type PopupActionState } from './actions';
import { DataTable, DataTableRow, DataTableCell, StatusBadge } from '@/components/dashboard/DataTable';

type Popup = {
  id: string; name: string; enabled: boolean; priority: number;
  trigger: string; delayMs: number; timeOnSiteMs: number; scrollDepthPercent: number;
  title: string; body: string; imageUrl: string | null;
  ctaLabel: string | null; ctaHref: string | null; dismissLabel: string;
  frequency: string; hideDaysAfterDismiss: number;
  startDate: string | null; endDate: string | null;
  impressions: number; clicks: number; dismissals: number;
};

const TRIGGERS = [
  { value: 'on_load', label: 'בטעינה' },
  { value: 'exit_intent', label: 'כוונת יציאה' },
  { value: 'time_on_site', label: 'זמן באתר' },
  { value: 'scroll_depth', label: 'עומק גלילה' },
];

const FREQUENCIES = [
  { value: 'always', label: 'תמיד' },
  { value: 'once_per_session', label: 'פעם בסשן' },
  { value: 'once_per_days_after_dismiss', label: 'פעם ב-X ימים' },
];

const statusMap: Record<string, { label: string; color: string }> = {
  true: { label: 'פעיל', color: 'bg-green-50 text-green-700' },
  false: { label: 'כבוי', color: 'bg-slate-100 text-slate-500' },
};

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';
const labelCls = 'mb-1 block text-xs font-medium text-slate-500';

function PopupForm({ popup, onDone }: { popup?: Popup; onDone: () => void }) {
  const action = popup ? updatePopupAction : createPopupAction;
  const [state, formAction, pending] = useActionState<PopupActionState, FormData>(action, undefined);

  useEffect(() => { if (state?.success) onDone(); }, [state, onDone]);

  return (
    <form action={formAction} className="space-y-4">
      {popup && <input type="hidden" name="id" value={popup.id} />}
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <label className="block"><span className={labelCls}>שם</span><input name="name" required defaultValue={popup?.name ?? ''} className={inputCls} /></label>
        <label className="block"><span className={labelCls}>עדיפות</span><input name="priority" type="number" defaultValue={popup?.priority ?? 50} className={inputCls} /></label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label className="block"><span className={labelCls}>טריגר</span>
          <select name="trigger" defaultValue={popup?.trigger ?? 'on_load'} className={inputCls + ' cursor-pointer'}>{TRIGGERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select>
        </label>
        <label className="block"><span className={labelCls}>השהייה (ms)</span><input name="delayMs" type="number" defaultValue={popup?.delayMs ?? 0} className={inputCls} /></label>
        <label className="flex items-center gap-2 self-end pb-2"><input name="enabled" type="checkbox" defaultChecked={popup?.enabled ?? true} className="h-4 w-4 accent-ocean" /><span className="text-sm text-navy">פעיל</span></label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block"><span className={labelCls}>זמן באתר (ms)</span><input name="timeOnSiteMs" type="number" defaultValue={popup?.timeOnSiteMs ?? 15000} className={inputCls} /></label>
        <label className="block"><span className={labelCls}>עומק גלילה (%)</span><input name="scrollDepthPercent" type="number" defaultValue={popup?.scrollDepthPercent ?? 50} className={inputCls} /></label>
      </div>

      <label className="block"><span className={labelCls}>כותרת</span><input name="title" required defaultValue={popup?.title ?? ''} className={inputCls} /></label>
      <label className="block"><span className={labelCls}>תוכן</span><textarea name="body" rows={3} required defaultValue={popup?.body ?? ''} className={inputCls + ' resize-y'} /></label>
      <label className="block"><span className={labelCls}>תמונה (URL)</span><input name="imageUrl" defaultValue={popup?.imageUrl ?? ''} dir="ltr" className={inputCls + ' font-mono'} /></label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block"><span className={labelCls}>CTA תווית</span><input name="ctaLabel" defaultValue={popup?.ctaLabel ?? ''} className={inputCls} /></label>
        <label className="block"><span className={labelCls}>CTA קישור</span><input name="ctaHref" defaultValue={popup?.ctaHref ?? ''} dir="ltr" className={inputCls} /></label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label className="block"><span className={labelCls}>תווית סגירה</span><input name="dismissLabel" defaultValue={popup?.dismissLabel ?? 'סגור'} className={inputCls} /></label>
        <label className="block"><span className={labelCls}>תדירות</span>
          <select name="frequency" defaultValue={popup?.frequency ?? 'once_per_session'} className={inputCls + ' cursor-pointer'}>{FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
        </label>
        <label className="block"><span className={labelCls}>ימי הסתרה</span><input name="hideDaysAfterDismiss" type="number" defaultValue={popup?.hideDaysAfterDismiss ?? 7} className={inputCls} /></label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block"><span className={labelCls}>תאריך התחלה</span><input name="startDate" type="date" defaultValue={popup?.startDate ? new Date(popup.startDate).toISOString().split('T')[0] : ''} className={inputCls} /></label>
        <label className="block"><span className={labelCls}>תאריך סיום</span><input name="endDate" type="date" defaultValue={popup?.endDate ? new Date(popup.endDate).toISOString().split('T')[0] : ''} className={inputCls} /></label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="rounded-full bg-ocean px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50">{pending ? 'שומר...' : popup ? 'עדכן' : 'צור פופאפ'}</button>
        <button type="button" onClick={onDone} className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-ocean hover:text-ocean">ביטול</button>
      </div>
    </form>
  );
}

export default function PopupsClient({ popups: initialPopups }: { popups: Popup[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, startDelete] = useTransition();

  function handleDelete(id: string) {
    if (!confirm('למחוק את הפופאפ?')) return;
    startDelete(async () => { await deletePopupAction(id); router.refresh(); });
  }

  function handleDone() {
    setCreating(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {!creating && !editing && (
        <button
          onClick={() => setCreating(true)}
          className="rounded-full bg-ocean px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ocean/85"
        >
          + פופאפ חדש
        </button>
      )}

      {creating && (
        <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="border-b border-slate-100 px-6 py-4"><h2 className="font-noto text-[15px] font-semibold text-navy">פופאפ חדש</h2></div>
          <div className="px-6 py-5"><PopupForm onDone={handleDone} /></div>
        </div>
      )}

      {editing && (
        <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="border-b border-slate-100 px-6 py-4"><h2 className="font-noto text-[15px] font-semibold text-navy">עריכת פופאפ</h2></div>
          <div className="px-6 py-5">
            <PopupForm popup={initialPopups.find(p => p.id === editing)} onDone={handleDone} />
          </div>
        </div>
      )}

      {initialPopups.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="material-symbols-outlined mb-3 block text-4xl text-slate-200">web_asset</span>
          <p className="text-[13px] text-slate-400">אין פופאפים עדיין</p>
        </div>
      ) : (
        <DataTable headers={['שם', 'סטטוס', 'טריגר', 'צפיות', 'קליקים', 'סגירות', { label: '', className: 'w-40' }]}>
          {initialPopups.map(popup => (
            <DataTableRow key={popup.id}>
              <DataTableCell className="font-medium text-navy">{popup.name}</DataTableCell>
              <DataTableCell><StatusBadge status={String(popup.enabled)} map={statusMap} /></DataTableCell>
              <DataTableCell className="text-slate-500">{TRIGGERS.find(t => t.value === popup.trigger)?.label ?? popup.trigger}</DataTableCell>
              <DataTableCell className="text-slate-500">{popup.impressions}</DataTableCell>
              <DataTableCell className="text-slate-500">{popup.clicks}</DataTableCell>
              <DataTableCell className="text-slate-500">{popup.dismissals}</DataTableCell>
              <DataTableCell>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setEditing(editing === popup.id ? null : popup.id)} className="text-[13px] font-medium text-ocean hover:underline">עריכה</button>
                  <button onClick={() => { startDelete(async () => { await duplicatePopupAction(popup.id); router.refresh(); }); }} disabled={deleting} className="text-[13px] font-medium text-slate-500 hover:text-ocean hover:underline disabled:opacity-50">שכפול</button>
                  <button onClick={() => handleDelete(popup.id)} disabled={deleting} className="text-[13px] font-medium text-red-600 hover:underline disabled:opacity-50">מחק</button>
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
