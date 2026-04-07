import type { Block } from '@/lib/block-registry';
import HeroBlock from './blocks/HeroBlock';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import GalleryBlock from './blocks/GalleryBlock';
import CtaBlock from './blocks/CtaBlock';
import ContactFormBlock from './blocks/ContactFormBlock';
import SpacerBlock from './blocks/SpacerBlock';
import HtmlBlock from './blocks/HtmlBlock';
import PostsGridBlock from './blocks/PostsGridBlock';
import AboutBlock from './blocks/AboutBlock';
import TeamGridBlock from './blocks/TeamGridBlock';
import ServicesGridBlock from './blocks/ServicesGridBlock';
import QuoteBlock from './blocks/QuoteBlock';

type Props = {
  blocks: string;
  tenantId: string;
};

const BLOCK_MAP: Record<string, React.ComponentType<{ data: Record<string, unknown>; tenantId: string }>> = {
  hero: HeroBlock,
  text: TextBlock,
  image: ImageBlock,
  gallery: GalleryBlock,
  cta: CtaBlock,
  contactForm: ContactFormBlock,
  spacer: SpacerBlock,
  html: HtmlBlock,
  postsGrid: PostsGridBlock,
  about: AboutBlock,
  teamGrid: TeamGridBlock,
  servicesGrid: ServicesGridBlock,
  quote: QuoteBlock,
};

export default function BlockRenderer({ blocks, tenantId }: Props) {
  let parsed: Block[] = [];
  try {
    parsed = JSON.parse(blocks);
  } catch {
    return null;
  }

  if (!parsed.length) return null;

  return (
    <div className="tenant-blocks">
      {parsed.map((block) => {
        const Component = BLOCK_MAP[block.type];
        if (!Component) {
          return (
            <div key={block.id} className="py-4 text-center text-sm text-charcoal/40">
              [{block.type}]
            </div>
          );
        }
        return <Component key={block.id} data={block.data} tenantId={tenantId} />;
      })}
    </div>
  );
}
