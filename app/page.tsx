import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

const features = [
  {
    icon: 'description',
    title: 'עורך עמודים ויזואלי',
    desc: 'בנו עמודים מרהיבים עם בלוקים — Hero, טקסט, תמונות, טפסים, CTA ועוד. גרירה ושחרור, בלי שורת קוד.',
    color: 'from-amber-500/20 to-yellow-500/20',
    iconBg: 'bg-amber-500/10',
  },
  {
    icon: 'article',
    title: 'בלוג מובנה',
    desc: 'מערכת פוסטים מלאה עם קטגוריות, תגיות, SEO אוטומטי ותצוגה מותאמת.',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconBg: 'bg-blue-500/10',
  },
  {
    icon: 'contact_mail',
    title: 'ניהול לידים',
    desc: 'טפסי יצירת קשר, מעקב סטטוסים, הערות פנימיות — CRM קל ישירות מהדשבורד.',
    color: 'from-emerald-500/20 to-green-500/20',
    iconBg: 'bg-emerald-500/10',
  },
  {
    icon: 'web_asset',
    title: 'פופאפים חכמים',
    desc: 'פופאפים עם טריגרים מתקדמים — גלילה, יציאה, זמן שהייה, תדירות הצגה ועוד.',
    color: 'from-purple-500/20 to-violet-500/20',
    iconBg: 'bg-purple-500/10',
  },
  {
    icon: 'menu',
    title: 'עורך תפריטים',
    desc: 'בנו תפריטי ניווט גמישים ל-Header ו-Footer עם תת-פריטים ולינקים מותאמים.',
    color: 'from-pink-500/20 to-rose-500/20',
    iconBg: 'bg-pink-500/10',
  },
  {
    icon: 'language',
    title: 'דומיין מותאם',
    desc: 'סאבדומיין חינמי מיידי + חיבור דומיין משלכם בקליק.',
    color: 'from-sky-500/20 to-indigo-500/20',
    iconBg: 'bg-sky-500/10',
  },
  {
    icon: 'palette',
    title: 'עיצוב ומיתוג',
    desc: 'צבע ראשי, לוגו, פונטים ו-CSS מותאם — שליטה מלאה על המראה בלי קוד.',
    color: 'from-orange-500/20 to-red-500/20',
    iconBg: 'bg-orange-500/10',
  },
  {
    icon: 'extension',
    title: 'סוגי תוכן מותאמים',
    desc: 'צרו Custom Post Types עם שדות דינמיים — פורטפוליו, מוצרים, פרויקטים ועוד.',
    color: 'from-teal-500/20 to-emerald-500/20',
    iconBg: 'bg-teal-500/10',
  },
  {
    icon: 'image',
    title: 'ספריית מדיה',
    desc: 'העלו, נהלו ואגרו את כל התמונות והקבצים במקום אחד מסודר.',
    color: 'from-fuchsia-500/20 to-pink-500/20',
    iconBg: 'bg-fuchsia-500/10',
  },
];

const stats = [
  { value: '9+', label: 'סוגי בלוקים' },
  { value: '∞', label: 'עמודים ופוסטים' },
  { value: '100%', label: 'בעברית' },
  { value: '0₪', label: 'לתמיד' },
];

const steps = [
  { num: '01', title: 'הרשמה מהירה', desc: 'צרו חשבון בחינם תוך שניות — בלי כרטיס אשראי, בלי התחייבות.' },
  { num: '02', title: 'עצבו את האתר', desc: 'בחרו צבעים, העלו לוגו, הגדירו תפריטים ובנו עמודים עם הבלוקים.' },
  { num: '03', title: 'פרסמו לעולם', desc: 'חברו דומיין משלכם או השתמשו בסאבדומיין חינמי — והאתר באוויר.' },
];

