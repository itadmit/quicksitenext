'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Download } from 'lucide-react';
import { updateLeadAction, deleteLeadAction, bulkUpdateLeadStatusAction, exportLeadsCsvAction, type LeadActionState } from './actions';
import { DataTable, DataTableRow, DataTableCell, StatusBadge, DataTableEmpty } from '@/components/dashboard/DataTable';

type Lead = {
  id: string; name: string; email: string; phone: string | null;
  company: string | null; message: string | null; source: string;
  createdAt: Date | string; updatedAt: Date | string; status: string;
  internalNotes: string | null;
  lastResponseSummary: string | null; lastResponseAt: Date | string | null;
  lastResponseChannel: string | null; tenantId: string;
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  NEW: { label: 'חדש', color: 'bg-ocean/[0.08] text-ocean' },
  CONTACTED: { label: 'נוצר קשר', color: 'bg-blue-50 text-blue-700' },
  QUALIFIED: { label: 'מתאים', color: 'bg-emerald-50 text-emerald-700' },
  PROPOSAL_SENT: { label: 'הצעה נשלחה', color: 'bg-amber-50 text-amber-700' },
  WON: { label: 'זכייה', color: 'bg-green-50 text-green-700' },
  LOST: { label: 'הפסד', color: 'bg-red-50 text-red-600' },
};

const STATUSES = [
  { value: 'NEW', label: 'חדש' },
  { value: 'CONTACTED', label: 'נוצר קשר' },
  { value: 'QUALIFIED', label: 'מתאים' },
  { value: 'PROPOSAL_SENT', label: 'הצעה נשלחה' },
  { value: 'WON', label: 'זכייה' },
  { value: 'LOST', label: 'הפסד' },
];

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulking, startBulk] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, startDelete] = useTransition();

  function toggleSelect(id: string) {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  function toggleSelectAll() {
    if (selected.size === leads.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(leads.map(l => l.id)));
    }
  }

  function handleBulkStatus(status: string) {
    startBulk(async () => {
      await bulkUpdateLeadStatusAction([...selected], status);
      setSelected(new Set());
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm('למחוק ליד זה?')) return;
    startDelete(async () => {
      await deleteLeadAction(id);
      router.refresh();
    });
  }

  async function handleExport() {
    const csv = await exportLeadsCsvAction();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  if (leads.length === 0) {
    return <DataTableEmpty icon="contact_mail" text="אין לידים" />;
  }

  return (
    <div className="space-y-4">
      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
          <span className="text-[13px] font-medium text-navy">{selected.size} נבחרו</span>
          <select
            onChange={e => { if (e.target.value) handleBulkStatus(e.target.value); e.target.value = ''; }}
            disabled={bulking}
            className="cursor-pointer rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-[12px] font-medium text-navy focus:outline-none focus:ring-1 focus:ring-slate-200"
          >
            <option value="">שנה סטטוס...</option>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={() => setSelected(new Set())} className="cursor-pointer text-xs text-slate-500 hover:text-navy">בטל בחירה</button>
        </div>
      )}

      {/* Export button */}
      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] font-medium text-slate-600 transition-colors duration-150 hover:border-slate-300 hover:text-navy"
        >
          <Download className="h-3.5 w-3.5" />
          ייצוא CSV
        </button>
      </div>

      <DataTable headers={[
        { label: '', className: 'w-10' },
        'שם',
        'אימייל',
        'טלפון',
        'מקור',
        'סטטוס',
        'תאריך',
        { label: '', className: 'w-20' },
      ]}>
        {leads.map(lead => (
          <DataTableRow key={lead.id}>
            <DataTableCell>
              <input
                type="checkbox"
                checked={selected.has(lead.id)}
                onChange={() => toggleSelect(lead.id)}
                className="h-4 w-4 cursor-pointer accent-ocean"
              />
            </DataTableCell>
            <DataTableCell className="font-medium text-navy">{lead.name}</DataTableCell>
            <DataTableCell dir="ltr" className="text-slate-500">{lead.email}</DataTableCell>
            <DataTableCell dir="ltr" className="text-slate-500">{lead.phone ?? '—'}</DataTableCell>
            <DataTableCell className="text-slate-500">{lead.source}</DataTableCell>
            <DataTableCell><StatusBadge status={lead.status} map={STATUS_MAP} /></DataTableCell>
            <DataTableCell className="text-[11px] text-slate-400">{new Date(lead.createdAt).toLocaleDateString('he-IL')}</DataTableCell>
            <DataTableCell>
              <div className="flex items-center justify-end gap-0.5">
                <button
                  onClick={() => setEditingId(editingId === lead.id ? null : lead.id)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-navy"
                  title="עריכה"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(lead.id)}
                  disabled={deleting}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                  title="מחיקה"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>

      {/* Inline edit panel */}
      {editingId && <LeadEditPanel lead={leads.find(l => l.id === editingId)!} onClose={() => setEditingId(null)} />}
    </div>
  );
}

function LeadEditPanel({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateLeadAction(undefined, fd);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
        router.refresh();
      }
    });
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-navy">עריכת ליד — {lead.name}</h3>
        <button onClick={onClose} className="cursor-pointer text-[13px] text-slate-400 hover:text-slate-600">סגור</button>
      </div>
      {lead.message && (
        <p className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">{lead.message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="hidden" name="id" value={lead.id} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">סטטוס</span>
            <select name="status" defaultValue={lead.status} className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30">
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">ערוץ תגובה</span>
            <input name="lastResponseChannel" defaultValue={lead.lastResponseChannel ?? ''} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30" />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">הערות פנימיות</span>
          <textarea name="internalNotes" rows={2} defaultValue={lead.internalNotes ?? ''} className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">סיכום תגובה</span>
          <textarea name="lastResponseSummary" rows={2} defaultValue={lead.lastResponseSummary ?? ''} className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30" />
        </label>
        <div className="flex items-center gap-2">
          <button type="submit" disabled={pending} className="cursor-pointer rounded-lg bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-navy/85 disabled:opacity-50">
            {pending ? 'שומר...' : 'עדכן'}
          </button>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-semibold text-slate-600 transition-colors duration-150 hover:border-slate-300">
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}
