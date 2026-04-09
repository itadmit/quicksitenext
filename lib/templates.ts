import type { Block } from './block-registry';
import { defaultBlockData } from './block-registry';

const uid = () => Math.random().toString(36).slice(2, 10);

export type TemplatePage = {
  title: string;
  slug: string;
  template: string;
  isHome: boolean;
  blocks: Block[];
};

export type TemplateMenu = {
  name: string;
  location: string;
  items: { label: string; href: string }[];
};

export type TemplateCptField = {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
};

export type TemplateCpt = {
  name: string;
  slug: string;
  fields: TemplateCptField[];
  entries: { title: string; slug: string; status: string; data: Record<string, string> }[];
};

export type SiteTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  primaryColor: string;
  pages: TemplatePage[];
  menus: TemplateMenu[];
  cpts: TemplateCpt[];
  siteSettings: { tagline: string; footerText: string };
};

export const templates: SiteTemplate[] = [
  {
    id: 'agency',
    name: 'סוכנות',
    description: 'אתר לסוכנות שיווק, ניהול משפיענים או חברת שירותים מקצועית',
    category: 'עסקי',
    icon: 'diversity_3',
    primaryColor: '#a28b5d',
    pages: [
      {
        title: 'דף הבית',
        slug: 'home',
        template: 'agency',
        isHome: true,
        blocks: [
          {
            id: uid(), type: 'hero',
            data: {
              title: 'סוכנות ניהול משפיענים',
              subtitle: 'מחברים בין מותגים ליוצרי תוכן מובילים',
              backgroundImage: '',
              primaryBtnLabel: 'צרו קשר',
              primaryBtnHref: '/contact',
              secondaryBtnLabel: 'השירותים שלנו',
              secondaryBtnHref: '#services',
            },
          },
          {
            id: uid(), type: 'about',
            data: {
              items: [
                { icon: 'star', title: 'רשת מובחרת', description: 'שיתופי פעולה עם המותגים והמשפיענים המובילים בתעשייה' },
                { icon: 'trending_up', title: 'אסטרטגיה דיגיטלית', description: 'בניית תכנית שיווק מותאמת אישית לכל מותג' },
                { icon: 'verified', title: 'סטנדרט חדש', description: 'הגדרת רף חדש בתעשיית השיווק הדיגיטלי' },
              ],
            },
          },
          {
            id: uid(), type: 'teamGrid',
            data: {
              members: [
                { name: 'יעל כהן', role: 'אינפלואנסרית לייפסטייל', image: '', link: '' },
                { name: 'מיכל לוי', role: 'יוצרת תוכן אופנה', image: '', link: '' },
                { name: 'נועם ברק', role: 'בלוגר טכנולוגיה', image: '', link: '' },
                { name: 'שירה אביב', role: 'אינפלואנסרית ביוטי', image: '', link: '' },
                { name: 'דניאל רז', role: 'יוצר תוכן ספורט', image: '', link: '' },
                { name: 'רונית גולד', role: 'אינפלואנסרית אוכל', image: '', link: '' },
              ],
            },
          },
          {
            id: uid(), type: 'servicesGrid',
            data: {
              services: [
                { icon: 'campaign', title: 'ניהול קמפיינים', description: 'תכנון וביצוע קמפיינים דיגיטליים בכל הפלטפורמות המובילות' },
                { icon: 'edit_note', title: 'יצירת תוכן', description: 'הפקת תוכן מקורי, מקצועי ומותאם לכל מותג ופלטפורמה' },
                { icon: 'analytics', title: 'ניתוח ביצועים', description: 'דוחות מפורטים, ניתוח ROI ואופטימיזציה מתמדת' },
                { icon: 'groups', title: 'ניהול משפיענים', description: 'ליווי אישי, ניהול חוזים ובניית קריירה דיגיטלית' },
              ],
            },
          },
          {
            id: uid(), type: 'quote',
            data: {
              text: 'אנחנו מאמינים שכל סיפור ראוי להישמע, וכל מותג ראוי לחיבור אמיתי עם הקהל שלו.',
              author: '', role: '',
            },
          },
          {
            id: uid(), type: 'cta',
            data: {
              title: 'מוכנים להתחיל?',
              description: 'בואו נבנה יחד את הנוכחות הדיגיטלית שלכם',
              buttonLabel: 'דברו איתנו',
              buttonHref: '/contact',
              variant: 'primary',
            },
          },
          { id: uid(), type: 'contactForm', data: { title: 'צרו קשר', buttonLabel: 'שליחה' } },
        ],
      },
      {
        title: 'צור קשר',
        slug: 'contact',
        template: 'contact',
        isHome: false,
        blocks: [
          { id: uid(), type: 'text', data: { content: '<h2 style="text-align:center">צרו קשר</h2><p style="text-align:center">נשמח לשמוע מכם</p>' } },
          { id: uid(), type: 'contactForm', data: { title: 'השאירו פרטים', buttonLabel: 'שליחה' } },
        ],
      },
    ],
    menus: [
      {
        name: 'תפריט ראשי',
        location: 'header',
        items: [
          { label: 'דף הבית', href: '/' },
          { label: 'הטאלנטים שלנו', href: '/talents' },
          { label: 'צור קשר', href: '/contact' },
        ],
      },
    ],
    cpts: [
      {
        name: 'טאלנטים',
        slug: 'talents',
        fields: [
          { name: 'full_name', label: 'שם מלא', type: 'text', required: true },
          { name: 'role', label: 'תחום', type: 'select', required: true, options: ['לייפסטייל', 'אופנה', 'ביוטי', 'טכנולוגיה', 'ספורט', 'אוכל', 'נסיעות', 'משפחה'] },
          { name: 'bio', label: 'ביוגרפיה', type: 'textarea', required: false },
          { name: 'image', label: 'תמונה', type: 'image', required: false },
          { name: 'instagram', label: 'אינסטגרם', type: 'url', required: false },
          { name: 'tiktok', label: 'טיקטוק', type: 'url', required: false },
          { name: 'youtube', label: 'יוטיוב', type: 'url', required: false },
          { name: 'followers', label: 'עוקבים', type: 'text', required: false },
          { name: 'featured', label: 'מומלץ', type: 'checkbox', required: false },
        ],
        entries: [
          { title: 'יעל כהן', slug: 'yael-cohen', status: 'published', data: { full_name: 'יעל כהן', role: 'לייפסטייל', bio: 'יוצרת תוכן לייפסטייל עם למעלה מ-500K עוקבים. מתמחה בשיתופי פעולה עם מותגי אופנה וביוטי.', followers: '520K', featured: 'true' } },
          { title: 'מיכל לוי', slug: 'michal-levi', status: 'published', data: { full_name: 'מיכל לוי', role: 'אופנה', bio: 'בלוגרית אופנה ויוצרת תוכן. עובדת עם מותגים בינלאומיים ומקומיים.', followers: '380K', featured: 'true' } },
          { title: 'נועם ברק', slug: 'noam-barak', status: 'published', data: { full_name: 'נועם ברק', role: 'טכנולוגיה', bio: 'בלוגר טכנולוגיה עם ערוץ יוטיוב פופולרי. סוקר מוצרים וחדשות טק.', followers: '290K', featured: 'true' } },
          { title: 'שירה אביב', slug: 'shira-aviv', status: 'published', data: { full_name: 'שירה אביב', role: 'ביוטי', bio: 'מומחית ביוטי ואיפור. משתפת טיפים, סקירות מוצרים וטוטוריאלים.', followers: '450K', featured: 'false' } },
          { title: 'דניאל רז', slug: 'daniel-raz', status: 'published', data: { full_name: 'דניאל רז', role: 'ספורט', bio: 'יוצר תוכן ספורט וכושר. שגריר מותגים מובילים בתחום הספורט.', followers: '310K', featured: 'false' } },
          { title: 'רונית גולד', slug: 'ronit-gold', status: 'published', data: { full_name: 'רונית גולד', role: 'אוכל', bio: 'פוד בלוגרית ויוצרת מתכונים. משתפת פעולה עם מסעדות ומותגי מזון.', followers: '270K', featured: 'true' } },
        ],
      },
    ],
    siteSettings: {
      tagline: 'מחברים בין מותגים ליוצרי תוכן',
      footerText: '© כל הזכויות שמורות',
    },
  },

  {
    id: 'business',
    name: 'עסק',
    description: 'אתר לעסק, חנות, מסעדה או כל עסק שרוצה נוכחות דיגיטלית',
    category: 'עסקי',
    icon: 'storefront',
    primaryColor: '#2563eb',
    pages: [
      {
        title: 'דף הבית',
        slug: 'home',
        template: 'home',
        isHome: true,
        blocks: [
          {
            id: uid(), type: 'hero',
            data: {
              title: 'ברוכים הבאים',
              subtitle: 'הפתרון המושלם לעסק שלכם',
              backgroundImage: '',
              primaryBtnLabel: 'צרו קשר',
              primaryBtnHref: '/contact',
              secondaryBtnLabel: 'השירותים שלנו',
              secondaryBtnHref: '#services',
            },
          },
          {
            id: uid(), type: 'about',
            data: {
              items: [
                { icon: 'handshake', title: 'מקצועיות', description: 'שירות אמין ומקצועי ברמה הגבוהה ביותר' },
                { icon: 'schedule', title: 'זמינות', description: 'אנחנו כאן בשבילכם בכל שעה ובכל יום' },
                { icon: 'workspace_premium', title: 'איכות', description: 'מחויבים למצוינות בכל פרויקט' },
              ],
            },
          },
          {
            id: uid(), type: 'servicesGrid',
            data: {
              services: [
                { icon: 'design_services', title: 'ייעוץ', description: 'ייעוץ מקצועי ומותאם אישית' },
                { icon: 'build', title: 'ביצוע', description: 'ביצוע מהיר ואיכותי' },
                { icon: 'support_agent', title: 'תמיכה', description: 'תמיכה מלאה לאורך כל הדרך' },
                { icon: 'thumb_up', title: 'שביעות רצון', description: 'לקוחות מרוצים הם העדות הטובה ביותר' },
              ],
            },
          },
          {
            id: uid(), type: 'cta',
            data: {
              title: 'רוצים לשמוע עוד?',
              description: 'השאירו פרטים ונחזור אליכם בהקדם',
              buttonLabel: 'צרו קשר',
              buttonHref: '/contact',
              variant: 'primary',
            },
          },
        ],
      },
      {
        title: 'אודות',
        slug: 'about',
        template: 'blank',
        isHome: false,
        blocks: [
          { id: uid(), type: 'text', data: { content: '<h2 style="text-align:center">אודותינו</h2><p style="text-align:center">ספרו ללקוחות על העסק שלכם, הערכים והחזון.</p>' } },
        ],
      },
      {
        title: 'צור קשר',
        slug: 'contact',
        template: 'contact',
        isHome: false,
        blocks: [
          { id: uid(), type: 'text', data: { content: '<h2 style="text-align:center">צרו קשר</h2><p style="text-align:center">נשמח לשמוע מכם</p>' } },
          { id: uid(), type: 'contactForm', data: { title: 'השאירו פרטים', buttonLabel: 'שליחה' } },
        ],
      },
    ],
    menus: [
      {
        name: 'תפריט ראשי',
        location: 'header',
        items: [
          { label: 'דף הבית', href: '/' },
          { label: 'אודות', href: '/about' },
          { label: 'צור קשר', href: '/contact' },
        ],
      },
    ],
    cpts: [],
    siteSettings: {
      tagline: 'הפתרון המושלם לעסק שלכם',
      footerText: '© כל הזכויות שמורות',
    },
  },

  {
    id: 'blog',
    name: 'בלוג',
    description: 'אתר בלוג עם רשת פוסטים, מושלם לכותבים, בלוגרים ויוצרי תוכן',
    category: 'תוכן',
    icon: 'edit_note',
    primaryColor: '#059669',
    pages: [
      {
        title: 'דף הבית',
        slug: 'home',
        template: 'blog',
        isHome: true,
        blocks: [
          {
            id: uid(), type: 'hero',
            data: {
              title: 'הבלוג שלנו',
              subtitle: 'מחשבות, רעיונות ותובנות',
              backgroundImage: '',
              primaryBtnLabel: 'לכל הפוסטים',
              primaryBtnHref: '/blog',
              secondaryBtnLabel: '',
              secondaryBtnHref: '',
            },
          },
          { id: uid(), type: 'postsGrid', data: { count: 6, columns: 3 } },
        ],
      },
      {
        title: 'צור קשר',
        slug: 'contact',
        template: 'contact',
        isHome: false,
        blocks: [
          { id: uid(), type: 'text', data: { content: '<h2 style="text-align:center">צרו קשר</h2><p style="text-align:center">רוצים לשתף פעולה? דברו איתנו</p>' } },
          { id: uid(), type: 'contactForm', data: { title: 'כתבו לנו', buttonLabel: 'שליחה' } },
        ],
      },
    ],
    menus: [
      {
        name: 'תפריט ראשי',
        location: 'header',
        items: [
          { label: 'דף הבית', href: '/' },
          { label: 'בלוג', href: '/blog' },
          { label: 'צור קשר', href: '/contact' },
        ],
      },
    ],
    cpts: [],
    siteSettings: {
      tagline: 'מחשבות, רעיונות ותובנות',
      footerText: '© כל הזכויות שמורות',
    },
  },

  {
    id: 'landing',
    name: 'דף נחיתה',
    description: 'עמוד אחד ממוקד להשקת מוצר, אירוע או קמפיין שיווקי',
    category: 'שיווק',
    icon: 'rocket_launch',
    primaryColor: '#7c3aed',
    pages: [
      {
        title: 'דף הבית',
        slug: 'home',
        template: 'landing',
        isHome: true,
        blocks: [
          {
            id: uid(), type: 'hero',
            data: {
              title: 'המוצר החדש שלנו',
              subtitle: 'הפתרון שחיכיתם לו',
              backgroundImage: '',
              primaryBtnLabel: 'הרשמו עכשיו',
              primaryBtnHref: '#signup',
              secondaryBtnLabel: 'למידע נוסף',
              secondaryBtnHref: '#info',
            },
          },
          { id: uid(), type: 'gallery', data: { images: [] } },
          {
            id: uid(), type: 'quote',
            data: { text: 'המוצר הזה שינה לנו את החיים!', author: 'לקוח מרוצה', role: '' },
          },
          {
            id: uid(), type: 'cta',
            data: {
              title: 'אל תפספסו',
              description: 'הצטרפו עוד היום ותיהנו מהטבה מיוחדת',
              buttonLabel: 'הצטרפו עכשיו',
              buttonHref: '#signup',
              variant: 'primary',
            },
          },
          { id: uid(), type: 'contactForm', data: { title: 'השאירו פרטים', buttonLabel: 'שלחו לי' } },
        ],
      },
    ],
    menus: [
      {
        name: 'תפריט ראשי',
        location: 'header',
        items: [{ label: 'דף הבית', href: '/' }],
      },
    ],
    cpts: [],
    siteSettings: {
      tagline: 'הפתרון שחיכיתם לו',
      footerText: '© כל הזכויות שמורות',
    },
  },

  {
    id: 'blank',
    name: 'ריק',
    description: 'התחילו מאפס ובנו את האתר בדיוק כמו שאתם רוצים',
    category: 'כללי',
    icon: 'draft',
    primaryColor: '#a28b5d',
    pages: [
      {
        title: 'דף הבית',
        slug: 'home',
        template: 'blank',
        isHome: true,
        blocks: [
          { id: uid(), type: 'hero', data: defaultBlockData('hero') },
        ],
      },
    ],
    menus: [
      {
        name: 'תפריט ראשי',
        location: 'header',
        items: [{ label: 'דף הבית', href: '/' }],
      },
    ],
    cpts: [],
    siteSettings: {
      tagline: '',
      footerText: '© כל הזכויות שמורות',
    },
  },
];

export function getTemplate(id: string): SiteTemplate | undefined {
  return templates.find(t => t.id === id);
}
