import { z } from 'zod';

export const blockTypes = [
  'hero',
  'text',
  'image',
  'gallery',
  'cta',
  'contactForm',
  'spacer',
  'html',
  'postsGrid',
  'about',
  'teamGrid',
  'servicesGrid',
  'quote',
] as const;

export type BlockType = (typeof blockTypes)[number];

export const blockSchema = z.object({
  id: z.string(),
  type: z.enum(blockTypes),
  data: z.record(z.unknown()),
});

export type Block = z.infer<typeof blockSchema>;

export const blockLabels: Record<BlockType, string> = {
  hero: 'Hero',
  text: 'טקסט',
  image: 'תמונה',
  gallery: 'גלריה',
  cta: 'קריאה לפעולה',
  contactForm: 'טופס יצירת קשר',
  spacer: 'רווח',
  html: 'HTML מותאם',
  postsGrid: 'רשת פוסטים',
  about: 'אודות',
  teamGrid: 'רשת צוות',
  servicesGrid: 'שירותים',
  quote: 'ציטוט',
};

export function defaultBlockData(type: BlockType): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return {
        variant: 'centered',
        title: 'כותרת ראשית',
        subtitle: 'תת כותרת',
        backgroundImage: '',
        primaryBtnLabel: 'התחילו עכשיו',
        primaryBtnHref: '#',
        primaryBtnVariant: 'filled',
        secondaryBtnLabel: '',
        secondaryBtnHref: '',
        secondaryBtnVariant: 'outline',
      };
    case 'text':
      return { content: '<p>טקסט חדש</p>' };
    case 'image':
      return { src: '', alt: '', caption: '' };
    case 'gallery':
      return { images: [] };
    case 'cta':
      return {
        variant: 'dark',
        title: 'קריאה לפעולה',
        description: '',
        buttonLabel: 'לחצו כאן',
        buttonHref: '#',
      };
    case 'contactForm':
      return { variant: 'standalone', title: 'צור קשר', buttonLabel: 'שליחה' };
    case 'spacer':
      return { height: 64 };
    case 'html':
      return { code: '' };
    case 'postsGrid':
      return { count: 6, columns: 3 };
    case 'about':
      return {
        variant: 'grid',
        items: [
          { icon: 'star', title: 'רשת מובחרת', description: 'שיתופי פעולה עם המותגים והמשפיענים המובילים בתעשייה' },
          { icon: 'trending_up', title: 'אסטרטגיה דיגיטלית', description: 'בניית תכנית שיווק מותאמת אישית לכל מותג' },
          { icon: 'verified', title: 'סטנדרט חדש', description: 'הגדרת רף חדש בתעשיית השיווק הדיגיטלי' },
        ],
      };
    case 'teamGrid':
      return {
        variant: 'grid',
        members: [
          { name: 'שם מלא', role: 'תפקיד', image: '', link: '' },
        ],
      };
    case 'servicesGrid':
      return {
        variant: 'cards',
        services: [
          { icon: 'campaign', title: 'קמפיינים', description: 'ניהול קמפיינים דיגיטליים בכל הפלטפורמות' },
          { icon: 'edit_note', title: 'תוכן', description: 'יצירת תוכן מקורי ואיכותי למותגים' },
          { icon: 'analytics', title: 'ניתוח', description: 'ניתוח ביצועים ואופטימיזציה מתמדת' },
          { icon: 'groups', title: 'ניהול', description: 'ניהול מלא של משפיענים ויוצרי תוכן' },
        ],
      };
    case 'quote':
      return { text: 'ציטוט מעורר השראה', author: '', role: '' };
  }
}

export function templateBlocks(template: string): Block[] {
  const id = () => Math.random().toString(36).slice(2, 10);
  switch (template) {
    case 'home':
      return [
        { id: id(), type: 'hero', data: defaultBlockData('hero') },
        { id: id(), type: 'text', data: { content: '<p>ברוכים הבאים לאתר שלנו</p>' } },
        { id: id(), type: 'cta', data: defaultBlockData('cta') },
      ];
    case 'contact':
      return [
        { id: id(), type: 'text', data: { content: '<h2>צרו קשר</h2><p>נשמח לשמוע מכם</p>' } },
        { id: id(), type: 'contactForm', data: defaultBlockData('contactForm') },
      ];
    case 'landing':
      return [
        { id: id(), type: 'hero', data: defaultBlockData('hero') },
        { id: id(), type: 'text', data: { content: '<h2>מה אנחנו מציעים</h2>' } },
        { id: id(), type: 'gallery', data: { images: [] } },
        { id: id(), type: 'cta', data: defaultBlockData('cta') },
      ];
    default:
      return [];
  }
}
