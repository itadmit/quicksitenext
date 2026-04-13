'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  defaultBlockData,
  type Block,
  type BlockType,
} from '@/lib/block-registry';
import { autoSaveAction } from '@/app/dashboard/pages/[id]/visual/actions';
import { EditorContext, type DeviceMode, type SaveStatus, type PageMeta, type DragState } from './EditorContext';
import { useEditorHistory } from './useEditorHistory';
import EditorToolbar from './EditorToolbar';
import EditorCanvas from './EditorCanvas';
import PropertiesPanel from './PropertiesPanel';
import LayersPanel from './LayersPanel';
import ImagePicker from './ImagePicker';

type TenantSettings = {
  siteName: string;
  primaryColor: string;
  logoUrl: string | null;
};

type Props = {
  pageId: string;
  initialBlocks: Block[];
  pageMeta: PageMeta;
  tenantSettings: TenantSettings;
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function VisualEditor({ pageId, initialBlocks, pageMeta: initialMeta, tenantSettings }: Props) {
  const { blocks, pushState, undo, redo, canUndo, canRedo } = useEditorHistory(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [zoom, setZoom] = useState(100);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [pageMeta, setPageMeta] = useState<PageMeta>(initialMeta);
  const [dragState, setDragState] = useState<DragState>(null);

  const [imagePickerCallback, setImagePickerCallback] = useState<((url: string) => void) | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blocksRef = useRef(blocks);
  const canvasRef = useRef<HTMLDivElement>(null);
  blocksRef.current = blocks;

  const scrollToBlockElement = useCallback((blockId: string) => {
    const el = canvasRef.current?.querySelector(`[data-block-id="${blockId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const selectAndScrollToBlock = useCallback((id: string) => {
    setSelectedBlockId(id);
    setTimeout(() => scrollToBlockElement(id), 50);
  }, [scrollToBlockElement]);

  const doSave = useCallback(async (blocksToSave: Block[]) => {
    setSaveStatus('saving');
    try {
      const result = await autoSaveAction(pageId, JSON.stringify(blocksToSave));
      setSaveStatus(result.success ? 'saved' : 'error');
      if (result.success) {
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch {
      setSaveStatus('error');
    }
  }, [pageId]);

  const scheduleSave = useCallback((newBlocks: Block[]) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => doSave(newBlocks), 2000);
  }, [doSave]);

  const triggerSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    doSave(blocksRef.current);
  }, [doSave]);

  const updateBlock = useCallback((id: string, data: Record<string, unknown>) => {
    const newBlocks = blocksRef.current.map((b) => (b.id === id ? { ...b, data } : b));
    pushState(newBlocks);
    scheduleSave(newBlocks);
  }, [pushState, scheduleSave]);

  const removeBlock = useCallback((id: string) => {
    const idx = blocksRef.current.findIndex((b) => b.id === id);
    const newBlocks = blocksRef.current.filter((b) => b.id !== id);
    pushState(newBlocks);
    scheduleSave(newBlocks);
    if (selectedBlockId === id) {
      const next = newBlocks[idx] || newBlocks[idx - 1] || null;
      setSelectedBlockId(next?.id ?? null);
    }
  }, [pushState, scheduleSave, selectedBlockId]);

  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocksRef.current.length) return;
    const newBlocks = [...blocksRef.current];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, moved);
    pushState(newBlocks);
    scheduleSave(newBlocks);
  }, [pushState, scheduleSave]);

  const addBlock = useCallback((type: BlockType, atIndex: number) => {
    const newBlock: Block = { id: genId(), type, data: defaultBlockData(type) };
    const newBlocks = [...blocksRef.current];
    newBlocks.splice(atIndex, 0, newBlock);
    pushState(newBlocks);
    scheduleSave(newBlocks);
    setSelectedBlockId(newBlock.id);
    setTimeout(() => scrollToBlockElement(newBlock.id), 100);
  }, [pushState, scheduleSave, scrollToBlockElement]);

  const duplicateBlock = useCallback((id: string) => {
    const idx = blocksRef.current.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const source = blocksRef.current[idx];
    const newBlock: Block = { id: genId(), type: source.type, data: { ...source.data } };
    const newBlocks = [...blocksRef.current];
    newBlocks.splice(idx + 1, 0, newBlock);
    pushState(newBlocks);
    scheduleSave(newBlocks);
    setSelectedBlockId(newBlock.id);
    setTimeout(() => scrollToBlockElement(newBlock.id), 100);
  }, [pushState, scheduleSave, scrollToBlockElement]);

  const openImagePicker = useCallback((onSelect: (url: string) => void) => {
    setImagePickerCallback(() => onSelect);
  }, []);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -5 : 5;
        setZoom((z) => Math.min(200, Math.max(25, z + delta)));
      }
    };
    canvasEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvasEl.removeEventListener('wheel', handleWheel);
  }, [setZoom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement)?.isContentEditable;

      if (isMeta && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (isMeta && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if (isMeta && e.key === 's') {
        e.preventDefault();
        triggerSave();
      }
      if (e.key === 'Escape') {
        setSelectedBlockId(null);
      }

      if (isInput) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBlockId) {
        e.preventDefault();
        removeBlock(selectedBlockId);
      }

      if (isMeta && e.key === 'd' && selectedBlockId) {
        e.preventDefault();
        duplicateBlock(selectedBlockId);
      }

      if (e.key === 'ArrowUp' && selectedBlockId) {
        e.preventDefault();
        const idx = blocksRef.current.findIndex((b) => b.id === selectedBlockId);
        if (idx > 0) {
          const prevId = blocksRef.current[idx - 1].id;
          selectAndScrollToBlock(prevId);
        }
      }
      if (e.key === 'ArrowDown' && selectedBlockId) {
        e.preventDefault();
        const idx = blocksRef.current.findIndex((b) => b.id === selectedBlockId);
        if (idx < blocksRef.current.length - 1) {
          const nextId = blocksRef.current[idx + 1].id;
          selectAndScrollToBlock(nextId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, triggerSave, selectedBlockId, removeBlock, duplicateBlock, selectAndScrollToBlock]);

  const contextValue = {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    selectAndScrollToBlock,
    hoveredBlockId,
    setHoveredBlockId,
    updateBlock,
    removeBlock,
    moveBlock,
    addBlock,
    duplicateBlock,
    undo,
    redo,
    canUndo,
    canRedo,
    saveStatus,
    triggerSave,
    device,
    setDevice,
    zoom,
    setZoom,
    openImagePicker,
    pageId,
    pageMeta,
    setPageMeta,
    dragState,
    setDragState,
    canvasRef,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      <div className="fixed inset-0 z-[60] flex flex-col bg-[#f0f0f0]">
        <EditorToolbar tenantSettings={tenantSettings} />

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel - Layers */}
          <div
            className={`flex-shrink-0 border-l border-slate-200/80 bg-white transition-all duration-200 ease-out ${
              leftPanelOpen ? 'w-56' : 'w-0'
            } overflow-hidden`}
          >
            <LayersPanel onToggle={() => setLeftPanelOpen(false)} />
          </div>

          {/* Toggle left panel */}
          <button
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="flex h-7 w-4 flex-shrink-0 items-center justify-center self-center rounded-l bg-white/80 text-slate-400 transition-colors hover:bg-white hover:text-navy cursor-pointer"
            title={leftPanelOpen ? 'הסתר שכבות' : 'הצג שכבות'}
          >
            <svg className={`h-2.5 w-2.5 transition-transform ${leftPanelOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Canvas */}
          <EditorCanvas tenantSettings={tenantSettings} />

          {/* Toggle right panel */}
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="flex h-7 w-4 flex-shrink-0 items-center justify-center self-center rounded-r bg-white/80 text-slate-400 transition-colors hover:bg-white hover:text-navy cursor-pointer"
            title={rightPanelOpen ? 'הסתר נכסים' : 'הצג נכסים'}
          >
            <svg className={`h-2.5 w-2.5 transition-transform ${rightPanelOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right panel - Properties */}
          <div
            className={`flex-shrink-0 border-r border-slate-200/80 bg-white transition-all duration-200 ease-out ${
              rightPanelOpen ? 'w-72' : 'w-0'
            } overflow-hidden`}
          >
            <PropertiesPanel />
          </div>
        </div>

        {/* Image Picker Modal */}
        {imagePickerCallback && (
          <ImagePicker
            onSelect={(url) => {
              imagePickerCallback(url);
              setImagePickerCallback(null);
            }}
            onClose={() => setImagePickerCallback(null)}
          />
        )}
      </div>
    </EditorContext.Provider>
  );
}
