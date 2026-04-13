'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, AlertTriangle, FileText, Loader2, Eye, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { applyTemplateAction } from '@/app/dashboard/settings/template-actions';
import { templates, type SiteTemplate } from '@/lib/templates';
import TemplatePreview from './TemplatePreview';

export default function TemplateGallery() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [applying, startApply] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: boolean } | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<SiteTemplate | null>(null);

  const visibleTemplates = templates.filter(t => t.id !== 'blank');

  function handleApply() {
    if (!selected) return;
    const t = templates.find(tpl => tpl.id === selected);
    if (!confirm(`להחליף לתבנית "${t?.name}"?\n\nשימו לב: כל העמודים והתפריטים הקיימים יוחלפו בתוכן התבנית.`)) return;

    setResult(null);
    startApply(async () => {
      const res = await applyTemplateAction(selected);
      setResult(res ?? null);
      if (res?.success) router.refresh();
    });
  }

  function navigatePreview(dir: -1 | 1) {
    if (!previewTemplate) return;
    const idx = visibleTemplates.findIndex(t => t.id === previewTemplate.id);
    const next = visibleTemplates[idx + dir];
    if (next) setPreviewTemplate(next);
  }

  return (
    <div className="space-y-5">
      {result?.error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {result.error}
        </div>
      )}
      {result?.success && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-5 py-3 text-sm text-green-600">
          <Check className="h-4 w-4 shrink-0" />
          התבנית הוחלה בהצלחה! העמודים והתפריטים עודכנו.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTemplates.map(t => {
          const isSelected = selected === t.id;
          return (
            <div
              key={t.id}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white text-right transition-all duration-200 ${
                isSelected
                  ? 'border-ocean shadow-lg shadow-ocean/10'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              } ${applying ? 'opacity-50' : ''}`}
            >
              {/* Preview thumbnail — click selects */}
              <button
                type="button"
                onClick={() => setSelected(isSelected ? null : t.id)}
                disabled={applying}
                className="cursor-pointer transition-transform duration-200 group-hover:scale-[1.02]"
              >
                <TemplatePreview template={t} />
              </button>

              {/* Eye button overlay */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreviewTemplate(t); }}
                className="absolute left-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-500 opacity-0 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-ocean hover:text-white group-hover:opacity-100"
                title="תצוגה מקדימה"
              >
                <Eye className="h-4 w-4" />
              </button>

              <div className="flex-1 p-5">
                <button
                  type="button"
                  onClick={() => setSelected(isSelected ? null : t.id)}
                  disabled={applying}
                  className="w-full cursor-pointer text-right"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-noto text-base font-bold text-navy">{t.name}</h3>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                      isSelected ? 'border-ocean bg-ocean' : 'border-slate-200'
                    }`}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{t.description}</p>
                </button>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{t.pages.length} {t.pages.length === 1 ? 'עמוד' : 'עמודים'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3.5 w-3.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: t.primaryColor }} />
                      <span className="text-xs text-slate-400">{t.category}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(t)}
                    className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 transition-colors hover:border-ocean hover:text-ocean"
                  >
                    <Eye className="h-3 w-3" />
                    תצוגה מקדימה
                  </button>
                </div>
              </div>

              {isSelected && (
                <div className="absolute right-3 top-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ocean text-white shadow-md">
                    <Check className="h-4 w-4" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>החלפת תבנית תמחק את כל העמודים והתפריטים הקיימים</span>
          </div>
          <button
            type="button"
            onClick={handleApply}
            disabled={applying}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-ocean px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50"
          >
            {applying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                מחיל...
              </>
            ) : (
              'החל תבנית'
            )}
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => { setSelected(previewTemplate.id); setPreviewTemplate(null); }}
          onPrev={visibleTemplates.findIndex(t => t.id === previewTemplate.id) > 0 ? () => navigatePreview(-1) : undefined}
          onNext={visibleTemplates.findIndex(t => t.id === previewTemplate.id) < visibleTemplates.length - 1 ? () => navigatePreview(1) : undefined}
        />
      )}
    </div>
  );
}

