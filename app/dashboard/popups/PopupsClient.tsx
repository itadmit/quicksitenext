'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPopupAction, updatePopupAction, deletePopupAction, type PopupActionState } from './actions';

type Popup = {
  id: string; name: string; enabled: boolean; priority: number;
  trigger: string; delayMs: number; title: string; body: string;
  ctaLabel: string | null; ctaHref: string | null; dismissLabel: string;
  frequency: string; hideDaysAfterDismiss: number;
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

const inputCls = 'w-full border border-charcoal/20 bg-white px-4 py-2.5 text-sm text-charcoal focus:border-primary focus:outline-none';
const labelCls = 'mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60';

function PopupForm({
  popup,
  onDone,
}: {
  popup?: Popup;
  onDone: () => void;
}) {
  const action = popup ? updatePopupAction : createPopupAction;
  const [state, formAction, pending] = useActionState<PopupActionState, FormData>(action, undefined);

  useEffect(() => {
    if (state?.success) onDone();
  }, [state, onDone]);

  return (
    <form action={formAction} className="space-y-4">
      {popup && <input type="hidden" name="id" value={popup.id} />}
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className={labelCls}>שם</span>
          <input name="name" required defaultValue={popup?.name ?? ''} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>עדיפות</span>
          <input name="priority" type="number" defaultValue={popup?.priority ?? 50} className={inputCls} />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label className="block">
          <span className={labelCls}>טריגר</span>
          <select name="trigger" defaultValue={popup?.trigger ?? 'on_load'} className={inputCls}>
            {TRIGGERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>השהייה (ms)</span>
          <input name="delayMs" type="number" defaultValue={popup?.delayMs ?? 0} className={inputCls} />
        </label>
        <label className="flex items-center gap-2 self-end pb-2">
          <input name="enabled" type="checkbox" defaultChecked={popup?.enabled ?? true} className="accent-primary w-4 h-4" />
          <span className="text-sm text-charcoal">פעיל</span>
        </label>
      </div>

      <label className="block">
        <span className={labelCls}>כותרת</span>
        <input name="title" required defaultValue={popup?.title ?? ''} className={inputCls} />
      </label>

      <label className="block">
        <span className={labelCls}>תוכן</span>
        <textarea name="body" rows={3} required defaultValue={popup?.body ?? ''} className={inputCls + ' resize-y'} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className={labelCls}>CTA תווית</span>
          <input name="ctaLabel" defaultValue={popup?.ctaLabel ?? ''} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>CTA קישור</span>
          <input name="ctaHref" defaultValue={popup?.ctaHref ?? ''} dir="ltr" className={inputCls} />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label className="block">
          <span className={labelCls}>תווית סגירה</span>
          <input name="dismissLabel" defaultValue={popup?.dismissLabel ?? 'סגור'} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>תדירות</span>
          <select name="frequency" defaultValue={popup?.frequency ?? 'once_per_session'} className={inputCls}>
            {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>הסתר ימים לאחר סגירה</span>
          <input name="hideDaysAfterDismiss" type="number" defaultValue={popup?.hideDaysAfterDismiss ?? 7} className={inputCls} />
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
        >
          {pending ? 'שומר...' : popup ? 'עדכן' : 'צור פופאפ'}
        </button>
        <button type="button" onClick={onDone} className="border border-charcoal/20 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-charcoal hover:border-primary">
          ביטול
        </button>
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
    startDelete(async () => {
      await deletePopupAction(id);
      router.refresh();
    });
  }

  function handleDone() {
    setCreating(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-noto text-3xl font-black text-charcoal">פופאפים</h1>
        {!creating && (
          <button
            onClick={() => { setCreating(true); setEditing(null); }}
            className="bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90"
          >
            פופאפ חדש
          </button>
        )}
      </div>

      {creating && (
        <div className="border border-charcoal/10 bg-white p-6 mb-6 max-w-3xl">
          <h2 className="font-noto text-lg font-bold text-charcoal mb-4">פופאפ חדש</h2>
          <PopupForm onDone={handleDone} />
        </div>
      )}

      {initialPopups.length === 0 && !creating ? (
        <div className="border border-charcoal/10 bg-white p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-charcoal/20 mb-3 block">web_asset</span>
          <p className="text-charcoal/50 text-sm">אין פופאפים עדיין</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {initialPopups.map((popup) => (
            <div key={popup.id} className="border border-charcoal/10 bg-white p-5">
              {editing === popup.id ? (
                <PopupForm popup={popup} onDone={handleDone} />
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-charcoal">{popup.name}</span>
                      <span className={`px-2 py-0.5 text-xs rounded ${popup.enabled ? 'bg-green-100 text-green-800' : 'bg-charcoal/10 text-charcoal/50'}`}>
                        {popup.enabled ? 'פעיל' : 'לא פעיל'}
                      </span>
                      <span className="text-xs text-charcoal/40">עדיפות: {popup.priority}</span>
                    </div>
                    <p className="text-sm text-charcoal/60">{popup.title}</p>
                    <p className="text-xs text-charcoal/40 mt-1">
                      {TRIGGERS.find((t) => t.value === popup.trigger)?.label} · {FREQUENCIES.find((f) => f.value === popup.frequency)?.label}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditing(popup.id)} className="text-primary text-xs font-bold hover:underline">עריכה</button>
                    <button onClick={() => handleDelete(popup.id)} disabled={deleting} className="text-red-600 text-xs font-bold hover:underline disabled:opacity-50">מחק</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
