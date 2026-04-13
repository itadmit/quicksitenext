'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { GripVertical, Copy, Trash2, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import { blockLabels, type BlockType } from '@/lib/block-registry';
import { useEditor } from './EditorContext';

type Props = {
  blockId: string;
  index: number;
  children: React.ReactNode;
};

function clampMenuPosition(x: number, y: number, menuWidth = 180, menuHeight = 220) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 720;
  return {
    x: Math.min(x, vw - menuWidth - 8),
    y: Math.min(y, vh - menuHeight - 8),
  };
}

export default function BlockWrapper({ blockId, index, children }: Props) {
  const {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    hoveredBlockId,
    setHoveredBlockId,
    moveBlock,
    removeBlock,
    duplicateBlock,
    dragState,
    setDragState,
  } = useEditor();

  const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isSelected = selectedBlockId === blockId;
  const isHovered = hoveredBlockId === blockId && !isSelected;
  const block = blocks.find((b) => b.id === blockId);
  const blockLabel = block ? (blockLabels[block.type as BlockType] ?? block.type) : '';
  const isDragOver = dragState?.overIndex === index;

  useEffect(() => {
    if (!showContextMenu) return;
    const close = () => setShowContextMenu(null);
    window.addEventListener('scroll', close, true);
    return () => window.removeEventListener('scroll', close, true);
  }, [showContextMenu]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-select]')) return;
    setSelectedBlockId(blockId);
  }, [blockId, setSelectedBlockId]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const clamped = clampMenuPosition(e.clientX, e.clientY);
    setShowContextMenu(clamped);
    setSelectedBlockId(blockId);
  }, [blockId, setSelectedBlockId]);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
    setDragState({ dragIndex: index, overIndex: -1 });
  }, [index, setDragState]);

  const handleDragEnd = useCallback(() => {
    setDragState(null);
  }, [setDragState]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragState && dragState.overIndex !== index) {
      setDragState({ ...dragState, overIndex: index });
    }
  }, [index, dragState, setDragState]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIndex) && fromIndex !== index) {
      moveBlock(fromIndex, index);
    }
    setDragState(null);
  }, [index, moveBlock, setDragState]);

  const menuAction = useCallback((fn: () => void) => {
    fn();
    setShowContextMenu(null);
  }, []);

  return (
    <>
      {/* Drop indicator line */}
      {isDragOver && dragState && dragState.dragIndex !== index && (
        <div className="relative z-30 mx-4">
          <div className="h-0.5 rounded-full bg-ocean shadow-[0_0_8px_rgba(99,91,255,0.4)]" />
          <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-ocean bg-white" />
          <div className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-ocean bg-white" />
        </div>
      )}

      <div
        ref={wrapperRef}
        data-block-id={blockId}
        className={`group/block relative transition-all duration-100 ${
          isSelected
            ? 'ring-2 ring-ocean'
            : isHovered
            ? 'ring-1 ring-ocean/25'
            : ''
        }`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setHoveredBlockId(blockId)}
        onMouseLeave={() => setHoveredBlockId(null)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Block label */}
        {(isHovered || isSelected) && (
          <div
            className={`absolute right-0 z-20 flex items-center gap-1 px-2 py-[3px] pointer-events-none ${
              index === 0
                ? 'top-0 rounded-bl'
                : '-top-[22px] rounded-t'
            } ${isSelected ? 'bg-ocean' : 'bg-ocean/60'}`}
          >
            <span className="text-[10px] font-semibold leading-none text-white">{blockLabel}</span>
            <span className="text-[9px] text-white/60">#{index + 1}</span>
          </div>
        )}

        {/* Floating action bar */}
        {isSelected && (
          <div className="absolute right-2 top-2 z-30 flex items-center gap-px rounded-lg bg-white p-0.5 shadow-lg ring-1 ring-black/[0.08] backdrop-blur-sm" data-no-select>
            <ActionBtn
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              title="גרור לסידור מחדש"
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </ActionBtn>
            <Divider />
            <ActionBtn onClick={() => moveBlock(index, index - 1)} disabled={index === 0} title="הזז למעלה">
              <ArrowUp className="h-3.5 w-3.5" />
            </ActionBtn>
            <ActionBtn onClick={() => moveBlock(index, index + 1)} disabled={index === blocks.length - 1} title="הזז למטה">
              <ArrowDown className="h-3.5 w-3.5" />
            </ActionBtn>
            <Divider />
            <ActionBtn onClick={() => duplicateBlock(blockId)} title="שכפל (⌘D)" hoverColor="ocean">
              <Copy className="h-3.5 w-3.5" />
            </ActionBtn>
            <ActionBtn onClick={() => removeBlock(blockId)} title="מחק" hoverColor="red">
              <Trash2 className="h-3.5 w-3.5" />
            </ActionBtn>
          </div>
        )}

        {children}
      </div>

      {/* ─── Context menu ─── */}
      {showContextMenu && (
        <>
          <div className="fixed inset-0 z-[65]" onClick={() => setShowContextMenu(null)} />
          <div
            ref={menuRef}
            className="fixed z-[66] w-[200px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-black/[0.04]"
            style={{ top: showContextMenu.y, left: showContextMenu.x }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-ocean/10">
                <MoreHorizontal className="h-3 w-3 text-ocean" />
              </div>
              <span className="text-[12px] font-semibold text-navy">{blockLabel}</span>
              <span className="text-[9px] text-slate-400">#{index + 1}</span>
            </div>

            <div className="py-1">
              <ContextMenuItem
                onClick={() => menuAction(() => moveBlock(index, index - 1))}
                disabled={index === 0}
                icon={<ArrowUp className="h-3.5 w-3.5" />}
                label="הזז למעלה"
              />
              <ContextMenuItem
                onClick={() => menuAction(() => moveBlock(index, index + 1))}
                disabled={index === blocks.length - 1}
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                label="הזז למטה"
              />
            </div>

            <div className="border-t border-slate-100" />

            <div className="py-1">
              <ContextMenuItem
                onClick={() => menuAction(() => duplicateBlock(blockId))}
                icon={<Copy className="h-3.5 w-3.5" />}
                label="שכפל"
                shortcut="⌘D"
              />
              <ContextMenuItem
                onClick={() => menuAction(() => removeBlock(blockId))}
                icon={<Trash2 className="h-3.5 w-3.5" />}
                label="מחק"
                shortcut="Del"
                variant="danger"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ActionBtn({
  children,
  onClick,
  disabled,
  title,
  hoverColor,
  className = '',
  draggable,
  onDragStart,
  onDragEnd,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title: string;
  hoverColor?: 'ocean' | 'red';
  className?: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}) {
  const hoverClass =
    hoverColor === 'red'
      ? 'hover:bg-red-50 hover:text-red-500'
      : hoverColor === 'ocean'
      ? 'hover:bg-ocean/[0.06] hover:text-ocean'
      : 'hover:bg-slate-100 hover:text-navy';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`flex h-7 w-7 items-center justify-center rounded-md text-slate-400 disabled:opacity-25 transition-colors cursor-pointer ${hoverClass} ${className}`}
      title={title}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-px h-4 w-px bg-slate-200" />;
}

function ContextMenuItem({
  onClick,
  disabled,
  icon,
  label,
  shortcut,
  variant,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  variant?: 'danger';
}) {
  const color = variant === 'danger'
    ? 'text-red-600 hover:bg-red-50'
    : 'text-navy hover:bg-slate-50';
  const iconColor = variant === 'danger' ? '' : 'text-slate-400';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-2.5 px-3 py-[7px] text-[12px] transition-colors disabled:opacity-30 cursor-pointer ${color}`}
    >
      <span className={iconColor}>{icon}</span>
      <span className="font-medium">{label}</span>
      {shortcut && (
        <kbd className={`mr-auto rounded border border-slate-200 bg-slate-50 px-1 py-px text-[9px] font-mono ${
          variant === 'danger' ? 'border-red-200 bg-red-50 text-red-400' : 'text-slate-400'
        }`} dir="ltr">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}
