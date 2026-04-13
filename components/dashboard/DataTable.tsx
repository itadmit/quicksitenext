import React from 'react';

type Props = {
  headers: (string | { label: string; className?: string })[];
  children: React.ReactNode;
};

export function DataTable({ headers, children }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
      <table className="w-full text-right">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            {headers.map((h, i) => {
              const label = typeof h === 'string' ? h : h.label;
              const cls = typeof h === 'string' ? '' : h.className ?? '';
              return (
                <th key={i} className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${cls}`}>
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">{children}</tbody>
      </table>
    </div>
  );
}

export function DataTableRow({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr
      className={`transition-colors duration-100 hover:bg-slate-50/60 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function DataTableCell({ children, className = '', dir }: { children?: React.ReactNode; className?: string; dir?: 'ltr' | 'rtl' }) {
  return <td className={`px-4 py-3 text-[13px] ${className}`} dir={dir}>{children}</td>;
}

export function StatusBadge({ status, map }: { status: string; map: Record<string, { label: string; color: string }> }) {
  const entry = map[status] ?? { label: status, color: 'bg-slate-100 text-slate-500' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${entry.color}`}>
      {entry.label}
    </span>
  );
}

export function DataTableEmpty({ icon = 'inbox', text = 'אין נתונים' }: { icon?: string; text?: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white py-16 text-center">
      <span className="material-symbols-outlined mb-3 block text-4xl text-slate-200">{icon}</span>
      <p className="text-[13px] text-slate-400">{text}</p>
    </div>
  );
}