function PreviewModal({ template, onClose, onSelect, onPrev, onNext }: {
  template: SiteTemplate;
  onClose: () => void;
  onSelect: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const [activePage, setActivePage] = useState(0);
  const page = template.pages[activePage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: template.primaryColor }} />
            <h3 className="font-noto text-lg font-bold text-navy">{template.name}</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">{template.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelect}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean/85"
            >
              <Check className="h-4 w-4" />
              בחר תבנית
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Page tabs */}
        <div className="flex gap-1 border-b border-slate-100 px-6 py-2">
          {template.pages.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setActivePage(i)}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activePage === i
                  ? 'bg-ocean/10 text-ocean'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-auto bg-[#f6f7fb] p-6">
          <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <div className="mr-3 flex-1 rounded-full bg-white px-3 py-1 text-[10px] text-slate-300" dir="ltr">
                {template.id}.quicksite.co.il/{page?.slug === 'home' ? '' : page?.slug}
              </div>
            </div>

            {/* Blocks render */}
            <div className="min-h-[400px]">
              {page?.blocks.map((block, i) => (
                <LargeBlockPreview key={i} type={block.type} data={block.data} color={template.primaryColor} />
              ))}
              {(!page?.blocks || page.blocks.length === 0) && (
                <div className="flex h-64 items-center justify-center text-sm text-slate-300">עמוד ריק</div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        {onPrev && (
          <button
            type="button"
            onClick={onPrev}
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-lg backdrop-blur-sm transition-colors hover:text-ocean"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-lg backdrop-blur-sm transition-colors hover:text-ocean"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function LargeBlockPreview({ type, data, color }: { type: string; data: Record<string, unknown>; color: string }) {
  switch (type) {
    case 'hero':
      return (
        <div className="px-8 py-12" style={{ background: `linear-gradient(135deg, ${color}10, ${color}05)` }}>
          {data?.variant === 'split' ? (
            <div className="flex items-center gap-6">
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 rounded-full" style={{ backgroundColor: `${color}30` }} />
                <div className="h-3 w-full rounded-full bg-slate-200" />
                <div className="h-3 w-4/5 rounded-full bg-slate-100" />
                <div className="mt-2 h-8 w-28 rounded-full" style={{ backgroundColor: color }} />
              </div>
              <div className="h-32 w-44 rounded-xl" style={{ backgroundColor: `${color}12` }} />
            </div>
          ) : (
            <div className="space-y-3 text-center">
              <div className="mx-auto h-5 w-2/3 rounded-full" style={{ backgroundColor: `${color}30` }} />
              <div className="mx-auto h-3 w-3/4 rounded-full bg-slate-200" />
              <div className="mx-auto h-3 w-1/2 rounded-full bg-slate-100" />
              <div className="mx-auto mt-2 h-8 w-28 rounded-full" style={{ backgroundColor: color }} />
            </div>
          )}
        </div>
      );

    case 'services':
    case 'servicesGrid':
      return (
        <div className="px-8 py-8">
          <div className="mx-auto mb-4 h-4 w-32 rounded-full bg-slate-200" />
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map(j => (
              <div key={j} className="space-y-2 rounded-xl border border-slate-100 p-4 text-center">
                <div className="mx-auto h-8 w-8 rounded-lg" style={{ backgroundColor: `${color}15` }} />
                <div className="mx-auto h-3 w-16 rounded-full bg-slate-200" />
                <div className="mx-auto h-2 w-full rounded-full bg-slate-100" />
                <div className="mx-auto h-2 w-3/4 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'about':
      return (
        <div className="flex items-center gap-6 px-8 py-8">
          <div className="h-28 w-36 shrink-0 rounded-xl" style={{ backgroundColor: `${color}10` }} />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 rounded-full bg-slate-200" />
            <div className="h-2.5 w-full rounded-full bg-slate-100" />
            <div className="h-2.5 w-full rounded-full bg-slate-100" />
            <div className="h-2.5 w-3/4 rounded-full bg-slate-100" />
          </div>
        </div>
      );

    case 'gallery':
      return (
        <div className="px-8 py-6">
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map(j => (
              <div key={j} className="aspect-[4/3] rounded-lg" style={{ backgroundColor: `${color}${8 + j * 4}` }} />
            ))}
          </div>
        </div>
      );

    case 'cta':
      return (
        <div className="px-8 py-10 text-center" style={{ backgroundColor: `${color}08` }}>
          <div className="mx-auto h-4 w-48 rounded-full" style={{ backgroundColor: `${color}25` }} />
          <div className="mx-auto mt-3 h-2.5 w-64 rounded-full bg-slate-200" />
          <div className="mx-auto mt-4 h-8 w-28 rounded-full" style={{ backgroundColor: color }} />
        </div>
      );

    case 'contactForm':
      return (
        <div className="px-8 py-8">
          <div className="mx-auto mb-4 h-4 w-28 rounded-full bg-slate-200" />
          <div className="mx-auto max-w-sm space-y-3">
            <div className="h-9 w-full rounded-lg border border-slate-100 bg-slate-50" />
            <div className="h-9 w-full rounded-lg border border-slate-100 bg-slate-50" />
            <div className="h-16 w-full rounded-lg border border-slate-100 bg-slate-50" />
            <div className="h-8 w-24 rounded-lg" style={{ backgroundColor: color }} />
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="px-8 py-6">
          <div className="space-y-2">
            <div className="h-4 w-32 rounded-full bg-slate-200" />
            <div className="h-2.5 w-full rounded-full bg-slate-100" />
            <div className="h-2.5 w-full rounded-full bg-slate-100" />
            <div className="h-2.5 w-3/5 rounded-full bg-slate-100" />
          </div>
        </div>
      );

    case 'teamGrid':
      return (
        <div className="px-8 py-8">
          <div className="mx-auto mb-4 h-4 w-24 rounded-full bg-slate-200" />
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map(j => (
              <div key={j} className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-full" style={{ backgroundColor: `${color}12` }} />
                <div className="h-2.5 w-14 rounded-full bg-slate-200" />
                <div className="h-2 w-10 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'quote':
      return (
        <div className="px-8 py-6" style={{ backgroundColor: `${color}04` }}>
          <div className="border-r-3 pr-4" style={{ borderColor: `${color}40` }}>
            <div className="h-2.5 w-full rounded-full bg-slate-100" />
            <div className="mt-1.5 h-2.5 w-3/4 rounded-full bg-slate-100" />
            <div className="mt-3 h-2 w-20 rounded-full bg-slate-200" />
          </div>
        </div>
      );

    case 'postsGrid':
      return (
        <div className="px-8 py-8">
          <div className="mx-auto mb-4 h-4 w-24 rounded-full bg-slate-200" />
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map(j => (
              <div key={j} className="overflow-hidden rounded-xl border border-slate-100">
                <div className="h-20" style={{ backgroundColor: `${color}08` }} />
                <div className="space-y-1.5 p-3">
                  <div className="h-2.5 w-3/4 rounded-full bg-slate-200" />
                  <div className="h-2 w-full rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="px-8 py-4">
          <div className="h-28 w-full rounded-xl" style={{ backgroundColor: `${color}08` }} />
        </div>
      );

    case 'spacer':
      return <div className="h-8" />;

    default:
      return (
        <div className="px-8 py-4">
          <div className="h-2 w-full rounded-full bg-slate-50" />
        </div>
      );
  }
}
