'use client';

import { useState, useTransition, useCallback } from 'react';
import {
  blockTypes,
  blockLabels,
  defaultBlockData,
  type Block,
  type BlockType,
} from '@/lib/block-registry';
import { savePageAction, updatePageMetaAction, deletePageAction } from '@/app/dashboard/pages/[id]/actions';

import HeroBlockEditor from './blocks/HeroBlockEditor';
import TextBlockEditor from './blocks/TextBlockEditor';
import ImageBlockEditor from './blocks/ImageBlockEditor';
import CtaBlockEditor from './blocks/CtaBlockEditor';
import ContactFormBlockEditor from './blocks/ContactFormBlockEditor';
import SpacerBlockEditor from './blocks/SpacerBlockEditor';
import HtmlBlockEditor from './blocks/HtmlBlockEditor';
import PostsGridBlockEditor from './blocks/PostsGridBlockEditor';
import GalleryBlockEditor from './blocks/GalleryBlockEditor';
import AboutBlockEditor from './blocks/AboutBlockEditor';
import TeamGridBlockEditor from './blocks/TeamGridBlockEditor';
import ServicesGridBlockEditor from './blocks/ServicesGridBlockEditor';
import QuoteBlockEditor from './blocks/QuoteBlockEditor';

type PageMeta = {
  title: string;
  slug: string;
  status: string;
  seoTitle: string;
  seoDescription: string;
};

type Props = {
  pageId: string;
  initialBlocks: Block[];
  pageMeta: PageMeta;
};

const blockEditors: Record<string, React.ComponentType<{ data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }>> = {
  hero: HeroBlockEditor,
  text: TextBlockEditor,
  image: ImageBlockEditor,
  gallery: GalleryBlockEditor,
  cta: CtaBlockEditor,
  contactForm: ContactFormBlockEditor,
  spacer: SpacerBlockEditor,
  html: HtmlBlockEditor,
  postsGrid: PostsGridBlockEditor,
  about: AboutBlockEditor,
  teamGrid: TeamGridBlockEditor,
  servicesGrid: ServicesGridBlockEditor,
  quote: QuoteBlockEditor,
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function BlockEditor({ pageId, initialBlocks, pageMeta }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [meta, setMeta] = useState<PageMeta>(pageMeta);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isPending, startTransition] = useTransition();

  const updateBlock = useCallback((id: string, data: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, data } : b)));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const moveBlock = useCallback((index: number, direction: -1 | 1) => {
    setBlocks((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const addBlock = useCallback((type: BlockType) => {
    const newBlock: Block = {
      id: genId(),
      type,
      data: defaultBlockData(type),
    };
    setBlocks((prev) => [...prev, newBlock]);
    setShowAddMenu(false);
  }, []);

  const handleSave = () => {
    setSaveStatus('saving');
    startTransition(async () => {
      const result = await savePageAction(pageId, JSON.stringify(blocks));
      setSaveStatus(result.success ? 'saved' : 'error');
      if (result.success) {
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    });
  };

  const [metaError, setMetaError] = useState<string | null>(null);

  const handleMetaSave = () => {
    setMetaError(null);
    startTransition(async () => {
      const result = await updatePageMetaAction(pageId, meta);
      if (result.success) {
        setShowMeta(false);
      } else {
        setMetaError(result.error || 'שגיאה בשמירת ההגדרות');
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deletePageAction(pageId);
    });
  };

  const saveLabel =
    saveStatus === 'saving' ? 'שומר...' :
    saveStatus === 'saved' ? 'נשמר ✓' :
    saveStatus === 'error' ? 'שגיאה' : 'שמור';

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="bg-ocean rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-ocean/85 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saveLabel}
        </button>
        <button
          onClick={() => setShowMeta(!showMeta)}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy hover:border-ocean hover:text-ocean transition-colors cursor-pointer"
        >
          הגדרות עמוד
        </button>
        <button
          onClick={() => setShowDelete(!showDelete)}
          className="mr-auto rounded-full border border-red-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600 hover:border-red-400 transition-colors cursor-pointer"
        >
          מחיקה
        </button>
      </div>

      {/* Delete confirmation */}
      {showDelete && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="mb-3 text-sm text-red-700">האם למחוק את העמוד? פעולה זו אינה הפיכה.</p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-600 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              מחק סופית
            </button>
            <button
              onClick={() => setShowDelete(false)}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy cursor-pointer"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Meta editor */}
      {showMeta && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-noto text-lg font-bold text-navy">הגדרות עמוד</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">כותרת</label>
              <input
                value={meta.title}
                onChange={(e) => setMeta({ ...meta, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/20 transition-colors"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">נתיב</label>
              <input
                value={meta.slug}
                onChange={(e) => setMeta({ ...meta, slug: e.target.value })}
                dir="ltr"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-mono text-navy outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/20 transition-colors"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">סטטוס</label>
              <select
                value={meta.status}
                onChange={(e) => setMeta({ ...meta, status: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/20 transition-colors cursor-pointer"
              >
                <option value="draft">טיוטה</option>
                <option value="published">פורסם</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">כותרת SEO</label>
            <input
              value={meta.seoTitle}
              onChange={(e) => setMeta({ ...meta, seoTitle: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/20 transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">תיאור SEO</label>
            <textarea
              value={meta.seoDescription}
              onChange={(e) => setMeta({ ...meta, seoDescription: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/20 transition-colors resize-none"
            />
          </div>
          {metaError && <p className="text-sm text-red-600">{metaError}</p>}
          <button
            onClick={handleMetaSave}
            disabled={isPending}
            className="bg-ocean rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-ocean/85 transition-colors disabled:opacity-50 cursor-pointer"
          >
            שמור הגדרות
          </button>
        </div>
      )}

      {/* Blocks */}
      <div className="space-y-3">
        {blocks.map((block, index) => {
          const Editor = blockEditors[block.type];
          return (
            <div key={block.id} className="rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 rounded-t-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {blockLabels[block.type as BlockType] ?? block.type}
                </span>
                <div className="mr-auto flex items-center gap-1">
                  <button
                    onClick={() => moveBlock(index, -1)}
                    disabled={index === 0}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-navy disabled:opacity-30 transition-colors cursor-pointer"
                    title="הזז למעלה"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  </button>
                  <button
                    onClick={() => moveBlock(index, 1)}
                    disabled={index === blocks.length - 1}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-navy disabled:opacity-30 transition-colors cursor-pointer"
                    title="הזז למטה"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                  </button>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-100 text-red-400 hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer"
                    title="הסר בלוק"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                {Editor ? (
                  <Editor data={block.data} onChange={(data) => updateBlock(block.id, data)} />
                ) : (
                  <p className="text-sm text-slate-400">אין עורך לסוג בלוק זה</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add block */}
      <div className="relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 hover:border-ocean hover:text-ocean transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          הוסף בלוק
        </button>
        {showAddMenu && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
            {blockTypes.map((type) => (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="rounded-lg px-3 py-2.5 text-right text-sm text-navy hover:bg-ocean/[0.04] hover:text-ocean transition-colors cursor-pointer"
              >
                {blockLabels[type]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
