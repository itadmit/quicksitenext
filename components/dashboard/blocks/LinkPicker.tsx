'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link as LinkIcon, FileText, Newspaper, Tag, ExternalLink, Search, ChevronDown, X, Hash } from 'lucide-react';
import { fetchLinkableItems, type LinkableItem } from '@/app/dashboard/pages/[id]/visual/actions';

type Props = {
  value: string;
  onChange: (href: string) => void;
  label?: string;
  placeholder?: string;
};

const TYPE_META: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  page: { icon: <FileText className="h-3.5 w-3.5" />, label: 'עמודים', color: 'text-ocean' },
  post: { icon: <Newspaper className="h-3.5 w-3.5" />, label: 'פוסטים', color: 'text-amber-600' },
  category: { icon: <Tag className="h-3.5 w-3.5" />, label: 'קטגוריות', color: 'text-emerald-600' },
};

export default function LinkPicker({ value, onChange, label = 'קישור', placeholder = 'חפשו עמוד או הדביקו URL' }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<LinkableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadItems = useCallback(async () => {
    if (items.length > 0) return;
    setLoading(true);
    try {
      const data = await fetchLinkableItems();
      setItems(data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [items.length]);

  useEffect(() => {
    if (open) loadItems();
  }, [open, loadItems]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const matchedItem = items.find((i) => i.href === value);

  const filtered = items.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return item.label.toLowerCase().includes(q) || item.href.toLowerCase().includes(q);
  });

  const grouped = {
    page: filtered.filter((i) => i.type === 'page'),
    post: filtered.filter((i) => i.type === 'post'),
    category: filtered.filter((i) => i.type === 'category'),
  };

  const isCustomUrl = query.startsWith('/') || query.startsWith('#') || query.startsWith('http') || query.startsWith('mailto:') || query.startsWith('tel:');

  const handleSelect = (href: string) => {
    onChange(href);
    setQuery('');
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setQuery('');
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query) {
      e.preventDefault();
      handleSelect(query);
    }
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">{label}</span>

      {/* Selected value display */}
      {value && !open ? (
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 transition-colors">
          <span className={`flex-shrink-0 ${matchedItem ? TYPE_META[matchedItem.type]?.color ?? 'text-slate-400' : 'text-slate-400'}`}>
            {matchedItem ? TYPE_META[matchedItem.type]?.icon : <ExternalLink className="h-3.5 w-3.5" />}
          </span>
          <button
            type="button"
            onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
            className="flex flex-1 items-center gap-1.5 text-right cursor-pointer"
          >
            <span className="truncate text-sm text-navy">
              {matchedItem ? matchedItem.label : value}
            </span>
            {matchedItem && (
              <span className="truncate text-[10px] text-slate-400" dir="ltr">{value}</span>
            )}
          </button>
          <button type="button" onClick={handleClear} className="flex-shrink-0 rounded p-0.5 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer">
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        /* Search input */
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 transition-colors focus-within:border-ocean focus-within:ring-1 focus-within:ring-ocean/30">
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            dir="auto"
            className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-slate-300"
          />
          {value && (
            <button type="button" onClick={() => setOpen(false)} className="flex-shrink-0 text-[10px] font-medium text-ocean cursor-pointer">
              ביטול
            </button>
          )}
          <ChevronDown className={`h-3 w-3 flex-shrink-0 text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-1 max-h-[280px] overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/[0.04]">
          {loading && (
            <div className="flex items-center justify-center py-6">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-ocean border-t-transparent" />
            </div>
          )}

          {!loading && (
            <>
              {/* Custom URL option */}
              {isCustomUrl && (
                <div className="border-b border-slate-100 p-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelect(query)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-right transition-colors hover:bg-ocean-bg cursor-pointer"
                  >
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                      {query.startsWith('#') ? <Hash className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-navy">קישור מותאם</div>
                      <div className="truncate text-[10px] text-slate-400" dir="ltr">{query}</div>
                    </div>
                    <span className="text-[9px] font-medium text-ocean">Enter ↵</span>
                  </button>
                </div>
              )}

              {/* Grouped items */}
              {(['page', 'post', 'category'] as const).map((type) => {
                const group = grouped[type];
                if (group.length === 0) return null;
                const meta = TYPE_META[type];
                return (
                  <div key={type} className="p-1.5">
                    <div className="flex items-center gap-1.5 px-2.5 py-1">
                      <span className={meta.color}>{meta.icon}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{meta.label}</span>
                      <span className="text-[9px] text-slate-300">{group.length}</span>
                    </div>
                    {group.map((item) => (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => handleSelect(item.href)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-right transition-colors hover:bg-ocean-bg cursor-pointer ${value === item.href ? 'bg-ocean-bg' : ''}`}
                      >
                        <span className={`flex-shrink-0 ${meta.color}`}>{meta.icon}</span>
                        <span className="min-w-0 flex-1 truncate text-[12px] text-navy">{item.label}</span>
                        <span className="flex-shrink-0 truncate text-[10px] text-slate-400" dir="ltr">{item.href}</span>
                        {item.status === 'draft' && (
                          <span className="rounded-full bg-slate-100 px-1.5 py-px text-[8px] font-semibold text-slate-500">טיוטה</span>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })}

              {/* Empty state */}
              {!isCustomUrl && filtered.length === 0 && !loading && (
                <div className="px-4 py-6 text-center">
                  <LinkIcon className="mx-auto mb-1.5 h-5 w-5 text-slate-300" />
                  <p className="text-[11px] text-slate-400">
                    {query ? 'לא נמצאו תוצאות' : 'אין עמודים עדיין'}
                  </p>
                  {query && (
                    <p className="mt-1 text-[10px] text-slate-300">
                      התחילו עם <span dir="ltr" className="font-mono text-slate-400">/</span> או <span dir="ltr" className="font-mono text-slate-400">#</span> לקישור מותאם
                    </p>
                  )}
                </div>
              )}

              {/* Quick anchors */}
              {!query && (
                <div className="border-t border-slate-100 p-1.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1">
                    <Hash className="h-3 w-3 text-slate-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">עוגנים</span>
                  </div>
                  {['#contact', '#services', '#about', '#top'].map((anchor) => (
                    <button
                      key={anchor}
                      type="button"
                      onClick={() => handleSelect(anchor)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-right transition-colors hover:bg-ocean-bg cursor-pointer ${value === anchor ? 'bg-ocean-bg' : ''}`}
                    >
                      <Hash className="h-3 w-3 flex-shrink-0 text-slate-400" />
                      <span className="text-[12px] text-navy" dir="ltr">{anchor}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
