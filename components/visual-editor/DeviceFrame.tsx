'use client';

import { useEditor } from './EditorContext';
import { Lock, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

type Props = {
  children: React.ReactNode;
};

const DEVICE_WIDTHS = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

export default function DeviceFrame({ children }: Props) {
  const { device, pageMeta } = useEditor();
  const width = DEVICE_WIDTHS[device];
  const displayUrl = `${pageMeta.slug === 'home' ? '' : pageMeta.slug}`;

  return (
    <div
      className="overflow-hidden bg-white transition-all duration-300"
      style={{
        width: `${width}px`,
        borderRadius: device === 'mobile' ? '2.5rem' : device === 'tablet' ? '1.5rem' : '0.75rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
      }}
    >
      {/* Mobile notch */}
      {device === 'mobile' && (
        <div className="relative flex items-center justify-center bg-white pt-2 pb-1">
          <div className="h-[26px] w-[120px] rounded-full bg-black" />
        </div>
      )}

      {/* Browser chrome */}
      <div className={`flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 ${
        device === 'mobile' ? 'px-3 py-1.5' : 'px-3 py-2'
      }`}>
        {device !== 'mobile' && (
          <div className="flex gap-1.5">
            <div className="h-[10px] w-[10px] rounded-full bg-[#FF5F57]" />
            <div className="h-[10px] w-[10px] rounded-full bg-[#FEBC2E]" />
            <div className="h-[10px] w-[10px] rounded-full bg-[#28C840]" />
          </div>
        )}

        {device !== 'mobile' && (
          <div className="flex items-center gap-0.5 px-1">
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <ChevronLeft className="h-3 w-3 text-slate-300" />
            <RotateCw className="mr-1 h-2.5 w-2.5 text-slate-300" />
          </div>
        )}

        <div className={`flex flex-1 items-center justify-center gap-1.5 rounded-md bg-white/80 ${
          device === 'mobile' ? 'px-3 py-1' : 'px-3 py-[5px]'
        }`}>
          <Lock className="h-2.5 w-2.5 text-slate-400" />
          <span className="text-[10px] font-medium text-slate-500" dir="ltr">
            yoursite.com/{displayUrl}
          </span>
        </div>

        {device !== 'mobile' && <div className="w-[52px]" />}
      </div>

      {/* Content */}
      <div className="overflow-visible">
        {children}
      </div>

      {/* Mobile home indicator */}
      {device === 'mobile' && (
        <div className="flex items-center justify-center bg-white pb-2 pt-1">
          <div className="h-1 w-[100px] rounded-full bg-slate-300" />
        </div>
      )}
    </div>
  );
}
