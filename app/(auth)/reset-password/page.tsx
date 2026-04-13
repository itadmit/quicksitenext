import ResetPasswordForm from './ResetPasswordForm';
import { Zap, ArrowRight } from 'lucide-react';

export const metadata = { title: 'איפוס סיסמה | QuickSite' };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="relative min-h-screen bg-[#f6f7fb] font-sans" dir="rtl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-gradient-to-br from-ocean/5 to-purple-500/5" />
        <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/5 to-amber-500/5" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ocean">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-noto text-2xl font-bold text-slate-800">איפוס סיסמה</h1>
            <p className="mt-2 text-slate-500">בחרו סיסמה חדשה לחשבון שלכם</p>
          </div>

          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="text-center">
              <p className="text-sm text-red-600">קישור לא תקין. בקשו קישור חדש.</p>
              <a
                href="/forgot-password"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ocean transition-colors hover:text-ocean/80 cursor-pointer"
              >
                שכחת סיסמה?
              </a>
            </div>
          )}

          <div className="mt-8 text-center">
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-ocean transition-colors hover:text-ocean/80 cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
              חזרה להתחברות
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
