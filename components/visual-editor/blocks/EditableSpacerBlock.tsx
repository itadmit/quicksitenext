'use client';

import { useCallback, useRef } from 'react';
import { GripHorizontal } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function EditableSpacerBlock({ data, onChange }: Props) {
  const height = typeof data.height === 'number' ? data.height : 64;
  const dataRef = useRef(data);
  dataRef.current = data;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientY - startY;
      const newHeight = Math.max(16, Math.min(400, startHeight + diff));
      onChange({ ...dataRef.current, height: newHeight });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [height, onChange]);

  return (
    <div
      className="relative flex items-center justify-center border border-dashed border-transparent hover:border-slate-200 transition-colors"
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-slate-200/50" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-slate-200/50" />

      <div
        className="flex flex-col items-center gap-1 text-slate-300 hover:text-slate-500 transition-colors cursor-ns-resize"
        onMouseDown={handleMouseDown}
        data-no-select
      >
        <GripHorizontal className="h-4 w-4" />
        <span className="text-[10px] font-medium">{height}px</span>
      </div>
    </div>
  );
}
