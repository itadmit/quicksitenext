import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

const features = [
  {
    icon: 'description',
    title: 'עורך עמודים ויזואלי',
    desc: 'בנו עמודים מרהיבים עם בלוקים — Hero, טקסט, תמונות, טפסים, CTA ועוד. גרירה ושחרור, בלי שורת קוד.',
  },
  {
    icon: 'article',
    title: 'בלוג מובנה',
    desc: 'מערכת פוסטים מלאה עם קטגוריות, תגיות, SEO אוטומטי ותצוגה מותאמת.',
  },
  {
    icon: 'contact_mail',
    title: 'ניהול לידים',
    desc: 'טפסי יצירת קשר, מעקב סטטוסים, הערות פנימיות — CRM קל ישירות מהדשבורד.',
  },
  {
    icon: 'web_asset',
    title: 'פופאפים חכמים',
    desc: 'פופאפים עם טריגרים מתקדמים — גלילה, יציאה, זמן שהייה, תדירות הצגה.',
  },
  {
    icon: 'menu',
    title: 'עורך תפריטים',
    desc: 'בנו תפריטי ניווט גמישים ל-Header ו-Footer עם תת-פריטים ולינקים.',
  },
  {
    icon: 'language',
    title: 'דומיין מותאם',
    desc: 'סאבדומיין חינמי מיידי + חיבור דומיין משלכם בקליק אחד.',
  },
  {
    icon: 'palette',
    title: 'עיצוב ומיתוג',
    desc: 'צבע ראשי, לוגו, פונטים ו-CSS מותאם — שליטה מלאה על המראה.',
  },
  {
    icon: 'extension',
    title: 'סוגי תוכן מותאמים',
    desc: 'צרו Custom Post Types עם שדות דינמיים — פורטפוליו, מוצרים, פרויקטים.',
  },
  {
    icon: 'image',
    title: 'ספריית מדיה',
    desc: 'העלו, נהלו ואגרו את כל התמונות והקבצים במקום אחד מסודר.',
  },
];

