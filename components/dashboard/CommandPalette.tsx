'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { globalSearchAction } from '@/app/actions/global-search';

type Result = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  category: string;
  icon: string;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [selected, setSelected] = useState(0);
  const [searching, startSearch] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
      setSelected(0);
    }
  }, [open]);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timer = setTimeout(() => {
      startSearch(async () => {
        const res = await globalSearchAction(query);
        setResults(res);
        setSelected(0);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[selected]) { navigate(results[selected].href); }
  }

  if (!open) return null;

  const grouped = results.reduce<Record<string, Result[]>>((acc, r) => {
    (acc[r.category] ||= []).push(r);
    return acc;
  }, {});

  let idx = -1;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <span className="material-symbols-outlined text-[20px] text-slate-400">search</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="חיפוש עמודים, פוסטים, לידים..."
            className="flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-slate-400"
          />
          <kbd className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400">ESC</kbd>
        </div>

        {query.length >= 2 && (
          <div className="max-h-80 overflow-y-auto px-2 py-2">
            {searching && results.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">מחפש...</p>
            )}
            {!searching && results.length === 0 && query.length >= 2 && (
              <p className="py-8 text-center text-sm text-slate-400">לא נמצאו תוצאות</p>
            )}
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <p className="mb-1 mt-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{cat}</p>
                {items.map((item) => {
                  idx++;
                  const i = idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.href)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right transition-colors ${i === selected ? 'bg-ocean/[0.08] text-ocean' : 'text-navy hover:bg-slate-50'}`}
                    >
                      <span className={`material-symbols-outlined text-[18px] ${i === selected ? 'text-ocean' : 'text-slate-400'}`}>{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{item.title}</p>
                        {item.subtitle && <p className="truncate text-xs text-slate-400">{item.subtitle}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
