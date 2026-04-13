'use client';

import { useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { inviteMemberAction, updateRoleAction, removeMemberAction, type TeamActionState } from './actions';
import { DataTable, DataTableRow, DataTableCell } from '@/components/dashboard/DataTable';

type Member = {
  id: string;
  role: string;
  user: { id: string; name: string; email: string };
};

const ROLES = [
  { value: 'owner', label: 'בעלים' },
  { value: 'editor', label: 'עורך' },
  { value: 'viewer', label: 'צופה' },
];

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';

export default function TeamClient({ members, currentUserId }: { members: Member[]; currentUserId: string }) {
  const router = useRouter();
  const [acting, startAction] = useTransition();
  const [state, formAction, pending] = useActionState<TeamActionState, FormData>(
    async (prev, fd) => { const r = await inviteMemberAction(prev, fd); if (r?.success) router.refresh(); return r; },
    undefined,
  );

  function handleRoleChange(memberId: string, role: string) {
    startAction(async () => { await updateRoleAction(memberId, role); router.refresh(); });
  }

  function handleRemove(memberId: string) {
    if (!confirm('להסיר חבר זה מהצוות?')) return;
    startAction(async () => { await removeMemberAction(memberId); router.refresh(); });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-100 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-[14px] font-semibold text-navy">הזמנת חבר צוות</h2>
        </div>
        <div className="px-5 py-4">
          <form action={formAction} className="flex items-end gap-3">
            <label className="flex-1"><span className="mb-1 block text-xs font-medium text-slate-500">אימייל</span><input name="email" type="email" required dir="ltr" placeholder="user@example.com" className={inputCls + ' font-mono'} /></label>
            <label className="w-32"><span className="mb-1 block text-xs font-medium text-slate-500">תפקיד</span>
              <select name="role" className={inputCls + ' cursor-pointer'}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </label>
            <button type="submit" disabled={pending} className="cursor-pointer whitespace-nowrap rounded-lg bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-navy/85 disabled:opacity-50">{pending ? '...' : 'הזמן'}</button>
          </form>
          {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
          {state?.success && <p className="mt-2 text-sm text-green-600">חבר הצוות נוסף בהצלחה</p>}
        </div>
      </div>

      <DataTable headers={['שם', 'אימייל', 'תפקיד', { label: '', className: 'w-20' }]}>
        {members.map(m => (
          <DataTableRow key={m.id}>
            <DataTableCell className="font-medium text-navy">{m.user.name}</DataTableCell>
            <DataTableCell className="font-mono text-slate-400" dir="ltr">{m.user.email}</DataTableCell>
            <DataTableCell>
              {m.user.id === currentUserId ? (
                <span className="inline-flex items-center rounded-full bg-ocean/[0.08] px-2.5 py-0.5 text-[11px] font-semibold text-ocean">
                  {ROLES.find(r => r.value === m.role)?.label ?? m.role} (את/ה)
                </span>
              ) : (
                <select
                  value={m.role}
                  onChange={e => handleRoleChange(m.id, e.target.value)}
                  disabled={acting}
                  className="cursor-pointer rounded-xl border-0 bg-slate-50 px-3 py-1.5 text-[13px] text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20"
                >
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              )}
            </DataTableCell>
            <DataTableCell className="text-left">
              {m.user.id !== currentUserId && (
                <button onClick={() => handleRemove(m.id)} disabled={acting} className="cursor-pointer text-[13px] font-medium text-slate-400 hover:text-red-500 disabled:opacity-50">הסר</button>
              )}
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
}
