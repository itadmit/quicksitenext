'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

type Props = {
  placeholder?: string;
  basePath: string;
  filters?: { name: string; label: string; options: { value: string; label: string }[] }[];
};

export default function TableSearch({ placeholder = 'חיפוש...', basePath, filters = [] }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') ?? '');

  function navigate(overrides: Record<string, string> = {}) {
    const params = new URLSearchParams(searchParams.toString());
    if (overrides.q !== undefined) params.set('q', overrides.q);
    else if (q) params.set('q', q);
    else params.delete('q');

    for (const [key, value] of Object.entries(overrides)) {
      if (key === 'q') continue;
      if (value) params.set(key, value); else params.delete(key);
    }

    const qs = params.toString();
    router.push(basePath + (qs ? `?${qs}` : ''));
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[200px] flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-slate-300" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') navigate({ q }); }}
            placeholder={placeholder}
            className="flex-1 border-none bg-transparent text-[13px] text-navy outline-none placeholder:text-slate-400"
          />
        </div>
        {filters.map(f => (
          <select
            key={f.name}
            value={searchParams.get(f.name) ?? ''}
            onChange={e => navigate({ [f.name]: e.target.value })}
            className="cursor-pointer rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-[12px] font-medium text-navy focus:outline-none focus:ring-1 focus:ring-slate-200"
          >
            <option value="">{f.label}</option>
            {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}
      </div>
    </div>
  );
}
