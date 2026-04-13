'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Undo2, Redo2, Monitor, Tablet, Smartphone,
  ZoomIn, ZoomOut, Settings, ExternalLink, Save, Check,
  AlertCircle, Loader2, ChevronLeft, Keyboard, X,
  FileText, Globe, Search as SearchIcon, Code2,
} from 'lucide-react';
import { blockLabels, type BlockType } from '@/lib/block-registry';
import { useEditor, type DeviceMode } from './EditorContext';
import { updatePageMetaFromEditorAction, publishPageAction, saveTrackingAction, fetchTrackingSettings } from '@/app/dashboard/pages/[id]/visual/actions';
import ThemePalette from './ThemePalette';

type Props = {
  tenantSettings: { siteName: string; primaryColor: string; logoUrl: string | null };
};

const deviceIcons: Record<DeviceMode, React.ReactNode> = {
  desktop: <Monitor className="h-3.5 w-3.5" />,
  tablet: <Tablet className="h-3.5 w-3.5" />,
  mobile: <Smartphone className="h-3.5 w-3.5" />,
};

const ZOOM_PRESETS = [25, 50, 75, 100, 125, 150, 200];

const SHORTCUTS = [
  { keys: '⌘Z', label: 'ביטול', group: 'כללי' },
  { keys: '⌘⇧Z', label: 'שחזור', group: 'כללי' },
  { keys: '⌘S', label: 'שמור', group: 'כללי' },
  { keys: 'Esc', label: 'ביטול בחירה', group: 'כללי' },
  { keys: '⌘D', label: 'שכפל בלוק', group: 'בלוקים' },
  { keys: 'Del', label: 'מחק בלוק', group: 'בלוקים' },
  { keys: '↑ ↓', label: 'ניווט בין בלוקים', group: 'בלוקים' },
  { keys: '⌘ + גלגלת', label: 'זום', group: 'תצוגה' },
];

