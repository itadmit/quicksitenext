import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import PremiumContactForm from '@/components/PremiumContactForm';
import WizardDemo from '@/components/home/WizardDemo';
import {
  FileText,
  BookOpen,
  Mail,
  Zap,
  Menu,
  Globe,
  Palette,
  Puzzle,
  Image,
  UserPlus,
  Brush,
  Rocket,
  ArrowLeft,
  Star,
  Check,
  HardDrive,
  Shield,
  Headphones,
  MessageCircle,
  Send,
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'עורך עמודים ויזואלי',
    desc: 'בנו עמודים מרהיבים עם בלוקים — Hero, טקסט, תמונות, טפסים, CTA ועוד. גרירה ושחרור, בלי שורת קוד.',
  },
  {
    icon: BookOpen,
    title: 'בלוג מובנה',
    desc: 'מערכת פוסטים מלאה עם קטגוריות, תגיות, SEO אוטומטי ותצוגה מותאמת.',
  },
  {
    icon: Mail,
    title: 'ניהול לידים',
    desc: 'טפסי יצירת קשר, מעקב סטטוסים, הערות פנימיות — CRM קל ישירות מהדשבורד.',
  },
  {
    icon: Zap,
    title: 'פופאפים חכמים',
    desc: 'פופאפים עם טריגרים מתקדמים — גלילה, יציאה, זמן שהייה, תדירות הצגה.',
  },
  {
    icon: Menu,
    title: 'עורך תפריטים',
    desc: 'בנו תפריטי ניווט גמישים ל-Header ו-Footer עם תת-פריטים ולינקים.',
  },
  {
    icon: Globe,
    title: 'דומיין מותאם',
    desc: 'סאבדומיין חינמי מיידי + חיבור דומיין משלכם בקליק אחד.',
  },
  {
    icon: Palette,
    title: 'עיצוב ומיתוג',
    desc: 'צבע ראשי, לוגו, פונטים ו-CSS מותאם — שליטה מלאה על המראה.',
  },
  {
    icon: Puzzle,
    title: 'סוגי תוכן מותאמים',
    desc: 'צרו Custom Post Types עם שדות דינמיים — פורטפוליו, מוצרים, פרויקטים.',
  },
  {
    icon: Image,
    title: 'ספריית מדיה',
    desc: 'העלו, נהלו ואגרו את כל התמונות והקבצים במקום אחד מסודר.',
  },
  {
    icon: MessageCircle,
    title: 'צ׳אט בוט לאתר',
    desc: 'הוסיפו צ׳אט בוט חכם לאתר — ענו ללקוחות אוטומטית, אספו לידים ותנו שירות 24/7.',
  },
  {
    icon: Send,
    title: 'התראות WhatsApp ו-SMS',
    desc: 'שלחו הודעת WhatsApp או SMS אוטומטית לכל ליד שנרשם — תגובה מיידית שמגדילה סגירות.',
  },
];

const stats = [
  { value: '69₪', label: 'מחיר התחלתי לחודש' },
  { value: '∞', label: 'עמודים ואתרים' },
  { value: '99.9%', label: 'זמינות שרתים' },
  { value: '30 שנ׳', label: 'עד לאתר מוכן' },
];

const steps = [
  {
    num: '01',
    title: 'צרו חשבון',
    desc: 'הרשמה מהירה בחינם — בלי כרטיס אשראי, בלי התחייבות.',
    icon: UserPlus,
  },
  {
    num: '02',
    title: 'עצבו ובנו',
    desc: 'בחרו צבעים, הוסיפו תוכן, בנו עמודים עם הבלוקים הוויזואליים.',
    icon: Brush,
  },
  {
    num: '03',
    title: 'פרסמו',
    desc: 'חברו דומיין או השתמשו בסאבדומיין חינמי — והאתר שלכם באוויר.',
    icon: Rocket,
  },
];

