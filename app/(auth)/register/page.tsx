import RegisterForm from './RegisterForm';

export const metadata = { title: 'הרשמה | QuickSite' };

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF9] px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean shadow-lg shadow-ocean/20">
            <span className="material-symbols-outlined text-[24px] text-white">bolt</span>
          </div>
          <h1 className="font-noto text-2xl font-black text-navy">QuickSite</h1>
          <p className="mt-1 text-sm text-slate-400">בנו אתר מקצועי תוך דקות</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white px-8 py-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <RegisterForm />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-400">
          כבר יש חשבון?{' '}
          <a href="/login" className="font-semibold text-ocean hover:underline">התחברו</a>
        </p>
      </div>
    </div>
  );
}