export default function EditorToolbar(_props: Props) {
  const {
    blocks,
    undo, redo, canUndo, canRedo,
    device, setDevice,
    zoom, setZoom,
    saveStatus, triggerSave,
    pageMeta, setPageMeta, pageId,
    selectedBlockId, setSelectedBlockId,
  } = useEditor();

  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'general' | 'seo' | 'tracking'>('general');
  const [tracking, setTracking] = useState({ analyticsId: '', fbPixelId: '', gtmId: '', customHeadCode: '' });
  const [trackingLoaded, setTrackingLoaded] = useState(false);

  const shortcutsRef = useRef<HTMLDivElement>(null);
  const shortcutsBtnRef = useRef<HTMLButtonElement>(null);
  const zoomBtnRef = useRef<HTMLDivElement>(null);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const selectedLabel = selectedBlock ? (blockLabels[selectedBlock.type as BlockType] ?? selectedBlock.type) : null;

  const closeOnEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSettings(false);
      setShowShortcuts(false);
      setShowZoomMenu(false);
    }
  }, []);

  useEffect(() => {
    if (showSettings || showShortcuts || showZoomMenu) {
      window.addEventListener('keydown', closeOnEscape);
      return () => window.removeEventListener('keydown', closeOnEscape);
    }
  }, [showSettings, showShortcuts, showZoomMenu, closeOnEscape]);

  const handleMetaSave = async () => {
    setSettingsError(null);
    setSettingsSaving(true);
    const result = await updatePageMetaFromEditorAction(pageId, pageMeta);
    setSettingsSaving(false);
    if (result.success) {
      setShowSettings(false);
    } else {
      setSettingsError(result.error || 'שגיאה');
    }
  };

  const handlePublish = async () => {
    await publishPageAction(pageId);
    setPageMeta({ ...pageMeta, status: 'published' });
  };

  useEffect(() => {
    if (showSettings && settingsTab === 'tracking' && !trackingLoaded) {
      fetchTrackingSettings().then((data) => {
        if (data) setTracking(data);
        setTrackingLoaded(true);
      });
    }
  }, [showSettings, settingsTab, trackingLoaded]);

  const handleTrackingSave = async () => {
    setSettingsError(null);
    setSettingsSaving(true);
    const result = await saveTrackingAction(tracking);
    setSettingsSaving(false);
    if (result.success) {
      setShowSettings(false);
    } else {
      setSettingsError(result.error || 'שגיאה');
    }
  };

  const shortcutGroups = SHORTCUTS.reduce<Record<string, typeof SHORTCUTS>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <>
      <div className="flex h-11 flex-shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-2">
        {/* Right side - Back + page name + breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Link
            href="/dashboard/pages"
            className="flex h-7 items-center gap-1 rounded-md px-1.5 text-slate-400 hover:bg-slate-50 hover:text-navy transition-colors cursor-pointer"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <span className="text-[12px] font-semibold text-navy truncate max-w-36">{pageMeta.title}</span>
          <span className={`rounded-full px-1.5 py-px text-[9px] font-semibold ${
            pageMeta.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
          }`}>
            {pageMeta.status === 'published' ? 'פורסם' : 'טיוטה'}
          </span>
          {selectedLabel && (
            <>
              <ChevronLeft className="h-3 w-3 text-slate-300" />
              <span className="text-[12px] font-medium text-ocean">{selectedLabel}</span>
              <button
                onClick={() => setSelectedBlockId(null)}
                className="flex h-4 w-4 items-center justify-center rounded text-slate-400 hover:text-navy cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          )}
        </div>

        {/* Center - Device + Zoom */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 hover:text-navy disabled:opacity-25 transition-colors cursor-pointer"
            title="ביטול (⌘Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 hover:text-navy disabled:opacity-25 transition-colors cursor-pointer"
            title="שחזור (⌘⇧Z)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1.5 h-4 w-px bg-slate-200" />

          {/* Device toggle */}
          <div className="flex items-center rounded-lg bg-slate-100/80 p-0.5">
            {(['desktop', 'tablet', 'mobile'] as DeviceMode[]).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`flex h-6 w-7 items-center justify-center rounded-md transition-all cursor-pointer ${
                  device === d
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {deviceIcons[d]}
              </button>
            ))}
          </div>

          <div className="mx-1.5 h-4 w-px bg-slate-200" />

          {/* Zoom controls */}
          <button
            onClick={() => setZoom(Math.max(25, zoom - 10))}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 hover:text-navy transition-colors cursor-pointer"
          >
            <ZoomOut className="h-3 w-3" />
          </button>
          <div className="relative" ref={zoomBtnRef}>
            <button
              onClick={() => setShowZoomMenu(!showZoomMenu)}
              className={`min-w-[2.5rem] rounded-md px-1 py-0.5 text-center text-[10px] font-semibold transition-colors cursor-pointer ${
                showZoomMenu ? 'bg-slate-100 text-navy' : 'text-slate-500 hover:bg-slate-50 hover:text-navy'
              }`}
            >
              {zoom}%
            </button>
            {showZoomMenu && (
              <>
                <div className="fixed inset-0 z-[65]" onClick={() => setShowZoomMenu(false)} />
                <div className="absolute top-full left-1/2 z-[66] mt-2 w-28 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-black/[0.04]">
                  {ZOOM_PRESETS.map((z) => (
                    <button
                      key={z}
                      onClick={() => { setZoom(z); setShowZoomMenu(false); }}
                      className={`flex w-full items-center justify-between px-3 py-1.5 text-[12px] transition-colors cursor-pointer ${
                        zoom === z ? 'bg-ocean/[0.06] font-semibold text-ocean' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{z}%</span>
                      {zoom === z && <Check className="h-3 w-3" />}
                    </button>
                  ))}
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => { setZoom(100); setShowZoomMenu(false); }}
                    className="flex w-full items-center px-3 py-1.5 text-[12px] text-slate-500 hover:bg-slate-50 cursor-pointer"
                  >
                    איפוס ל-100%
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 hover:text-navy transition-colors cursor-pointer"
          >
            <ZoomIn className="h-3 w-3" />
          </button>
        </div>

        {/* Left side - Actions */}
        <div className="flex items-center gap-0.5">
          {/* Save status */}
          <div className="flex items-center gap-1 px-1.5">
            {saveStatus === 'saving' && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
            {saveStatus === 'saved' && <Check className="h-3 w-3 text-emerald-500" />}
            {saveStatus === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
            {saveStatus !== 'idle' && (
              <span className={`text-[10px] font-medium ${
                saveStatus === 'saving' ? 'text-slate-400' :
                saveStatus === 'saved' ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {saveStatus === 'saving' ? 'שומר...' : saveStatus === 'saved' ? 'נשמר' : 'שגיאה'}
              </span>
            )}
          </div>

          <button
            onClick={triggerSave}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 hover:text-navy transition-colors cursor-pointer"
            title="שמור (⌘S)"
          >
            <Save className="h-3.5 w-3.5" />
          </button>

          <button
            ref={shortcutsBtnRef}
            onClick={() => setShowShortcuts(!showShortcuts)}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer ${
              showShortcuts ? 'bg-slate-100 text-navy' : 'text-slate-400 hover:bg-slate-50 hover:text-navy'
            }`}
            title="קיצורי מקלדת"
          >
            <Keyboard className="h-3.5 w-3.5" />
          </button>

          <ThemePalette />

          <button
            onClick={() => { setShowSettings(true); setSettingsTab('general'); setSettingsError(null); }}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 hover:text-navy transition-colors cursor-pointer"
            title="הגדרות עמוד"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>

          <a
            href={`/${pageMeta.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 hover:text-navy transition-colors cursor-pointer"
            title="תצוגה מקדימה"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={handlePublish}
            className="mr-1 rounded-full bg-ocean px-3.5 py-1 text-[12px] font-semibold text-white hover:bg-ocean/85 transition-colors cursor-pointer"
          >
            פרסם
          </button>
        </div>
      </div>

      {/* ─── Keyboard shortcuts popover ─── */}
      {showShortcuts && (
        <>
          <div className="fixed inset-0 z-[65]" onClick={() => setShowShortcuts(false)} />
          <div
            ref={shortcutsRef}
            className="absolute left-4 top-[48px] z-[66] w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/[0.04]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <Keyboard className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[12px] font-semibold text-navy">קיצורי מקלדת</span>
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:text-navy cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="p-2">
              {Object.entries(shortcutGroups).map(([group, items]) => (
                <div key={group} className="mb-1.5 last:mb-0">
                  <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    {group}
                  </div>
                  {items.map((s) => (
                    <div key={s.keys} className="flex items-center justify-between rounded-md px-2 py-[5px] hover:bg-slate-50">
                      <span className="text-[12px] text-slate-600">{s.label}</span>
                      <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 shadow-sm" dir="ltr">
                        {s.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ─── Settings modal ─── */}
      {showSettings && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/[0.06]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean/[0.08]">
                  <Settings className="h-4 w-4 text-ocean" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy">הגדרות עמוד</h3>
                  <p className="text-[10px] text-slate-400">{pageMeta.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-navy transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-5">
              <button
                onClick={() => setSettingsTab('general')}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[12px] font-semibold transition-colors cursor-pointer ${
                  settingsTab === 'general'
                    ? 'border-ocean text-ocean'
                    : 'border-transparent text-slate-400 hover:text-navy'
                }`}
              >
                <FileText className="h-3 w-3" />
                כללי
              </button>
              <button
                onClick={() => setSettingsTab('seo')}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[12px] font-semibold transition-colors cursor-pointer ${
                  settingsTab === 'seo'
                    ? 'border-ocean text-ocean'
                    : 'border-transparent text-slate-400 hover:text-navy'
                }`}
              >
                <Globe className="h-3 w-3" />
                SEO
              </button>
              <button
                onClick={() => setSettingsTab('tracking')}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[12px] font-semibold transition-colors cursor-pointer ${
                  settingsTab === 'tracking'
                    ? 'border-ocean text-ocean'
                    : 'border-transparent text-slate-400 hover:text-navy'
                }`}
              >
                <Code2 className="h-3 w-3" />
                הטמעות
              </button>
            </div>

            {/* Modal body */}
            <div className="p-5">
              {settingsTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">כותרת העמוד</label>
                    <input
                      value={pageMeta.title}
                      onChange={(e) => setPageMeta({ ...pageMeta, title: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-300 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">נתיב (URL)</label>
                    <div className="flex items-center rounded-lg border border-slate-200 bg-white focus-within:border-ocean focus-within:ring-1 focus-within:ring-ocean/30">
                      <span className="flex-shrink-0 border-l border-slate-200 px-3 text-[11px] text-slate-400" dir="ltr">yoursite.com/</span>
                      <input
                        value={pageMeta.slug}
                        onChange={(e) => setPageMeta({ ...pageMeta, slug: e.target.value })}
                        dir="ltr"
                        className="w-full bg-transparent px-3 py-3 text-sm font-mono text-navy outline-none placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">סטטוס</label>
                    <select
                      value={pageMeta.status}
                      onChange={(e) => setPageMeta({ ...pageMeta, status: e.target.value })}
                      className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
                    >
                      <option value="draft">טיוטה</option>
                      <option value="published">פורסם</option>
                    </select>
                  </div>
                </div>
              )}

              {settingsTab === 'seo' && (
                <div className="space-y-4">
                  {/* SEO preview */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">תצוגה מקדימה בגוגל</p>
                    <div className="mt-2" dir="ltr">
                      <p className="text-sm font-medium text-[#1a0dab] truncate">
                        {pageMeta.seoTitle || pageMeta.title || 'כותרת העמוד'}
                      </p>
                      <p className="text-[11px] text-[#006621] truncate">
                        yoursite.com/{pageMeta.slug}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                        {pageMeta.seoDescription || 'תיאור העמוד יופיע כאן...'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">
                      כותרת SEO
                    </label>
                    <input
                      value={pageMeta.seoTitle}
                      onChange={(e) => setPageMeta({ ...pageMeta, seoTitle: e.target.value })}
                      placeholder={pageMeta.title}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-300 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">
                      {(pageMeta.seoTitle || pageMeta.title).length}/60 תווים
                    </p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">
                      תיאור SEO
                    </label>
                    <textarea
                      value={pageMeta.seoDescription}
                      onChange={(e) => setPageMeta({ ...pageMeta, seoDescription: e.target.value })}
                      placeholder="תיאור קצר שיופיע בתוצאות החיפוש"
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-300 resize-none focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">
                      {pageMeta.seoDescription.length}/160 תווים
                    </p>
                  </div>
                </div>
              )}

              {settingsTab === 'tracking' && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-ocean/20 bg-ocean-bg p-3">
                    <p className="text-[12px] font-semibold text-navy">פיקסלים והטמעות</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">הוסיפו קודי מעקב לאתר. הקודים יוזרקו בכל עמודי האתר.</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">Facebook Pixel ID</label>
                    <input
                      value={tracking.fbPixelId}
                      onChange={(e) => setTracking({ ...tracking, fbPixelId: e.target.value })}
                      placeholder="123456789012345"
                      dir="ltr"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-mono text-navy placeholder:text-slate-300 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">מזהה הפיקסל מ-Meta Business Suite</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">Google Tag Manager ID</label>
                    <input
                      value={tracking.gtmId}
                      onChange={(e) => setTracking({ ...tracking, gtmId: e.target.value })}
                      placeholder="GTM-XXXXXXX"
                      dir="ltr"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-mono text-navy placeholder:text-slate-300 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">Google Analytics ID</label>
                    <input
                      value={tracking.analyticsId}
                      onChange={(e) => setTracking({ ...tracking, analyticsId: e.target.value })}
                      placeholder="G-XXXXXXXXXX"
                      dir="ltr"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-mono text-navy placeholder:text-slate-300 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">אם אתם משתמשים ב-GTM, מומלץ להוסיף את GA דרך GTM</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">קוד מותאם אישית (HEAD)</label>
                    <textarea
                      value={tracking.customHeadCode}
                      onChange={(e) => setTracking({ ...tracking, customHeadCode: e.target.value })}
                      placeholder={'<script>\n  // קוד מעקב מותאם\n</script>'}
                      dir="ltr"
                      rows={4}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs font-mono text-navy placeholder:text-slate-300 resize-none focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/30"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">קוד שיוזרק בתגית HEAD — מתאים ל-Hotjar, Clarity וכו׳</p>
                  </div>
                </div>
              )}

              {settingsError && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-500" />
                  <p className="text-xs text-red-600">{settingsError}</p>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-[12px] font-semibold text-navy hover:border-slate-300 transition-colors cursor-pointer"
              >
                ביטול
              </button>
              <button
                onClick={settingsTab === 'tracking' ? handleTrackingSave : handleMetaSave}
                disabled={settingsSaving}
                className="flex items-center gap-1.5 rounded-full bg-ocean px-5 py-2 text-[12px] font-semibold text-white hover:bg-ocean/85 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {settingsSaving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
                {settingsSaving ? 'שומר...' : 'שמור שינויים'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
