'use client';

import { useState, useCallback } from 'react';
import {
  GripVertical,
  Layout,
  Type,
  Image as ImageIcon,
  Grid3X3,
  Rows3,
  Mail,
  Minus,
  Code,
  FileText,
  Briefcase,
  Users,
  MessageSquareQuote,
  Package,
  Layers,
  PanelLeftClose,
} from 'lucide-react';
import { blockLabels, type BlockType } from '@/lib/block-registry';
import { useEditor } from './EditorContext';

type Props = {
  onToggle: () => void;
};

const BLOCK_ICONS: Record<string, React.ReactNode> = {
  hero: <Layout className="h-3.5 w-3.5" />,
  text: <Type className="h-3.5 w-3.5" />,
  image: <ImageIcon className="h-3.5 w-3.5" />,
  gallery: <Grid3X3 className="h-3.5 w-3.5" />,
  cta: <Rows3 className="h-3.5 w-3.5" />,
  contactForm: <Mail className="h-3.5 w-3.5" />,
  spacer: <Minus className="h-3.5 w-3.5" />,
  html: <Code className="h-3.5 w-3.5" />,
  postsGrid: <FileText className="h-3.5 w-3.5" />,
  about: <Briefcase className="h-3.5 w-3.5" />,
  teamGrid: <Users className="h-3.5 w-3.5" />,
  servicesGrid: <Grid3X3 className="h-3.5 w-3.5" />,
  quote: <MessageSquareQuote className="h-3.5 w-3.5" />,
};

const FALLBACK_ICON = <Package className="h-3.5 w-3.5" />;

export default function LayersPanel({ onToggle }: Props) {
  const {
    blocks,
    selectedBlockId,
    selectAndScrollToBlock,
    hoveredBlockId,
    setHoveredBlockId,
    moveBlock,
  } = useEditor();

  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
    setDragFromIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIndex) && fromIndex !== index) {
      moveBlock(fromIndex, index);
    }
    setDragOverIndex(null);
    setDragFromIndex(null);
  }, [moveBlock]);

  const handleDragEnd = useCallback(() => {
    setDragOverIndex(null);
    setDragFromIndex(null);
  }, []);

  return (
    <div className="flex h-full w-64 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[12px] font-semibold text-navy">שכבות</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
            {blocks.length}
          </span>
        </div>
        <button
          onClick={onToggle}
          className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-50 hover:text-navy transition-colors cursor-pointer"
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Block list */}
      <div className="flex-1 overflow-auto">
        {blocks.map((block, index) => {
          const isSelected = selectedBlockId === block.id;
          const isHovered = hoveredBlockId === block.id;
          const label = blockLabels[block.type as BlockType] ?? block.type;
          const icon = BLOCK_ICONS[block.type] || FALLBACK_ICON;
          const isDragging = dragFromIndex === index;
          const showDropAbove = dragOverIndex === index && dragFromIndex !== null && dragFromIndex !== index;

          return (
            <div key={block.id}>
              {/* Drop indicator line */}
              {showDropAbove && (
                <div className="relative mx-2">
                  <div className="h-[2px] rounded-full bg-ocean" />
                </div>
              )}
              <div
                onClick={() => selectAndScrollToBlock(block.id)}
                onMouseEnter={() => setHoveredBlockId(block.id)}
                onMouseLeave={() => setHoveredBlockId(null)}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`group flex items-center gap-1.5 border-r-2 px-2 py-[7px] transition-all cursor-pointer ${
                  isDragging ? 'opacity-40' : ''
                } ${
                  isSelected
                    ? 'border-r-ocean bg-ocean/[0.06] text-ocean'
                    : isHovered
                    ? 'border-r-ocean/30 bg-slate-50/80 text-navy'
                    : 'border-r-transparent text-slate-500 hover:bg-slate-50/50'
                }`}
              >
                <GripVertical className="h-3 w-3 flex-shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 cursor-grab" />
                <span className={`flex-shrink-0 ${isSelected ? 'text-ocean' : 'text-slate-400'}`}>{icon}</span>
                <span className={`flex-1 truncate text-[12px] ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                  {label}
                </span>
                <span className="text-[9px] text-slate-300 opacity-0 group-hover:opacity-100">
                  #{index + 1}
                </span>
              </div>
            </div>
          );
        })}

        {blocks.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <Layers className="h-6 w-6 text-slate-200" />
            <p className="text-[12px] text-slate-400">העמוד ריק</p>
          </div>
        )}
      </div>
    </div>
  );
}
