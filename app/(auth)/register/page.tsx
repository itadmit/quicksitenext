import RegisterForm from './RegisterForm';
import { Zap, MousePointerClick, Globe, BarChart3 } from 'lucide-react';

export const metadata = { title: 'הרשמה | QuickSite' };

const features = [
  {
    Icon: MousePointerClick,
    title: 'עורך ויזואלי מלא',
    desc: 'בנו עמודים מרהיבים עם בלוקים — בלי שורת קוד',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    Icon: Globe,
    title: 'דומיין מותאם אישי',
    desc: 'סאבדומיין חינמי מיידי + חיבור דומיין משלכם בקליק',
    bg: 'bg-purple-500/10',
    color: 'text-purple-500',
  },
  {
    Icon: BarChart3,
    title: 'ניהול לידים מובנה',
    desc: 'טפסים, מעקב סטטוסים והערות — CRM ישירות מהדשבורד',
    bg: 'bg-amber-500/10',
    color: 'text-amber-500',
  },
];

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-[#f6f7fb] font-sans" dir="rtl">
      {/* Decorative background circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-gradient-to-br from-ocean/5 to-purple-500/5" />
        <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/5 to-amber-500/5" />
        <div className="absolute right-[10%] top-[8%] h-72 w-72 rounded-full bg-gradient-to-bl from-ocean/[0.04] to-sky-400/[0.06]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Right Panel — Product info (white) */}
        <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-white p-12 lg:flex">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gradient-to-br from-ocean/[0.04] to-sky-300/[0.06]" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-400/[0.03] to-amber-300/[0.04]" />

          <div className="relative max-w-md text-center">
            <div className="mb-8">
              <div className="mx-auto mb-6 inline-flex h-16 w-16 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-ocean">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h1 className="mb-4 font-noto text-3xl font-bold text-slate-800">
                התחילו לבנות את האתר שלכם
              </h1>
              <p className="text-lg leading-relaxed text-slate-500">
                הרשמה מהירה בחינם — בלי כרטיס אשראי, בלי התחייבות.
              </p>
            </div>

            <div className="space-y-6 text-right">
              {features.map((f) => (
                <div key={f.title} className="flex items-center">
                  <div className={`ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${f.bg}`}>
                    <f.Icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700">{f.title}</h3>
                    <p className="text-sm text-slate-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Left Panel — Register form */}
        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-2xl">
            {/* Mobile logo */}
            <div className="mb-6 text-center lg:hidden">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ocean">
                <Zap className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)]">
              <RegisterForm />
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-500">
                כבר יש חשבון?{' '}
                <a href="/login" className="font-medium text-ocean transition-colors duration-200 hover:text-ocean/80 cursor-pointer">
                  התחברו
                </a>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                בהרשמה אתם מסכימים ל
                <a href="#" className="text-ocean transition-colors duration-200 hover:text-ocean/80">תנאי השימוש</a>
                {' '}ול
                <a href="#" className="text-ocean transition-colors duration-200 hover:text-ocean/80">מדיניות הפרטיות</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
