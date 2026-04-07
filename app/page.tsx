import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export default async function PlatformHomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-charcoal text-white">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-charcoal/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-2xl font-bold tracking-wide text-primary">CMS Platform</span>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="bg-primary px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-primary/90">
                דשבורד
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 transition hover:text-white">
                  התחברות
                </Link>
                <Link href="/register" className="bg-primary px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-primary/90">
                  התחילו בחינם
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="max-w-3xl text-center">
          <div className="mb-6 inline-block border border-primary/30 bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            פלטפורמת ניהול אתרים
          </div>
          <h1 className="font-noto text-5xl font-black leading-[1.15] md:text-7xl">
            בנו אתר מקצועי
            <br />
            <span className="text-primary">בדקות.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/50 md:text-xl">
            עמודים, בלוג, לידים, פופאפים, תפריטים, הגדרות עיצוב ודומיין מותאם —
            <br className="hidden md:block" />
            הכל במקום אחד, בעברית, בחינם.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register" className="bg-primary px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-primary/90">
              צרו חשבון חינם
            </Link>
            <Link href="#features" className="border border-white/15 px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 transition hover:border-white/30 hover:text-white">
              גלו עוד
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            פיצ&apos;רים
          </h2>
          <p className="mb-16 text-center font-noto text-3xl font-black md:text-4xl">
            כל מה שצריך לאתר מקצועי
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: 'description', title: 'עורך עמודים', desc: 'עורך בלוקים ויזואלי — Hero, טקסט, תמונות, טפסים, CTA ועוד' },
              { icon: 'article', title: 'בלוג', desc: 'מערכת פוסטים מלאה עם קטגוריות, תגיות ו-SEO' },
              { icon: 'contact_mail', title: 'ניהול לידים', desc: 'טופס יצירת קשר, מעקב סטטוסים והערות פנימיות' },
              { icon: 'web_asset', title: 'פופאפים', desc: 'פופאפים חכמים — טריגרים, תדירות, עיצוב מותאם' },
              { icon: 'menu', title: 'תפריטים', desc: 'עורך תפריט גמיש ל-Header ו-Footer' },
              { icon: 'language', title: 'דומיין מותאם', desc: 'סאבדומיין חינמי + אפשרות חיבור דומיין משלכם' },
              { icon: 'palette', title: 'עיצוב', desc: 'צבע ראשי, לוגו, CSS מותאם — בלי קוד' },
              { icon: 'extension', title: 'תוכן מותאם', desc: 'צרו סוגי תוכן מותאמים (CPT) עם שדות דינמיים' },
              { icon: 'image', title: 'ספריית מדיה', desc: 'העלו תמונות ונהלו את כל הקבצים במקום אחד' },
            ].map((f) => (
              <div key={f.title} className="group border border-white/5 bg-white/[0.02] p-6 transition hover:border-primary/20 hover:bg-primary/[0.03]">
                <span className="material-symbols-outlined mb-4 block text-2xl text-primary">{f.icon}</span>
                <h3 className="mb-2 font-noto text-lg font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 px-6 py-24 text-center">
        <h2 className="font-noto text-3xl font-black md:text-4xl">
          מוכנים להתחיל?
        </h2>
        <p className="mt-4 text-white/50">
          הירשמו עכשיו — חינם, בלי כרטיס אשראי.
        </p>
        <Link href="/register" className="mt-8 inline-block bg-primary px-12 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-primary/90">
          צרו חשבון
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-white/30">
        © {new Date().getFullYear()} CMS Platform. כל הזכויות שמורות.
      </footer>
    </div>
  );
}
