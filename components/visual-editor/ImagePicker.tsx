'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Upload, Image as ImageIcon, Link as LinkIcon,
  Loader2, Check, Search, FolderOpen,
} from 'lucide-react';
import { fetchMediaItemsAction, uploadMediaFromEditorAction } from '@/app/dashboard/pages/[id]/visual/actions';

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  alt: string;
};

type Props = {
  onSelect: (url: string) => void;
  onClose: () => void;
};

export default function ImagePicker({ onSelect, onClose }: Props) {
  const [tab, setTab] = useState<'library' | 'upload' | 'url'>('library');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMediaItemsAction().then(({ items }) => {
      setItems(items as MediaItem[]);
      setLoading(false);
    });
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    setTab('upload');
    const fd = new FormData();
    fd.set('file', file);
    const result = await uploadMediaFromEditorAction(fd);
    setUploading(false);
    if (result.url) {
      onSelect(result.url);
    }
  }, [onSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const filteredItems = searchQuery
    ? items.filter((i) =>
        i.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.alt?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  const tabs = [
    { key: 'library' as const, label: 'ספריית מדיה', icon: <FolderOpen className="h-3.5 w-3.5" />, count: items.length },
    { key: 'upload' as const, label: 'העלאה', icon: <Upload className="h-3.5 w-3.5" /> },
    { key: 'url' as const, label: 'כתובת URL', icon: <LinkIcon className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-[2px]" onClick={onClose}>
      <div
        ref={dropZoneRef}
        className={`relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/[0.06] transition-all ${
          isDragging ? 'ring-2 ring-ocean ring-offset-2' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-ocean/[0.04] backdrop-blur-[1px]">
            <div className="rounded-2xl border-2 border-dashed border-ocean/40 bg-white/90 px-10 py-8 text-center shadow-lg">
              <Upload className="mx-auto mb-2 h-8 w-8 text-ocean" />
              <p className="text-sm font-semibold text-navy">שחררו כאן להעלאה</p>
              <p className="mt-0.5 text-[10px] text-slate-400">JPEG, PNG, GIF, WebP</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean/[0.08]">
              <ImageIcon className="h-4 w-4 text-ocean" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy">בחירת תמונה</h3>
              <p className="text-[10px] text-slate-400">בחרו מהספרייה, העלו או הדביקו URL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-navy transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-100 px-5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[12px] font-semibold transition-colors cursor-pointer ${
                tab === t.key
                  ? 'border-ocean text-ocean'
                  : 'border-transparent text-slate-400 hover:text-navy'
              }`}
            >
              {t.icon}
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`rounded-full px-1.5 py-px text-[9px] ${
                  tab === t.key ? 'bg-ocean/10 text-ocean' : 'bg-slate-100 text-slate-400'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="h-[420px] overflow-auto">
          {tab === 'library' && (
            <>
              {/* Search bar */}
              {items.length > 0 && (
                <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-4 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5">
                    <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="חפשו תמונה..."
                      className="w-full bg-transparent text-xs text-navy outline-none placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="flex-shrink-0 text-slate-400 hover:text-navy cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4">
                {loading ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-ocean/40" />
                      <p className="text-[12px] text-slate-400">טוען ספרייה...</p>
                    </div>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="flex h-64 flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <ImageIcon className="h-5 w-5 text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                      {searchQuery ? 'לא נמצאו תמונות' : 'אין תמונות בספרייה'}
                    </p>
                    <p className="mt-0.5 text-[12px] text-slate-400">
                      {searchQuery ? 'נסו חיפוש אחר' : 'העלו תמונה ראשונה'}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => setTab('upload')}
                        className="mt-3 rounded-full bg-ocean px-4 py-2 text-[12px] font-semibold text-white hover:bg-ocean/85 transition-colors cursor-pointer"
                      >
                        העלו תמונה
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {filteredItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSelect(item.url)}
                        className="group relative overflow-hidden rounded-lg border-2 border-transparent bg-slate-50 transition-all hover:border-ocean hover:shadow-md cursor-pointer"
                      >
                        <div className="aspect-square">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.url}
                            alt={item.alt || item.filename}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/25">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg opacity-0 transition-all group-hover:opacity-100 group-hover:scale-100 scale-75">
                            <Check className="h-4 w-4 text-ocean" />
                          </div>
                        </div>
                        {/* Filename */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-4 opacity-0 transition-opacity group-hover:opacity-100">
                          <p className="truncate text-[9px] font-medium text-white">{item.filename}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {tab === 'upload' && (
            <div className="flex h-full flex-col items-center justify-center p-8">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-[3px] border-slate-100" />
                    <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-ocean" />
                  </div>
                  <p className="text-sm font-medium text-navy">מעלה תמונה...</p>
                  <p className="text-[12px] text-slate-400">רק רגע</p>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 px-16 py-12 text-center transition-all hover:border-ocean/40 hover:bg-ocean/[0.02] cursor-pointer"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 transition-colors group-hover:bg-ocean/10">
                    <Upload className="h-6 w-6 text-slate-400 transition-colors group-hover:text-ocean" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">לחצו להעלאת תמונה</p>
                    <p className="mt-1 text-[12px] text-slate-400">או גררו תמונה לכל מקום בחלון</p>
                  </div>
                  <p className="text-[10px] text-slate-300">JPEG, PNG, GIF, WebP &middot; עד 5MB</p>
                </button>
              )}
            </div>
          )}

          {tab === 'url' && (
            <div className="flex h-full flex-col items-center justify-center gap-5 p-8">
              <div className="w-full max-w-md">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">
                  כתובת URL של תמונה
                </label>
                <div className="flex items-center rounded-lg border border-slate-200 bg-white focus-within:border-ocean focus-within:ring-1 focus-within:ring-ocean/30">
                  <span className="flex-shrink-0 border-l border-slate-200 px-2.5">
                    <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                  <input
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                    dir="ltr"
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-transparent px-3 py-3 text-sm text-navy outline-none placeholder:text-slate-300"
                    onKeyDown={(e) => { if (e.key === 'Enter' && urlValue) onSelect(urlValue); }}
                  />
                </div>
              </div>
              {urlValue && (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-36 w-36 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={urlValue}
                      alt="תצוגה מקדימה"
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <button
                    onClick={() => onSelect(urlValue)}
                    className="flex items-center gap-1.5 rounded-full bg-ocean px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-ocean/85 transition-colors cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                    בחר תמונה
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