const testimonials = [
  {
    name: 'מיכל כ.',
    role: 'מעצבת גרפית',
    text: 'בניתי אתר תיק עבודות תוך שעה. העורך הויזואלי פשוט גאוני.',
  },
  {
    name: 'יוסי ד.',
    role: 'בעל עסק קטן',
    text: 'סוף סוף פלטפורמה בעברית שלא צריך לשלם עליה הון. ממליץ בחום.',
  },
  {
    name: 'נועה ר.',
    role: 'יועצת שיווק',
    text: 'ניהול הלידים מובנה ישירות באתר — חוסך לי כלי נוסף ותשלום חודשי.',
  },
];

const pricingPlans = [
  {
    name: 'בסיסי',
    price: '69',
    period: 'חודש',
    description: 'לעסקים קטנים שרוצים נוכחות דיגיטלית מהירה ופשוטה.',
    popular: false,
    cta: 'התחילו עכשיו',
    highlights: [
      { text: 'אתר אחד', bold: true },
      { text: '1GB אחסון', bold: true },
    ],
    features: [
      'תעודת SSL מוצפנת',
      'סאבדומיין חינמי',
      'עורך ויזואלי מלא',
      'עד 5 עמודים',
      'ספריית מדיה',
      'ביצועים ומהירות מותאמים',
      'אבטחה מתקדמת',
      'תמיכה במייל',
    ],
  },
  {
    name: 'מקצועי',
    price: '159',
    period: 'חודש',
    description: 'לעסקים שרוצים לצמוח — יותר אתרים, כלים מתקדמים ותמיכה מהירה.',
    popular: true,
    cta: 'התחילו עכשיו',
    highlights: [
      { text: 'עד 3 אתרים', bold: true },
      { text: '5GB אחסון', bold: true },
    ],
    features: [
      'הכל בחבילת בסיסי, ובנוסף:',
      'דומיין מותאם אישי',
      'עמודים ללא הגבלה',
      'בלוג מובנה',
      'ניהול לידים + CRM',
      'טפסי יצירת קשר',
      'SEO אוטומטי',
      'תמיכה בצ׳אט',
    ],
  },
  {
    name: 'עסקי',
    price: '299',
    period: 'חודש',
    description: 'לסוכנויות ועסקים עם מספר מותגים — שליטה מקסימלית על הכל.',
    popular: false,
    cta: 'צרו קשר',
    highlights: [
      { text: 'עד 5 אתרים', bold: true },
      { text: '10GB אחסון', bold: true },
    ],
    features: [
      'הכל בחבילת מקצועי, ובנוסף:',
      'פופאפים חכמים',
      'סוגי תוכן מותאמים (CPT)',
      'CSS מותאם אישי',
      'עורך תפריטים מתקדם',
      'ניהול משתמשים ותפקידים',
      'גיבויים אוטומטיים',
      'תמיכה בעדיפות עליונה',
    ],
  },
];


