'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { updateLeadAction, type LeadActionState } from './actions';

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

const inputCls = 'w-full border border-charcoal/20 bg-white px-3 py-2 text-sm text-charcoal focus:border-primary focus:outline-none';
const labelCls = 'mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60';

function LeadCard({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<LeadActionState, FormData>(
    async (prev, fd) => {
      const result = await updateLeadAction(prev, fd);
      if (result?.success) router.refresh();
      return result;
    },
    undefined,
  );

  return (
    <div className="border border-charcoal/10 bg-white p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-charcoal">{lead.name}</h3>
          <p className="text-sm text-charcoal/60">{lead.email}{lead.phone ? ` · ${lead.phone}` : ''}</p>
          {lead.company && <p className="text-xs text-charcoal/40">{lead.company}</p>}
        </div>
        <div className="text-left">
          <span className="text-xs text-charcoal/40">{new Date(lead.createdAt).toLocaleDateString('he-IL')}</span>
          <p className="text-xs text-charcoal/40">מקור: {lead.source}</p>
        </div>
      </div>

      {lead.message && (
        <p className="text-sm text-charcoal/70 bg-charcoal/[0.02] p-3 mb-3 border border-charcoal/5">{lead.message}</p>
      )}

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="id" value={lead.id} />
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className={labelCls}>סטטוס</span>
            <select name="status" defaultValue={lead.status} className={inputCls}>
              {STATUSES.filter((s) => s.value !== 'ALL').map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelCls}>ערוץ תגובה אחרון</span>
            <input name="lastResponseChannel" defaultValue={lead.lastResponseChannel ?? ''} className={inputCls} />
          </label>
        </div>

        <label className="block">
          <span className={labelCls}>הערות פנימיות</span>
          <textarea name="internalNotes" rows={2} defaultValue={lead.internalNotes ?? ''} className={inputCls + ' resize-y'} />
        </label>

        <label className="block">
          <span className={labelCls}>סיכום תגובה אחרון</span>
          <textarea name="lastResponseSummary" rows={2} defaultValue={lead.lastResponseSummary ?? ''} className={inputCls + ' resize-y'} />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="bg-primary px-5 py-2 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
        >
          {pending ? 'שומר...' : 'עדכן ליד'}
        </button>
      </form>
    </div>
  );
}

export default function LeadsClient({ leads, currentStatus }: { leads: Lead[]; currentStatus: string }) {
  const router = useRouter();

  function handleFilterChange(value: string) {
    const params = value === 'ALL' ? '/dashboard/leads' : `/dashboard/leads?status=${value}`;
    router.push(params);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-noto text-3xl font-black text-charcoal">לידים</h1>
        <select
          value={currentStatus}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border border-charcoal/20 bg-white px-4 py-2 text-sm text-charcoal focus:border-primary focus:outline-none"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {leads.length === 0 ? (
        <div className="border border-charcoal/10 bg-white p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-charcoal/20 mb-3 block">contact_mail</span>
          <p className="text-charcoal/50 text-sm">אין לידים{currentStatus !== 'ALL' ? ' בסטטוס זה' : ''}</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
