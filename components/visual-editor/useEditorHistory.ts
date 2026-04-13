'use client';

import { useState, useCallback, useRef } from 'react';
import type { Block } from '@/lib/block-registry';

const MAX_HISTORY = 50;

export function useEditorHistory(initialBlocks: Block[]) {
  const [history, setHistory] = useState<Block[][]>([initialBlocks]);
  const [pointer, setPointer] = useState(0);
  const batchRef = useRef(false);

  const blocks = history[pointer];

  const pushState = useCallback((newBlocks: Block[]) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, pointer + 1);
      trimmed.push(newBlocks);
      if (trimmed.length > MAX_HISTORY) trimmed.shift();
      return trimmed;
    });
    setPointer((prev) => {
      const next = prev + 1;
      return next >= MAX_HISTORY ? MAX_HISTORY - 1 : next;
    });
  }, [pointer]);

  const undo = useCallback(() => {
    setPointer((p) => (p > 0 ? p - 1 : p));
  }, []);

  const redo = useCallback(() => {
    setPointer((p) => {
      return p < history.length - 1 ? p + 1 : p;
    });
  }, [history.length]);

  const canUndo = pointer > 0;
  const canRedo = pointer < history.length - 1;

  return { blocks, pushState, undo, redo, canUndo, canRedo, batchRef };
}