const steps = [
  {
    num: '1',
    title: 'צרו חשבון',
    desc: 'הרשמה מהירה בחינם — בלי כרטיס אשראי, בלי התחייבות.',
    icon: 'person_add',
  },
  {
    num: '2',
    title: 'עצבו ובנו',
    desc: 'בחרו צבעים, הוסיפו תוכן, בנו עמודים עם הבלוקים הוויזואליים.',
    icon: 'brush',
  },
  {
    num: '3',
    title: 'פרסמו',
    desc: 'חברו דומיין או השתמשו בסאבדומיין חינמי — והאתר שלכם באוויר.',
    icon: 'rocket_launch',
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

export default async function PlatformHomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-white text-charcoal overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-charcoal/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-charcoal">
              <span className="font-logo text-lg font-bold text-white leading-none" style={{ letterSpacing: '-0.03em' }}>Q</span>
            </div>
            <span className="font-logo text-xl font-bold text-charcoal" style={{ letterSpacing: '-0.03em' }}>
              Quick<span className="text-primary">Site</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-charcoal/60 transition hover:text-charcoal">יכולות</Link>
            <Link href="#how-it-works" className="text-sm text-charcoal/60 transition hover:text-charcoal">איך זה עובד</Link>
            <Link href="#testimonials" className="text-sm text-charcoal/60 transition hover:text-charcoal">לקוחות</Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-charcoal/80">
                דשבורד
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-charcoal/60 transition hover:text-charcoal">
                  התחברות
                </Link>
                <Link href="/register" className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-charcoal/80">
                  התחילו בחינם
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero — Light section */}
      <section className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Text */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                חינם לתמיד — בלי כרטיס אשראי
              </div>
              <h1 className="font-noto text-4xl font-black leading-[1.15] md:text-5xl lg:text-6xl">
                בנו אתר מקצועי
                <br />
                <span className="text-primary">בכמה דקות.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-charcoal/50">
                פלטפורמה ישראלית לבניית אתרים — עורך ויזואלי, בלוג, ניהול לידים, דומיין מותאם ועוד. הכל בעברית, הכל בחינם.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20"
                >
                  צרו את האתר שלכם
                  <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center rounded-full border-2 border-charcoal/10 px-8 py-4 text-sm font-semibold text-charcoal/70 transition-all hover:border-charcoal/20 hover:text-charcoal"
                >
                  למדו עוד
                </Link>
              </div>
            </div>

            {/* Visual — Browser mockup */}
            <div className="relative">
              <div className="rounded-2xl border border-charcoal/10 bg-white p-2 shadow-2xl shadow-charcoal/5">
                {/* Browser top bar */}
                <div className="flex items-center gap-2 rounded-t-xl bg-charcoal/[0.03] px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400/60" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                    <div className="h-3 w-3 rounded-full bg-green-400/60" />
                  </div>
                  <div className="mr-3 flex-1 rounded-lg bg-charcoal/5 px-3 py-1.5 text-xs text-charcoal/30 font-logo">
                    yoursite.quicksite.co.il
                  </div>
                </div>
                {/* Fake site content */}
                <div className="rounded-b-xl bg-gradient-to-b from-charcoal to-charcoal/95 p-6">
                  {/* Hero block */}
                  <div className="rounded-xl bg-gradient-to-bl from-primary/20 to-primary/5 p-8 text-center">
                    <div className="mx-auto h-4 w-40 rounded-full bg-white/15" />
                    <div className="mx-auto mt-3 h-3 w-56 rounded-full bg-white/8" />
                    <div className="mx-auto mt-5 flex justify-center gap-3">
                      <div className="h-8 w-28 rounded-full bg-primary/40" />
                      <div className="h-8 w-28 rounded-full bg-white/8" />
                    </div>
                  </div>
                  {/* Feature blocks */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg bg-white/[0.04] p-4">
                        <div className="h-6 w-6 rounded-md bg-primary/20 mb-2" />
                        <div className="h-2.5 w-16 rounded-full bg-white/12" />
                        <div className="mt-2 h-2 w-full rounded-full bg-white/5" />
                        <div className="mt-1 h-2 w-3/4 rounded-full bg-white/5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Decorative gradient blur */}
              <div className="absolute -z-10 -bottom-8 -right-8 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
              <div className="absolute -z-10 -top-8 -left-8 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by strip */}
      <section className="border-y border-charcoal/5 bg-charcoal/[0.02] px-6 py-10">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-charcoal/30">הפלטפורמה שנותנת לכם הכל — בחינם</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {['עמודים ללא הגבלה', 'בלוג מלא', 'ניהול לידים', 'פופאפים חכמים', 'דומיין מותאם', 'עיצוב חופשי'].map((item) => (
              <span key={item} className="text-sm font-semibold text-charcoal/25">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features — Dark section (WordPress style alternating) */}
      <section id="features" className="bg-charcoal px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">כלים חכמים</p>
            <h2 className="mt-4 font-noto text-4xl font-black md:text-5xl">
              כל מה שצריך לאתר מקצועי
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-charcoal/0 text-white/40">
              ערכת כלים מלאה — מעורך ויזואלי ועד ניהול לידים ודומיין מותאם.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/6 bg-white/[0.03] p-7 transition-all duration-300 hover:bg-white/[0.06] hover:border-primary/20 hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <span className="material-symbols-outlined text-xl text-primary">{f.icon}</span>
                </div>
                <h3 className="mb-2 font-noto text-lg font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-white/40">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — Light section */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">פשוט וקל</p>
            <h2 className="mt-4 font-noto text-4xl font-black md:text-5xl">
              שלושה צעדים לאתר שלכם
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <span className="material-symbols-outlined text-3xl text-primary">{step.icon}</span>
                </div>
                <div className="mb-2 font-logo text-sm font-bold text-primary">שלב {step.num}</div>
                <h3 className="mb-3 font-noto text-xl font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-charcoal/50">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase — Editor split section */}
      <section className="bg-charcoal/[0.02] border-y border-charcoal/5 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Visual */}
            <div className="order-2 md:order-1">
              <div className="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-2 border-b border-charcoal/5 pb-4">
                  <span className="material-symbols-outlined text-sm text-primary">edit_note</span>
                  <span className="text-sm font-semibold text-charcoal/60">עורך עמודים</span>
                </div>
                <div className="space-y-3">
                  {[
                    { type: 'Hero Block', icon: 'view_carousel', color: 'bg-amber-100 text-amber-600' },
                    { type: 'Text Block', icon: 'text_fields', color: 'bg-blue-100 text-blue-600' },
                    { type: 'Gallery Block', icon: 'photo_library', color: 'bg-purple-100 text-purple-600' },
                    { type: 'CTA Block', icon: 'ads_click', color: 'bg-emerald-100 text-emerald-600' },
                    { type: 'Contact Form', icon: 'mail', color: 'bg-rose-100 text-rose-600' },
                  ].map((block) => (
                    <div key={block.type} className="flex items-center gap-3 rounded-xl border border-charcoal/5 bg-charcoal/[0.02] p-3.5 transition hover:border-primary/20 hover:bg-primary/[0.02]">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${block.color}`}>
                        <span className="material-symbols-outlined text-lg">{block.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-charcoal/70">{block.type}</span>
                      <span className="material-symbols-outlined mr-auto text-lg text-charcoal/20">drag_indicator</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 md:order-2">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">עורך חזותי</p>
              <h2 className="mt-4 font-noto text-3xl font-black md:text-4xl">
                בנו כל עמוד שתדמיינו.
                <br />
                <span className="text-primary">בלוק אחרי בלוק.</span>
              </h2>
              <p className="mt-4 text-charcoal/50 leading-relaxed">
                העורך הוויזואלי שלנו מאפשר לכם לבנות כל עמוד — גיבור ראשי, גלריה, טופס, טקסט חופשי, CTA ועוד. פשוט בחרו בלוק, ערכו את התוכן, וזהו.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Hero', 'טקסט', 'תמונה', 'גלריה', 'CTA', 'טופס', 'ספייסר', 'HTML', 'פוסטים'].map((block) => (
                  <span key={block} className="rounded-full border border-charcoal/10 bg-white px-3 py-1 text-xs font-medium text-charcoal/50">{block}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">מה אומרים עלינו</p>
            <h2 className="mt-4 font-noto text-4xl font-black md:text-5xl">
              אנשים אוהבים את QuickSite
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-charcoal/5 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-charcoal/60">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-noto text-sm font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs text-charcoal/40">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — Dark */}
      <section className="bg-charcoal px-6 py-24 text-white text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-noto text-4xl font-black md:text-5xl">
            מוכנים להתחיל?
          </h2>
          <p className="mt-4 text-lg text-white/40">
            הצטרפו עכשיו — חינם לגמרי, בלי כרטיס אשראי, בלי הגבלת זמן.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20"
            >
              צרו חשבון חינם
              <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/15 px-10 py-4 text-sm font-semibold text-white/60 transition hover:border-white/30 hover:text-white"
            >
              כבר יש לי חשבון
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-charcoal/5 bg-white px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-charcoal">
              <span className="font-logo text-sm font-bold text-white leading-none" style={{ letterSpacing: '-0.03em' }}>Q</span>
            </div>
            <span className="font-logo text-lg font-bold text-charcoal" style={{ letterSpacing: '-0.03em' }}>
              Quick<span className="text-primary">Site</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8">
            <Link href="#features" className="text-sm text-charcoal/40 transition hover:text-charcoal">יכולות</Link>
            <Link href="#how-it-works" className="text-sm text-charcoal/40 transition hover:text-charcoal">איך זה עובד</Link>
            <Link href="#testimonials" className="text-sm text-charcoal/40 transition hover:text-charcoal">לקוחות</Link>
            <Link href="/login" className="text-sm text-charcoal/40 transition hover:text-charcoal">התחברות</Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-charcoal/30">
            © {new Date().getFullYear()} QuickSite. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
  );
}