export default async function PlatformHomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-charcoal text-white overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-charcoal/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-gold-soft">
              <span className="text-sm font-bold text-charcoal">Q</span>
            </div>
            <span className="font-noto text-lg font-bold text-white">QuickSite</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-white/50 transition hover:text-white">יכולות</Link>
            <Link href="#how-it-works" className="text-sm text-white/50 transition hover:text-white">איך זה עובד</Link>
            <Link href="#stats" className="text-sm text-white/50 transition hover:text-white">למה אנחנו</Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90">
                דשבורד
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-white/60 transition hover:text-white">
                  התחברות
                </Link>
                <Link href="/register" className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20">
                  התחילו בחינם
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-20">
        {/* Background effects */}
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="grid-pattern absolute inset-0 opacity-50" />

        <div className="relative z-10 max-w-4xl text-center">
          {/* Badge */}
          <div className="badge-pulse mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            פלטפורמת בניית אתרים חינמית בעברית
          </div>

          {/* Main heading */}
          <h1 className="font-noto text-5xl font-black leading-[1.1] md:text-7xl lg:text-8xl">
            בנו אתר שנראה
            <br />
            <span className="bg-gradient-to-l from-primary via-gold-soft to-primary bg-clip-text text-transparent animate-gradient-x">
              מיליון דולר.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/40 md:text-xl">
            עורך ויזואלי, בלוג, ניהול לידים, פופאפים, תפריטים, דומיין מותאם
            {' '}ועיצוב מלא — הכל במקום אחד. בחינם. לתמיד.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="group relative rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/25 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-2">
                התחילו בחינם
                <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
              </span>
            </Link>
            <Link
              href="#features"
              className="rounded-xl border border-white/10 px-8 py-4 text-sm font-semibold text-white/60 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              גלו את היכולות
            </Link>
          </div>

          {/* Mini preview */}
          <div className="relative mx-auto mt-20 max-w-3xl">
            <div className="glass-card rounded-2xl p-1">
              <div className="rounded-xl bg-charcoal/80 p-4">
                {/* Fake browser chrome */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-white/10" />
                    <div className="h-3 w-3 rounded-full bg-white/10" />
                    <div className="h-3 w-3 rounded-full bg-white/10" />
                  </div>
                  <div className="mx-4 flex-1 rounded-md bg-white/5 px-3 py-1.5 text-xs text-white/30">
                    yoursite.quicksite.co.il
                  </div>
                </div>
                {/* Fake content */}
                <div className="space-y-3">
                  <div className="rounded-lg bg-gradient-to-l from-primary/10 to-primary/5 p-6">
                    <div className="h-4 w-48 rounded bg-white/10" />
                    <div className="mt-2 h-3 w-72 rounded bg-white/5" />
                    <div className="mt-4 flex gap-2">
                      <div className="h-8 w-24 rounded-md bg-primary/30" />
                      <div className="h-8 w-24 rounded-md bg-white/5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-white/[0.03] p-4">
                      <div className="h-3 w-16 rounded bg-white/10" />
                      <div className="mt-2 h-2 w-full rounded bg-white/5" />
                    </div>
                    <div className="rounded-lg bg-white/[0.03] p-4">
                      <div className="h-3 w-16 rounded bg-white/10" />
                      <div className="mt-2 h-2 w-full rounded bg-white/5" />
                    </div>
                    <div className="rounded-lg bg-white/[0.03] p-4">
                      <div className="h-3 w-16 rounded bg-white/10" />
                      <div className="mt-2 h-2 w-full rounded bg-white/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow under preview */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-20 w-3/4 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative border-t border-white/5 px-6 py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="stat-glow font-noto text-4xl font-black text-primary md:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative px-6 py-24 section-connector">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              הכלים שלנו
            </div>
            <h2 className="font-noto text-4xl font-black md:text-5xl">
              כל מה שצריך.
              <br />
              <span className="text-white/40">שום דבר מיותר.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/40">
              ערכת כלים שלמה לבניית אתר מקצועי — מעורך ויזואלי ועד ניהול לידים.
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="feature-card rounded-xl p-6">
                <div className={`feature-icon mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${f.iconBg}`}>
                  <span className="material-symbols-outlined text-xl text-primary">{f.icon}</span>
                </div>
                <h3 className="mb-2 font-noto text-lg font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-white/40">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              שלושה צעדים
            </div>
            <h2 className="font-noto text-4xl font-black md:text-5xl">
              מרעיון לאתר
              <br />
              <span className="text-white/40">בשלושה צעדים.</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {/* Connector line between steps */}
                {i < steps.length - 1 && (
                  <div className="absolute left-0 top-8 hidden h-[1px] w-full -translate-x-full bg-gradient-to-l from-primary/20 to-transparent md:block" />
                )}
                <div className="glass-card rounded-xl p-8">
                  <div className="mb-4 font-noto text-3xl font-black text-primary/30">{step.num}</div>
                  <h3 className="mb-3 font-noto text-xl font-bold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-white/40">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase section */}
      <section className="relative border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Left - Text */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                <span className="material-symbols-outlined text-sm">dashboard_customize</span>
                עורך חזותי
              </div>
              <h2 className="font-noto text-3xl font-black md:text-4xl">
                בנו עמודים
                <br />
                <span className="text-primary">בלוק אחרי בלוק.</span>
              </h2>
              <p className="mt-4 text-white/40 leading-relaxed">
                העורך הוויזואלי שלנו מאפשר לכם לבנות כל עמוד שתרצו — גיבור ראשי, גלריה, טופס, טקסט חופשי, CTA ועוד. פשוט בחרו בלוק, ערכו את התוכן, והכל מתעדכן בזמן אמת.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Hero', 'טקסט', 'תמונה', 'גלריה', 'CTA', 'טופס', 'ספייסר', 'HTML'].map((block) => (
                  <span key={block} className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">{block}</span>
                ))}
              </div>
            </div>
            {/* Right - Visual */}
            <div className="relative">
              <div className="glass-card animate-float rounded-2xl p-6">
                <div className="space-y-3">
                  {[
                    { type: 'Hero Block', color: 'bg-primary/20', icon: 'view_carousel' },
                    { type: 'Text Block', color: 'bg-blue-500/20', icon: 'text_fields' },
                    { type: 'CTA Block', color: 'bg-emerald-500/20', icon: 'ads_click' },
                  ].map((block) => (
                    <div key={block.type} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-4">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${block.color}`}>
                        <span className="material-symbols-outlined text-sm text-white/70">{block.icon}</span>
                      </div>
                      <span className="text-sm text-white/60">{block.type}</span>
                      <span className="material-symbols-outlined mr-auto text-sm text-white/20">drag_indicator</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-32">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="font-noto text-4xl font-black md:text-6xl">
            מוכנים לבנות
            <br />
            <span className="bg-gradient-to-l from-primary via-gold-soft to-primary bg-clip-text text-transparent">
              את האתר שלכם?
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-white/40">
            הצטרפו עכשיו — חינם לגמרי, בלי כרטיס אשראי, בלי הגבלת זמן.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="group rounded-xl bg-primary px-10 py-4 text-sm font-bold text-white shadow-2xl shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 hover:scale-[1.02]"
            >
              <span className="flex items-center gap-2">
                צרו חשבון חינם
                <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
              </span>
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/10 px-10 py-4 text-sm text-white/60 transition-all hover:border-white/20 hover:text-white"
            >
              כבר יש לי חשבון
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-gold-soft">
              <span className="text-xs font-bold text-charcoal">Q</span>
            </div>
            <span className="font-noto text-sm font-bold text-white/60">QuickSite</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-xs text-white/30 transition hover:text-white/60">יכולות</Link>
            <Link href="#how-it-works" className="text-xs text-white/30 transition hover:text-white/60">איך זה עובד</Link>
            <Link href="/login" className="text-xs text-white/30 transition hover:text-white/60">התחברות</Link>
          </div>
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} QuickSite. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
  );
}
