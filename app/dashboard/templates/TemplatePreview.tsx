'use client';

import type { SiteTemplate } from '@/lib/templates';

/**
 * Mini wireframe preview of a site template.
 * Shows a simplified visual representation of the template's homepage blocks.
 */
export default function TemplatePreview({ template }: { template: SiteTemplate }) {
  const color = template.primaryColor;
  const homePage = template.pages.find(p => p.isHome) || template.pages[0];
  const blocks = homePage?.blocks || [];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-t-xl bg-white" style={{ minHeight: 160 }}>
      {/* Mini browser chrome */}
      <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50/80 px-2.5 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-red-300" />
        <div className="h-1.5 w-1.5 rounded-full bg-amber-300" />
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
        <div className="mr-2 h-2.5 flex-1 rounded-full bg-slate-100" />
      </div>

      {/* Mini nav */}
      <div className="flex items-center justify-between border-b border-slate-50 px-3 py-1.5">
        <div className="flex gap-1.5">
          <div className="h-1.5 w-6 rounded-full bg-slate-200" />
          <div className="h-1.5 w-5 rounded-full bg-slate-100" />
          <div className="h-1.5 w-5 rounded-full bg-slate-100" />
        </div>
        <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
      </div>

      {/* Blocks */}
      <div className="space-y-0">
        {blocks.slice(0, 5).map((block, i) => (
          <BlockPreview key={i} type={block.type} color={color} variant={block.data?.variant} />
        ))}
        {blocks.length === 0 && (
          <div className="flex h-24 items-center justify-center">
            <div className="h-1.5 w-12 rounded-full bg-slate-100" />
          </div>
        )}
      </div>
    </div>
  );
}

function BlockPreview({ type, color, variant }: { type: string; color: string; variant?: string }) {
  switch (type) {
    case 'hero':
      return (
        <div className="px-3 py-4" style={{ background: `linear-gradient(135deg, ${color}12, ${color}06)` }}>
          {variant === 'split' ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1">
                <div className="h-2 w-14 rounded-full" style={{ backgroundColor: `${color}40` }} />
                <div className="h-1.5 w-20 rounded-full bg-slate-200" />
                <div className="mt-1.5 h-2.5 w-10 rounded-full" style={{ backgroundColor: color }} />
              </div>
              <div className="h-10 w-14 rounded-md" style={{ backgroundColor: `${color}15` }} />
            </div>
          ) : (
            <div className="space-y-1 text-center">
              <div className="mx-auto h-2 w-16 rounded-full" style={{ backgroundColor: `${color}40` }} />
              <div className="mx-auto h-1.5 w-24 rounded-full bg-slate-200" />
              <div className="mx-auto mt-1.5 h-2.5 w-10 rounded-full" style={{ backgroundColor: color }} />
            </div>
          )}
        </div>
      );

    case 'services':
    case 'servicesGrid':
      return (
        <div className="px-3 py-2.5">
          <div className="mb-1.5 mx-auto h-1.5 w-10 rounded-full bg-slate-200" />
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map(j => (
              <div key={j} className="space-y-0.5 rounded-md border border-slate-50 p-1.5">
                <div className="mx-auto h-2 w-2 rounded-full" style={{ backgroundColor: `${color}20` }} />
                <div className="mx-auto h-1 w-6 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'about':
      return (
        <div className="flex items-center gap-2 px-3 py-2.5">
          <div className="h-8 w-10 rounded-md" style={{ backgroundColor: `${color}10` }} />
          <div className="flex-1 space-y-0.5">
            <div className="h-1.5 w-10 rounded-full bg-slate-200" />
            <div className="h-1 w-full rounded-full bg-slate-100" />
            <div className="h-1 w-3/4 rounded-full bg-slate-100" />
          </div>
        </div>
      );

    case 'gallery':
      return (
        <div className="px-3 py-2.5">
          <div className="grid grid-cols-3 gap-1">
            {[0, 1, 2].map(j => (
              <div key={j} className="aspect-square rounded-sm" style={{ backgroundColor: `${color}${10 + j * 5}` }} />
            ))}
          </div>
        </div>
      );

    case 'cta':
      return (
        <div className="px-3 py-2.5" style={{ backgroundColor: `${color}08` }}>
          <div className="text-center space-y-1">
            <div className="mx-auto h-1.5 w-12 rounded-full" style={{ backgroundColor: `${color}30` }} />
            <div className="mx-auto h-2 w-8 rounded-full" style={{ backgroundColor: color }} />
          </div>
        </div>
      );

    case 'contactForm':
      return (
        <div className="px-3 py-2.5">
          <div className="space-y-1">
            <div className="h-2 w-full rounded-sm border border-slate-100 bg-slate-50" />
            <div className="h-2 w-full rounded-sm border border-slate-100 bg-slate-50" />
            <div className="h-2 w-12 rounded-sm" style={{ backgroundColor: color }} />
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="px-3 py-2">
          <div className="space-y-0.5">
            <div className="h-1.5 w-10 rounded-full bg-slate-200" />
            <div className="h-1 w-full rounded-full bg-slate-100" />
            <div className="h-1 w-4/5 rounded-full bg-slate-100" />
          </div>
        </div>
      );

    case 'teamGrid':
      return (
        <div className="px-3 py-2.5">
          <div className="mb-1 mx-auto h-1.5 w-8 rounded-full bg-slate-200" />
          <div className="grid grid-cols-3 gap-1">
            {[0, 1, 2].map(j => (
              <div key={j} className="flex flex-col items-center gap-0.5">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: `${color}15` }} />
                <div className="h-1 w-4 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'quote':
      return (
        <div className="px-3 py-2" style={{ backgroundColor: `${color}05` }}>
          <div className="border-r-2 pr-2 space-y-0.5" style={{ borderColor: `${color}40` }}>
            <div className="h-1 w-full rounded-full bg-slate-100" />
            <div className="h-1 w-3/4 rounded-full bg-slate-100" />
          </div>
        </div>
      );

    case 'postsGrid':
      return (
        <div className="px-3 py-2.5">
          <div className="mb-1 mx-auto h-1.5 w-10 rounded-full bg-slate-200" />
          <div className="grid grid-cols-2 gap-1">
            {[0, 1].map(j => (
              <div key={j} className="rounded-sm border border-slate-50 p-1">
                <div className="mb-0.5 h-3 rounded-sm" style={{ backgroundColor: `${color}10` }} />
                <div className="h-1 w-full rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="px-3 py-2">
          <div className="h-8 w-full rounded-md" style={{ backgroundColor: `${color}10` }} />
        </div>
      );

    case 'spacer':
      return <div className="h-2" />;

    default:
      return (
        <div className="px-3 py-1.5">
          <div className="h-1 w-full rounded-full bg-slate-50" />
        </div>
      );
  }
}
