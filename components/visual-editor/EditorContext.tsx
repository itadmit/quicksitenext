'use client';

import { createContext, useContext } from 'react';
import type { Block, BlockType } from '@/lib/block-registry';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type PageMeta = {
  title: string;
  slug: string;
  status: string;
  seoTitle: string;
  seoDescription: string;
};

export type DragState = {
  dragIndex: number;
  overIndex: number;
} | null;

export type EditorContextType = {
  blocks: Block[];
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  selectAndScrollToBlock: (id: string) => void;
  hoveredBlockId: string | null;
  setHoveredBlockId: (id: string | null) => void;
  updateBlock: (id: string, data: Record<string, unknown>) => void;
  removeBlock: (id: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  addBlock: (type: BlockType, atIndex: number) => void;
  duplicateBlock: (id: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveStatus: SaveStatus;
  triggerSave: () => void;
  device: DeviceMode;
  setDevice: (d: DeviceMode) => void;
  zoom: number;
  setZoom: (z: number | ((prev: number) => number)) => void;
  openImagePicker: (onSelect: (url: string) => void) => void;
  pageId: string;
  pageMeta: PageMeta;
  setPageMeta: (meta: PageMeta) => void;
  dragState: DragState;
  setDragState: (state: DragState) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
};

export const EditorContext = createContext<EditorContextType | null>(null);

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorContext');
  return ctx;
}

export function useEditorSafe() {
  return useContext(EditorContext);
}
