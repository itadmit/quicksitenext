'use client';

import { useActionState, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateLeadAction, deleteLeadAction, bulkUpdateLeadStatusAction, exportLeadsCsvAction, type LeadActionState } from './actions';

type Lead = {
  id: string; name: string; email: string; phone: string | null;
  company: string | null; message: string | null; source: string;
  createdAt: Date | string; updatedAt: Date | string; status: string;
  internalNotes: string | null;
  lastResponseSummary: string | null; lastResponseAt: Date | string | null;
  lastResponseChannel: string | null; tenantId: string;
};

const STATUSES = [
  { value: 'ALL', label: 'הכל' },
  { value: 'NEW', label: 'חדש' },
  { value: 'CONTACTED', label: 'נוצר קשר' },
  { value: 'QUALIFIED', label: 'מתאים' },
  { value: 'PROPOSAL_SENT', label: 'הצעה נשלחה' },
  { value: 'WON', label: 'זכייה' },
  { value: 'LOST', label: 'הפסד' },
];

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';
const labelCls = 'mb-1 block text-xs font-medium text-slate-500';

function LeadCard({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [deleting, startDelete] = useTransition();
  const [state, formAction, pending] = useActionState<LeadActionState, FormData>(
    async (prev, fd) => { const r = await updateLeadAction(prev, fd); if (r?.success) router.refresh(); return r; },
    undefined,
  );

  function handleDelete() {
    if (!confirm('למחוק ליד זה?')) return;
    startDelete(async () => { await deleteLeadAction(lead.id); router.refresh(); });
  }

  return (
    <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-noto text-base font-semibold text-navy">{lead.name}</h3>
            <p className="text-sm text-slate-500">{lead.email}{lead.phone ? ` · ${lead.phone}` : ''}</p>
            {lead.company && <p className="text-xs text-slate-400">{lead.company}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{new Date(lead.createdAt).toLocaleDateString('he-IL')}</span>
            <button onClick={handleDelete} disabled={deleting} className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50">מחק</button>
          </div>
        </div>
      </div>
      <div className="px-6 py-5">
        {lead.message && <p className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">{lead.message}</p>}
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="id" value={lead.id} />
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className={labelCls}>סטטוס</span>
              <select name="status" defaultValue={lead.status} className={inputCls + ' cursor-pointer'}>
                {STATUSES.filter(s => s.value !== 'ALL').map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <label className="block"><span className={labelCls}>ערוץ תגובה</span><input name="lastResponseChannel" defaultValue={lead.lastResponseChannel ?? ''} className={inputCls} /></label>
          </div>
          <label className="block"><span className={labelCls}>הערות פנימיות</span><textarea name="internalNotes" rows={2} defaultValue={lead.internalNotes ?? ''} className={inputCls + ' resize-y'} /></label>
          <label className="block"><span className={labelCls}>סיכום תגובה</span><textarea name="lastResponseSummary" rows={2} defaultValue={lead.lastResponseSummary ?? ''} className={inputCls + ' resize-y'} /></label>
          <button type="submit" disabled={pending} className="rounded-full bg-ocean shadow-sm px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50">{pending ? 'שומר...' : 'עדכן'}</button>
        </form>
      </div>
    </div>
  );
}

export default function LeadsClient({ leads, currentStatus, currentSearch }: { leads: Lead[]; currentStatus: string; currentSearch: string }) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulking, startBulk] = useTransition();

  function navigate(status: string, q: string) {
    const params = new URLSearchParams();
    if (status !== 'ALL') params.set('status', status);
    if (q) params.set('q', q);
    const qs = params.toString();
    router.push('/dashboard/leads' + (qs ? `?${qs}` : ''));
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  function handleBulkStatus(status: string) {
    startBulk(async () => { await bulkUpdateLeadStatusAction([...selected], status); setSelected(new Set()); router.refresh(); });
  }

  async function handleExport() {
    const csv = await exportLeadsCsvAction();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && navigate(currentStatus, search)}
              placeholder="חיפוש שם, אימייל, חברה..."
              className="border-none bg-transparent text-sm text-navy outline-none placeholder:text-slate-400 w-56"
            />
          </div>
          <select value={currentStatus} onChange={e => navigate(e.target.value, search)} className="cursor-pointer rounded-xl border-0 bg-slate-50 px-4 py-2 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20">
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={handleExport} className="mr-auto flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-ocean hover:text-ocean">
            <span className="material-symbols-outlined text-[16px]">download</span>
            ייצוא CSV
          </button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-2xl bg-ocean/[0.04] border border-ocean/15 px-6 py-3">
          <span className="text-sm font-medium text-ocean">{selected.size} נבחרו</span>
          <select onChange={e => { if (e.target.value) handleBulkStatus(e.target.value); e.target.value = ''; }} disabled={bulking} className="cursor-pointer rounded-xl border-0 bg-slate-50 px-3 py-1.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20">
            <option value="">שנה סטטוס...</option>
            {STATUSES.filter(s => s.value !== 'ALL').map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={() => setSelected(new Set())} className="text-xs text-slate-500 hover:text-navy">בטל בחירה</button>
        </div>
      )}

      {leads.length === 0 ? (
        <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 py-12 text-center">
          <span className="material-symbols-outlined mb-3 block text-4xl text-slate-300">contact_mail</span>
          <p className="text-sm text-slate-500">אין לידים{currentStatus !== 'ALL' ? ' בסטטוס זה' : ''}</p>
        </div>
      ) : (
        <div className="max-w-4xl space-y-4">
          {leads.map(lead => (
            <div key={lead.id} className="flex gap-3 items-start">
              <input
                type="checkbox"
                checked={selected.has(lead.id)}
                onChange={() => toggleSelect(lead.id)}
                className="mt-6 h-4 w-4 accent-ocean shrink-0"
              />
              <div className="flex-1 min-w-0">
                <LeadCard lead={lead} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