export default async function PlatformHomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-navy">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex cursor-pointer items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean">
                <span className="font-logo text-base font-bold text-white leading-none">Q</span>
              </div>
              <span className="font-logo text-lg font-bold text-navy" style={{ letterSpacing: '-0.02em' }}>
                Quick<span className="text-ocean">Site</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-7 md:flex">
              <Link href="#features" className="cursor-pointer text-[15px] text-slate-500 transition-colors duration-200 hover:text-navy">יכולות</Link>
              <Link href="#pricing" className="cursor-pointer text-[15px] text-slate-500 transition-colors duration-200 hover:text-navy">מחירים</Link>
              <Link href="#how-it-works" className="cursor-pointer text-[15px] text-slate-500 transition-colors duration-200 hover:text-navy">איך זה עובד</Link>
              <Link href="#testimonials" className="cursor-pointer text-[15px] text-slate-500 transition-colors duration-200 hover:text-navy">לקוחות</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="cursor-pointer rounded-full bg-ocean px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ocean/85">
                דשבורד
              </Link>
            ) : (
              <>
                <Link href="/login" className="cursor-pointer text-[15px] text-slate-500 transition-colors duration-200 hover:text-navy">
                  התחברות
                </Link>
                <Link href="/register" className="cursor-pointer rounded-full bg-ocean px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ocean/85">
                  התחילו עכשיו
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero — Centered, Stripe-style ── */}
      <section className="px-6 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1
            className="hp-enter font-noto text-[2.75rem] font-black leading-[1.1] text-navy md:text-6xl lg:text-7xl"
            style={{ animationDelay: '0.1s' }}
          >
            בנו אתר מקצועי
            {' '}
            <span className="hp-gradient-text">בקלות ובמהירות.</span>
          </h1>

          <p
            className="hp-enter mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-slate-500 md:text-[1.35rem]"
            style={{ animationDelay: '0.25s' }}
          >
            בחרו תבנית, ערכו את התוכן, ותפרסמו — בלי קוד, בלי מתכנת.
            הכל בעברית, הכל במקום אחד.
          </p>

          <div
            className="hp-enter mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            style={{ animationDelay: '0.4s' }}
          >
            <Link
              href="/register"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-ocean px-8 py-3.5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-ocean/85"
            >
              התחילו עכשיו
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            </Link>
            <Link
              href="#features"
              className="cursor-pointer rounded-full border border-slate-200 px-8 py-3.5 text-[15px] font-semibold text-slate-600 transition-colors duration-200 hover:border-slate-300 hover:text-navy"
            >
              גלו את היכולות
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar — Stripe-style ── */}
      <section className="border-y border-slate-100 bg-ocean-bg px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-noto text-4xl font-black text-navy md:text-5xl">{stat.value}</div>
                <div className="mt-2 text-sm font-medium text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-noto text-3xl font-black text-navy md:text-[2.75rem] md:leading-[1.15]">
              פתרון גמיש לכל אתר.
            </h2>
            <p className="mt-5 text-lg text-slate-500">
              ערכת כלים מלאה שנועדה לעבוד בנפרד או ביחד — מעורך ויזואלי ועד ניהול לידים.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="hp-card cursor-pointer rounded-2xl border border-slate-200 bg-white p-7 hover:border-ocean/25"
                >
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ocean/[0.08]">
                    <Icon className="hp-card-icon h-[18px] w-[18px] text-ocean" />
                  </div>
                  <h3 className="mb-2 font-noto text-base font-bold text-navy">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Wizard Demo — Interactive ── */}
      <section className="bg-navy px-6 py-24 text-white md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-ocean-light">נסו בעצמכם</p>
            <h2 className="mt-4 font-noto text-3xl font-black md:text-[2.75rem] md:leading-[1.15]">
              ככה בונים אתר.
              <br />
              <span className="text-ocean-light">תוך דקות.</span>
            </h2>
            <p className="mt-4 text-white/40">
              עברו על השלבים וראו איך האתר שלכם נוצר בזמן אמת
            </p>
          </div>
          <WizardDemo />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-noto text-3xl font-black text-navy md:text-[2.75rem] md:leading-[1.15]">
              שלושה צעדים לאתר שלכם.
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative rounded-2xl border border-slate-100 bg-ocean-bg p-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-ocean/10">
                    <Icon className="h-6 w-6 text-ocean" />
                  </div>
                  <div className="mb-3 font-logo text-xs font-bold tracking-wider text-ocean">שלב {step.num.replace(/^0/, '')}</div>
                  <h3 className="mb-3 font-noto text-xl font-bold text-navy">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="border-t border-slate-100 bg-ocean-bg px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-noto text-3xl font-black text-navy md:text-[2.75rem] md:leading-[1.15]">
              תמחור פשוט, בלי הפתעות.
            </h2>
            <p className="mt-5 text-lg text-slate-500">
              בחרו את החבילה שמתאימה לכם. כל המחירים לא כוללים מע&quot;מ.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-white p-8 transition-shadow duration-200 ${
                  plan.popular
                    ? 'border-ocean shadow-lg shadow-ocean/10 ring-1 ring-ocean'
                    : 'border-slate-200 hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-ocean px-4 py-1 text-xs font-bold text-white">
                    הכי פופולרי
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-noto text-xl font-bold text-navy">{plan.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="font-noto text-5xl font-black text-navy">{plan.price}</span>
                    <span className="text-lg font-semibold text-slate-400">₪</span>
                    <span className="mr-1 text-sm text-slate-400">/ {plan.period}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">+ מע&quot;מ</p>
                </div>

                <div className="mb-8 space-y-3 border-t border-slate-100 pt-6">
                  {plan.highlights.map((h) => (
                    <div key={h.text} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-ocean/10">
                        <Check className="h-3 w-3 text-ocean" />
                      </div>
                      <span className="text-sm font-bold text-navy">{h.text}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/register"
                  className={`mb-8 block cursor-pointer rounded-full py-3 text-center text-sm font-semibold transition-colors duration-200 ${
                    plan.popular
                      ? 'bg-ocean text-white hover:bg-ocean/85'
                      : 'border border-slate-200 text-navy hover:border-ocean hover:text-ocean'
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="space-y-3">
                  {plan.features.map((feature, i) => {
                    const isHeader = feature.endsWith(':');
                    return (
                      <div key={i} className="flex items-start gap-3">
                        {!isHeader && (
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-ocean/50" />
                        )}
                        <span
                          className={`text-sm leading-relaxed ${
                            isHeader
                              ? 'font-semibold text-navy'
                              : 'text-slate-600'
                          }`}
                        >
                          {feature}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10">
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-right">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-ocean/[0.08]">
                  <Headphones className="h-6 w-6 text-ocean" />
                </div>
                <div className="flex-1">
                  <h3 className="font-noto text-lg font-bold text-navy">צריכים חבילה מותאמת?</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    לעסקים עם צרכים ייחודיים — אחסון נוסף, אתרים נוספים, SLA מותאם ועוד. דברו איתנו.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="cursor-pointer whitespace-nowrap rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-navy transition-colors duration-200 hover:border-ocean hover:text-ocean"
                >
                  צרו קשר
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <h3 className="mb-8 text-center font-noto text-lg font-bold text-navy">כל החבילות כוללות</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[
                { icon: Shield, text: 'SSL מוצפן' },
                { icon: Zap, text: 'ביצועים מהירים' },
                { icon: HardDrive, text: 'CDN עולמי' },
                { icon: Globe, text: 'SEO מובנה' },
                { icon: Image, text: 'ספריית מדיה' },
                { icon: Palette, text: 'עורך ויזואלי' },
                { icon: Shield, text: 'אבטחה מתקדמת' },
                { icon: Rocket, text: 'זמינות 99.9%' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3 rounded-xl bg-white p-4">
                    <Icon className="h-4 w-4 flex-shrink-0 text-ocean" />
                    <span className="text-sm font-medium text-navy">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Premium — Done For You ── */}
      <section id="premium" className="bg-navy px-6 py-24 text-white md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-ocean-light">שירות פרימיום</p>
              <h2 className="mt-4 font-noto text-3xl font-black md:text-[2.75rem] md:leading-[1.15]">
                רוצים שנקים
                <br />
                <span className="hp-gradient-text">את האתר עבורכם?</span>
              </h2>
              <p className="mt-6 max-w-md text-white/50 leading-relaxed">
                צוות המעצבים שלנו יבנה עבורכם אתר תדמית או דף נחיתה מרהיב,
                מותאם אישית לעסק שלכם — מהעיצוב דרך התוכן ועד העלייה לאוויר.
              </p>

              <div className="mt-10 flex items-baseline gap-2">
                <span className="font-noto text-5xl font-black">4,999</span>
                <span className="text-xl font-semibold text-white/50">₪</span>
                <span className="mr-2 text-sm text-white/30">חד פעמי + מע&quot;מ</span>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  'עיצוב מותאם אישית מלא',
                  'עד 5 עמודי תוכן',
                  'התאמה מלאה למובייל',
                  'חיבור דומיין משלכם',
                  'הגדרת SEO בסיסי',
                  'ספריית תמונות מקצועית',
                  '2 סבבי תיקונים',
                  'מסירה תוך 7 ימי עסקים',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-ocean/20">
                      <Check className="h-3 w-3 text-ocean-light" />
                    </div>
                    <span className="text-sm text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white p-8 md:p-10">
              <h3 className="mb-1 font-noto text-xl font-bold text-navy">השאירו פרטים</h3>
              <p className="mb-6 text-sm text-slate-500">נחזור אליכם עם הצעה מותאמת תוך 24 שעות.</p>
              <PremiumContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="border-t border-slate-100 bg-ocean-bg px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-noto text-3xl font-black text-navy md:text-[2.75rem] md:leading-[1.15]">
              עסקים בכל הגדלים בוחרים ב-QuickSite.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="hp-card cursor-pointer rounded-2xl border border-slate-200 bg-white p-8 hover:border-ocean/20"
              >
                <div className="mb-5 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-ocean text-ocean" />
                  ))}
                </div>
                <p className="text-[15px] leading-[1.75] text-slate-600">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ocean/10 font-noto text-sm font-bold text-ocean">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-navy">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-navy px-6 py-24 text-white md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-noto text-4xl font-black md:text-5xl">
            מוכנים להתחיל?
          </h2>
          <p className="mt-6 text-lg text-white/50">
            צרו חשבון ברגע, או צרו קשר כדי לשמוע עוד.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-ocean px-8 py-3.5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-ocean/85"
            >
              התחילו עכשיו
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="cursor-pointer rounded-full border border-white/15 px-8 py-3.5 text-[15px] font-semibold text-white/50 transition-colors duration-200 hover:border-white/30 hover:text-white/75"
            >
              כבר יש לי חשבון
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-3xl gap-6 border-t border-white/[0.06] pt-14 sm:grid-cols-2">
          <Link href="#pricing" className="block cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 transition-colors duration-200 hover:border-ocean/30 hover:bg-white/[0.06]">
            <h3 className="font-noto text-base font-bold">ראו כמה תשלמו</h3>
            <p className="mt-2 text-sm text-white/40">שלוש חבילות פשוטות — בחרו את המתאימה לכם.</p>
          </Link>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
            <h3 className="font-noto text-base font-bold">התחילו לבנות</h3>
            <p className="mt-2 text-sm text-white/40">העלו אתר תוך 10 דקות עם העורך הוויזואלי.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <Link href="/" className="flex cursor-pointer items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ocean">
                  <span className="font-logo text-sm font-bold text-white leading-none">Q</span>
                </div>
                <span className="font-logo text-lg font-bold text-navy" style={{ letterSpacing: '-0.02em' }}>
                  Quick<span className="text-ocean">Site</span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-slate-400">
                פלטפורמת בניית אתרים בעברית.
                <br />
                חינם לתמיד.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">מוצר</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="#features" className="cursor-pointer text-sm text-slate-500 transition-colors duration-200 hover:text-navy">יכולות</Link></li>
                <li><Link href="#how-it-works" className="cursor-pointer text-sm text-slate-500 transition-colors duration-200 hover:text-navy">איך זה עובד</Link></li>
                <li><Link href="#pricing" className="cursor-pointer text-sm text-slate-500 transition-colors duration-200 hover:text-navy">מחירים</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">חברה</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="#testimonials" className="cursor-pointer text-sm text-slate-500 transition-colors duration-200 hover:text-navy">לקוחות</Link></li>
                <li><Link href="/login" className="cursor-pointer text-sm text-slate-500 transition-colors duration-200 hover:text-navy">התחברות</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">התחלה מהירה</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="/register" className="cursor-pointer text-sm text-slate-500 transition-colors duration-200 hover:text-navy">צרו חשבון</Link></li>
                <li><Link href="/register" className="cursor-pointer text-sm text-slate-500 transition-colors duration-200 hover:text-navy">העלו אתר</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-14 border-t border-slate-100 pt-8">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} QuickSite. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
