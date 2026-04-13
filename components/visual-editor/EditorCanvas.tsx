'use client';

import { Plus } from 'lucide-react';
import { useEditor } from './EditorContext';
import DeviceFrame from './DeviceFrame';
import BlockWrapper from './BlockWrapper';
import BlockInserter from './BlockInserter';
import EditableHeroBlock from './blocks/EditableHeroBlock';
import EditableTextBlock from './blocks/EditableTextBlock';
import EditableImageBlock from './blocks/EditableImageBlock';
import EditableCtaBlock from './blocks/EditableCtaBlock';
import EditableQuoteBlock from './blocks/EditableQuoteBlock';
import EditableAboutBlock from './blocks/EditableAboutBlock';
import EditableServicesGridBlock from './blocks/EditableServicesGridBlock';
import EditableTeamGridBlock from './blocks/EditableTeamGridBlock';
import EditableGalleryBlock from './blocks/EditableGalleryBlock';
import EditableContactFormBlock from './blocks/EditableContactFormBlock';
import EditableSpacerBlock from './blocks/EditableSpacerBlock';
import EditableHtmlBlock from './blocks/EditableHtmlBlock';
import EditablePostsGridBlock from './blocks/EditablePostsGridBlock';

type Props = {
  tenantSettings: { siteName: string; primaryColor: string; logoUrl: string | null };
};

const EDITABLE_BLOCKS: Record<string, React.ComponentType<{ data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }>> = {
  hero: EditableHeroBlock,
  text: EditableTextBlock,
  image: EditableImageBlock,
  cta: EditableCtaBlock,
  quote: EditableQuoteBlock,
  about: EditableAboutBlock,
  servicesGrid: EditableServicesGridBlock,
  teamGrid: EditableTeamGridBlock,
  gallery: EditableGalleryBlock,
  contactForm: EditableContactFormBlock,
  spacer: EditableSpacerBlock,
  html: EditableHtmlBlock,
  postsGrid: EditablePostsGridBlock,
};

export default function EditorCanvas({ tenantSettings }: Props) {
  const { blocks, updateBlock, setSelectedBlockId, zoom, canvasRef } = useEditor();

  const handleCanvasClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target === canvasRef.current ||
      target.hasAttribute('data-canvas-bg') ||
      target.closest('[data-canvas-bg]') === target
    ) {
      setSelectedBlockId(null);
    }
  };

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 overflow-auto scroll-smooth"
      onClick={handleCanvasClick}
      style={{
        backgroundImage: `
          radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div className="flex min-h-full items-start justify-center px-8 py-8" data-canvas-bg>
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200 ease-out"
        >
          <DeviceFrame>
            <div
              className="font-sans text-charcoal"
              style={{ '--tenant-primary': tenantSettings.primaryColor } as React.CSSProperties}
            >
              {/* Header preview */}
              <header className="relative z-10 border-b border-charcoal/5 bg-white/95 px-4 py-2 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center">
                  {tenantSettings.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={tenantSettings.logoUrl} alt={tenantSettings.siteName} className="h-6 w-auto object-contain" />
                  ) : (
                    <span className="text-sm font-bold" style={{ color: tenantSettings.primaryColor }}>
                      {tenantSettings.siteName}
                    </span>
                  )}
                  <div className="mr-auto flex items-center gap-3">
                    <span className="h-1.5 w-8 rounded-full bg-slate-200" />
                    <span className="h-1.5 w-8 rounded-full bg-slate-200" />
                    <span className="h-1.5 w-8 rounded-full bg-slate-200" />
                  </div>
                </div>
              </header>

              {/* Blocks */}
              <div className="min-h-[50vh]">
                <BlockInserter index={0} />
                {blocks.map((block, index) => {
                  const EditableComponent = EDITABLE_BLOCKS[block.type];
                  return (
                    <div key={block.id}>
                      <BlockWrapper blockId={block.id} index={index}>
                        {EditableComponent ? (
                          <EditableComponent
                            data={block.data}
                            onChange={(data) => updateBlock(block.id, data)}
                          />
                        ) : (
                          <div className="py-8 text-center text-sm text-slate-400">
                            [{block.type}]
                          </div>
                        )}
                      </BlockWrapper>
                      <BlockInserter index={index + 1} />
                    </div>
                  );
                })}

                {blocks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean/[0.06]">
                      <Plus className="h-7 w-7 text-ocean/40" />
                    </div>
                    <h3 className="font-noto text-sm font-bold text-navy">העמוד ריק</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      לחצו על{' '}
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-ocean text-[9px] text-white align-middle">+</span>
                      {' '}כדי להתחיל
                    </p>
                  </div>
                )}
              </div>

              {/* Footer preview */}
              <footer className="border-t border-charcoal/10 bg-charcoal px-4 py-6 text-center">
                <span className="text-[10px] text-white/30">
                  &copy; {new Date().getFullYear()} {tenantSettings.siteName}
                </span>
              </footer>
            </div>
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}
