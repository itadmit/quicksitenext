'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Plus, Type, Image as ImageIcon, Layout, MessageSquareQuote,
  FileText, Grid3X3, Users, Briefcase, Mail, Code, Minus,
  Rows3, Search,
} from 'lucide-react';
import { blockLabels, type BlockType } from '@/lib/block-registry';
import { useEditor } from './EditorContext';

type Props = {
  index: number;
};

type BlockCategory = {
  label: string;
  types: BlockType[];
};

const BLOCK_CATEGORIES: BlockCategory[] = [
  { label: 'פריסה', types: ['hero', 'spacer'] },
  { label: 'תוכן', types: ['text', 'quote', 'about', 'html'] },
  { label: 'מדיה', types: ['image', 'gallery'] },
  { label: 'פעולה', types: ['cta', 'contactForm'] },
  { label: 'נתונים', types: ['postsGrid', 'teamGrid', 'servicesGrid'] },
];

const BLOCK_ICONS: Record<string, React.ReactNode> = {
  hero: <Layout className="h-4 w-4" />,
  text: <Type className="h-4 w-4" />,
  image: <ImageIcon className="h-4 w-4" />,
  gallery: <Grid3X3 className="h-4 w-4" />,
  cta: <Rows3 className="h-4 w-4" />,
  contactForm: <Mail className="h-4 w-4" />,
  spacer: <Minus className="h-4 w-4" />,
  html: <Code className="h-4 w-4" />,
  postsGrid: <FileText className="h-4 w-4" />,
  about: <Briefcase className="h-4 w-4" />,
  teamGrid: <Users className="h-4 w-4" />,
  servicesGrid: <Grid3X3 className="h-4 w-4" />,
  quote: <MessageSquareQuote className="h-4 w-4" />,
};

export default function BlockInserter({ index }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { addBlock } = useEditor();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSearch('');
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const handleAdd = (type: BlockType) => {
    addBlock(type, index);
    setOpen(false);
  };

  const filteredCategories = BLOCK_CATEGORIES.map((cat) => ({
    ...cat,
    types: cat.types.filter((t) =>
      blockLabels[t].includes(search) || t.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.types.length > 0);

  return (
    <div className="group relative flex items-center justify-center py-[3px]">
      <div className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-transparent transition-colors group-hover:bg-ocean/20" />

      <button
        onClick={() => setOpen(!open)}
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md transition-all cursor-pointer ${
          open
            ? 'rotate-45 scale-110 bg-slate-400'
            : 'bg-ocean opacity-0 hover:scale-110 group-hover:opacity-100'
        }`}
        title="הוסף בלוק"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full z-40 mt-2 w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/[0.04]">
            {/* Search */}
            <div className="border-b border-slate-100 px-3 py-2">
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5">
                <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="חפשו בלוק..."
                  className="w-full bg-transparent text-xs text-navy outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="max-h-[320px] overflow-auto p-1.5">
              {filteredCategories.map((cat) => (
                <div key={cat.label} className="mb-1.5">
                  <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    {cat.label}
                  </div>
                  {cat.types.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleAdd(type)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-navy hover:bg-ocean/[0.05] hover:text-ocean transition-colors cursor-pointer"
                    >
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-400">
                        {BLOCK_ICONS[type]}
                      </span>
                      <span className="text-[12px] font-medium">{blockLabels[type]}</span>
                    </button>
                  ))}
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <p className="py-6 text-center text-xs text-slate-400">לא נמצאו בלוקים</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
