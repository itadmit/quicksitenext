'use client';

import {
  Copy, Trash2, MousePointerClick, SlidersHorizontal,
  Layout, Type, Image as ImageIcon, Grid3X3, Rows3, Mail,
  Minus, Code, FileText, Briefcase, Users, MessageSquareQuote, Package,
} from 'lucide-react';
import { blockLabels, type BlockType } from '@/lib/block-registry';
import { useEditor } from './EditorContext';

import HeroBlockEditor from '@/components/dashboard/blocks/HeroBlockEditor';
import TextBlockEditor from '@/components/dashboard/blocks/TextBlockEditor';
import ImageBlockEditor from '@/components/dashboard/blocks/ImageBlockEditor';
import CtaBlockEditor from '@/components/dashboard/blocks/CtaBlockEditor';
import ContactFormBlockEditor from '@/components/dashboard/blocks/ContactFormBlockEditor';
import SpacerBlockEditor from '@/components/dashboard/blocks/SpacerBlockEditor';
import HtmlBlockEditor from '@/components/dashboard/blocks/HtmlBlockEditor';
import PostsGridBlockEditor from '@/components/dashboard/blocks/PostsGridBlockEditor';
import GalleryBlockEditor from '@/components/dashboard/blocks/GalleryBlockEditor';
import AboutBlockEditor from '@/components/dashboard/blocks/AboutBlockEditor';
import TeamGridBlockEditor from '@/components/dashboard/blocks/TeamGridBlockEditor';
import ServicesGridBlockEditor from '@/components/dashboard/blocks/ServicesGridBlockEditor';
import QuoteBlockEditor from '@/components/dashboard/blocks/QuoteBlockEditor';

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

export default function PropertiesPanel() {
  const { blocks, selectedBlockId, updateBlock, duplicateBlock, removeBlock } = useEditor();

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
          <MousePointerClick className="h-5 w-5 text-slate-300" />
        </div>
        <p className="text-sm font-medium text-slate-400">בחרו בלוק לעריכה</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
          לחצו על בלוק בקנבס או בשכבות<br />כדי לערוך את המאפיינים שלו
        </p>
      </div>
    );
  }

  const Editor = blockEditors[selectedBlock.type];
  const label = blockLabels[selectedBlock.type as BlockType] ?? selectedBlock.type;
  const icon = BLOCK_ICONS[selectedBlock.type] || <Package className="h-4 w-4" />;
  const blockIndex = blocks.findIndex((b) => b.id === selectedBlockId);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean/[0.08] text-ocean">
            {icon}
          </div>
          <div>
            <h3 className="text-[12px] font-bold text-navy">{label}</h3>
            <span className="text-[10px] text-slate-400">#{blockIndex + 1}</span>
          </div>
        </div>
        <div className="flex gap-0.5">
          <button
            onClick={() => duplicateBlock(selectedBlock.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-ocean transition-colors cursor-pointer"
            title="שכפל"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => removeBlock(selectedBlock.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
            title="מחק"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Section label */}
      <div className="flex items-center gap-1.5 border-b border-slate-50 px-4 py-2">
        <SlidersHorizontal className="h-3 w-3 text-slate-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">מאפיינים</span>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto p-4">
        {Editor ? (
          <Editor
            data={selectedBlock.data}
            onChange={(data) => updateBlock(selectedBlock.id, data)}
          />
        ) : (
          <p className="text-sm text-slate-400">אין עורך מאפיינים לבלוק זה</p>
        )}
      </div>
    </div>
  );
}
