import type { Block } from './block-registry';

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
  siteSettings: {
    tagline: string;
    footerText: string;
    themeJson?: string;
  };
};

export const templates: SiteTemplate[] = [
  /* ── 1. עסק (Business) — Clean Professional ── */
  {
    id: 'business',
    name: 'עסק',
    description: 'אתר מקצועי לעסק, משרד או חברת שירותים',
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
              variant: 'split',
              title: 'הפתרון המקצועי לעסק שלכם',
              subtitle: 'שירותים מותאמים אישית שיעזרו לעסק שלכם לצמוח ולהצליח',
              backgroundImage: '',
              primaryBtnLabel: 'צרו קשר',
              primaryBtnHref: '/contact',
              primaryBtnVariant: 'filled',
              secondaryBtnLabel: 'השירותים שלנו',
              secondaryBtnHref: '#services',
              secondaryBtnVariant: 'outline',
            },
          },
          {
            id: uid(), type: 'about',
            data: {
              variant: 'horizontal',
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
              variant: 'cards',
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
              variant: 'light',
              title: 'רוצים לשמוע עוד?',
              description: 'השאירו פרטים ונחזור אליכם בהקדם',
              buttonLabel: 'צרו קשר',
              buttonHref: '/contact',
            },
          },
          {
            id: uid(), type: 'contactForm',
            data: { variant: 'split', title: 'דברו איתנו', subtitle: 'נשמח לענות על כל שאלה', buttonLabel: 'שליחה' },
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
          { id: uid(), type: 'contactForm', data: { variant: 'standalone', title: 'צרו קשר', buttonLabel: 'שליחה' } },
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
      themeJson: JSON.stringify({
        heading: '#0A2540',
        body: '#64748b',
        btnText: '#ffffff',
        background: '#ffffff',
        overlay: 'rgba(0,0,0,0.5)',
        gradFrom: '#2563eb',
        gradTo: '#1e40af',
      }),
    },
  },

  /* ── 2. קליניקה / מרפאה (Clinic) — Calm Trust ── */
  {
    id: 'clinic',
    name: 'קליניקה / מרפאה',
    description: 'אתר לקליניקה, מרפאה או מטפל — עיצוב רגוע ומקצועי',
    category: 'בריאות',
    icon: 'local_hospital',
    primaryColor: '#0d9488',
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
              variant: 'minimal',
              title: 'בריאות ואיכות חיים',
              subtitle: 'טיפול מקצועי בגישה אישית ומכבדת',
              backgroundImage: '',
              primaryBtnLabel: 'קבעו תור',
              primaryBtnHref: '/contact',
              primaryBtnVariant: 'filled',
              secondaryBtnLabel: '',
              secondaryBtnHref: '',
              secondaryBtnVariant: 'outline',
            },
          },
          {
            id: uid(), type: 'about',
            data: {
              variant: 'grid',
              items: [
                { icon: 'favorite', title: 'גישה אישית', description: 'כל מטופל מקבל תכנית טיפול מותאמת אישית' },
                { icon: 'verified', title: 'ניסיון מוכח', description: 'למעלה מ-15 שנות ניסיון בתחום' },
                { icon: 'psychology', title: 'טיפול הוליסטי', description: 'גישה מקיפה הכוללת גוף ונפש' },
              ],
            },
          },
          {
            id: uid(), type: 'servicesGrid',
            data: {
              variant: 'minimal',
              services: [
                { icon: 'medical_services', title: 'ייעוץ רפואי', description: 'ייעוץ מקצועי ומקיף בתחום הבריאות' },
                { icon: 'healing', title: 'טיפולים', description: 'מגוון רחב של טיפולים מתקדמים' },
                { icon: 'monitor_heart', title: 'בדיקות', description: 'בדיקות מקיפות ומעקב שוטף' },
                { icon: 'spa', title: 'שיקום', description: 'תכניות שיקום מותאמות אישית' },
              ],
            },
          },
          {
            id: uid(), type: 'cta',
            data: {
              variant: 'light',
              title: 'רוצים לקבוע פגישה?',
              description: 'צרו קשר ונשמח לעזור',
              buttonLabel: 'קבעו תור',
              buttonHref: '/contact',
            },
          },
          {
            id: uid(), type: 'contactForm',
            data: { variant: 'standalone', title: 'השאירו פרטים', buttonLabel: 'שליחה' },
          },
        ],
      },
      {
        title: 'שירותים',
        slug: 'services',
        template: 'blank',
        isHome: false,
        blocks: [
          { id: uid(), type: 'text', data: { content: '<h2 style="text-align:center">השירותים שלנו</h2><p style="text-align:center">מגוון טיפולים ושירותים מקצועיים</p>' } },
        ],
      },
      {
        title: 'צור קשר',
        slug: 'contact',
        template: 'contact',
        isHome: false,
        blocks: [
          { id: uid(), type: 'contactForm', data: { variant: 'standalone', title: 'צרו קשר', buttonLabel: 'שליחה' } },
        ],
      },
    ],
    menus: [
      {
        name: 'תפריט ראשי',
        location: 'header',
        items: [
          { label: 'דף הבית', href: '/' },
          { label: 'שירותים', href: '/services' },
          { label: 'צור קשר', href: '/contact' },
        ],
      },
    ],
    cpts: [],
    siteSettings: {
      tagline: 'בריאות ואיכות חיים',
      footerText: '© כל הזכויות שמורות',
      themeJson: JSON.stringify({
        heading: '#0A2540',
        body: '#64748b',
        btnText: '#ffffff',
        background: '#ffffff',
        overlay: 'rgba(0,0,0,0.4)',
        gradFrom: '#0d9488',
        gradTo: '#065f46',
      }),
    },
  },

  /* ── 3. מסעדה / קפה (Restaurant) — Warm Inviting ── */
  {
    id: 'restaurant',
    name: 'מסעדה / קפה',
    description: 'אתר למסעדה, בית קפה או עסק בתחום הקולינריה',
    category: 'אוכל',
    icon: 'restaurant',
    primaryColor: '#b45309',
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
              variant: 'fullscreen',
              title: 'חוויה קולינרית שלא תשכחו',
              subtitle: 'מרכיבים טריים, שפים מוכשרים, ואווירה שאין כמוה',
              backgroundImage: '',
              primaryBtnLabel: 'לתפריט',
              primaryBtnHref: '/menu',
              primaryBtnVariant: 'filled',
              secondaryBtnLabel: 'הזמינו שולחן',
              secondaryBtnHref: '/contact',
              secondaryBtnVariant: 'outline',
            },
          },
          {
            id: uid(), type: 'about',
            data: {
              variant: 'alternating',
              items: [
                { icon: 'restaurant_menu', title: 'תפריט עשיר', description: 'מנות ייחודיות המשלבות מסורת וחדשנות קולינרית' },
                { icon: 'local_bar', title: 'בר משקאות', description: 'קוקטיילים מיוחדים, יינות נבחרים ומשקאות מרעננים' },
                { icon: 'event_seat', title: 'אווירה מושלמת', description: 'עיצוב ייחודי ואווירה חמה לכל ארוחה' },
              ],
            },
          },
          {
            id: uid(), type: 'gallery',
            data: { images: [] },
          },
          {
            id: uid(), type: 'cta',
            data: {
              variant: 'dark',
              title: 'רוצים להזמין שולחן?',
              description: 'צרו קשר ונשמח לארח אתכם',
              buttonLabel: 'הזמנת מקום',
              buttonHref: '/contact',
            },
          },
          {
            id: uid(), type: 'contactForm',
            data: { variant: 'standalone', title: 'הזמנת שולחן', buttonLabel: 'שליחה' },
          },
        ],
      },
      {
        title: 'תפריט',
        slug: 'menu',
        template: 'blank',
        isHome: false,
        blocks: [
          { id: uid(), type: 'text', data: { content: '<h2 style="text-align:center">התפריט שלנו</h2><p style="text-align:center">מנות מיוחדות שיגרמו לכם לחזור שוב ושוב</p>' } },
          { id: uid(), type: 'gallery', data: { images: [] } },
        ],
      },
      {
        title: 'צור קשר',
        slug: 'contact',
        template: 'contact',
        isHome: false,
        blocks: [
          { id: uid(), type: 'contactForm', data: { variant: 'standalone', title: 'צרו קשר', buttonLabel: 'שליחה' } },
        ],
      },
    ],
    menus: [
      {
        name: 'תפריט ראשי',
        location: 'header',
        items: [
          { label: 'דף הבית', href: '/' },
          { label: 'תפריט', href: '/menu' },
          { label: 'צור קשר', href: '/contact' },
        ],
      },
    ],
    cpts: [],
    siteSettings: {
      tagline: 'חוויה קולינרית שלא תשכחו',
      footerText: '© כל הזכויות שמורות',
      themeJson: JSON.stringify({
        heading: '#ffffff',
        body: 'rgba(255,255,255,0.7)',
        btnText: '#ffffff',
        background: '#ffffff',
        overlay: 'rgba(0,0,0,0.55)',
        gradFrom: '#b45309',
        gradTo: '#78350f',
      }),
    },
  },

  /* ── 4. פורטפוליו (Portfolio) — Minimal Creative ── */
  {
    id: 'portfolio',
    name: 'פורטפוליו',
    description: 'תיק עבודות מינימלי ליוצרים, מעצבים וצלמים',
    category: 'קריאייטיב',
    icon: 'palette',
    primaryColor: '#0A2540',
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
              variant: 'minimal',
              title: 'יצירתיות ללא גבולות',
              subtitle: 'עיצוב, צילום ויצירה — הכל במקום אחד',
              backgroundImage: '',
              primaryBtnLabel: 'לעבודות',
              primaryBtnHref: '#gallery',
              primaryBtnVariant: 'filled',
              secondaryBtnLabel: '',
              secondaryBtnHref: '',
              secondaryBtnVariant: 'outline',
            },
          },
          {
            id: uid(), type: 'gallery',
            data: { images: [] },
          },
          {
            id: uid(), type: 'quote',
            data: {
              text: 'עיצוב טוב הוא לא רק מה שנראה ומורגש — זה איך שזה עובד.',
              author: '',
              role: '',
            },
          },
          {
            id: uid(), type: 'cta',
            data: {
              variant: 'banner',
              title: 'מעוניינים לעבוד יחד?',
              description: '',
              buttonLabel: 'צרו קשר',
              buttonHref: '/contact',
            },
          },
          {
            id: uid(), type: 'contactForm',
            data: { variant: 'split', title: 'בואו ניצור משהו מדהים', subtitle: 'ספרו לי על הפרויקט שלכם', buttonLabel: 'שליחה' },
          },
        ],
      },
      {
        title: 'צור קשר',
        slug: 'contact',
        template: 'contact',
        isHome: false,
        blocks: [
          { id: uid(), type: 'contactForm', data: { variant: 'standalone', title: 'צרו קשר', buttonLabel: 'שליחה' } },
        ],
      },
    ],
    menus: [
      {
        name: 'תפריט ראשי',
        location: 'header',
        items: [
          { label: 'דף הבית', href: '/' },
          { label: 'צור קשר', href: '/contact' },
        ],
      },
    ],
    cpts: [],
    siteSettings: {
      tagline: 'יצירתיות ללא גבולות',
      footerText: '© כל הזכויות שמורות',
      themeJson: JSON.stringify({
        heading: '#0A2540',
        body: '#64748b',
        btnText: '#ffffff',
        background: '#ffffff',
        overlay: 'rgba(0,0,0,0.6)',
        gradFrom: '#0A2540',
        gradTo: '#1e293b',
      }),
    },
  },

  /* ── 5. דף נחיתה (Landing Page) — Bold Conversion ── */
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
              variant: 'fullscreen',
              title: 'המוצר שישנה לכם את החיים',
              subtitle: 'הצטרפו לאלפים שכבר נהנים מהשירות שלנו',
              backgroundImage: '',
              primaryBtnLabel: 'הרשמו עכשיו',
              primaryBtnHref: '#signup',
              primaryBtnVariant: 'filled',
              secondaryBtnLabel: 'למידע נוסף',
              secondaryBtnHref: '#info',
              secondaryBtnVariant: 'outline',
            },
          },
          {
            id: uid(), type: 'about',
            data: {
              variant: 'grid',
              items: [
                { icon: 'bolt', title: 'מהיר', description: 'תוצאות תוך דקות ספורות' },
                { icon: 'security', title: 'מאובטח', description: 'הנתונים שלכם בטוחים אצלנו' },
                { icon: 'auto_awesome', title: 'חכם', description: 'בינה מלאכותית שעובדת בשבילכם' },
              ],
            },
          },
          {
            id: uid(), type: 'quote',
            data: {
              text: 'המוצר הזה שינה לנו את החיים! תוך שבוע ראינו תוצאות מדהימות.',
              author: 'לקוח מרוצה',
              role: 'מנכ״ל',
            },
          },
          {
            id: uid(), type: 'cta',
            data: {
              variant: 'banner',
              title: 'אל תפספסו — ההטבה מוגבלת!',
              description: '',
              buttonLabel: 'הצטרפו עכשיו',
              buttonHref: '#signup',
            },
          },
          {
            id: uid(), type: 'contactForm',
            data: { variant: 'standalone', title: 'השאירו פרטים', buttonLabel: 'שלחו לי' },
          },
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
      themeJson: JSON.stringify({
        heading: '#ffffff',
        body: 'rgba(255,255,255,0.7)',
        btnText: '#ffffff',
        background: '#ffffff',
        overlay: 'rgba(0,0,0,0.5)',
        gradFrom: '#7c3aed',
        gradTo: '#4c1d95',
      }),
    },
  },

  /* ── ריק (Blank) — Start from scratch ── */
  {
    id: 'blank',
    name: 'ריק',
    description: 'התחילו מאפס ובנו את האתר בדיוק כמו שאתם רוצים',
    category: 'כללי',
    icon: 'draft',
    primaryColor: '#635BFF',
    pages: [
      {
        title: 'דף הבית',
        slug: 'home',
        template: 'blank',
        isHome: true,
        blocks: [
          {
            id: uid(), type: 'hero',
            data: {
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
            },
          },
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
