import RegisterForm from './RegisterForm';

export const metadata = { title: 'הרשמה | CMS Platform' };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-nude/50 px-4">
      <div className="w-full max-w-md border border-charcoal/10 bg-white p-8 shadow-sm">
        <h1 className="font-noto text-2xl font-black text-charcoal mb-1">הרשמה</h1>
        <p className="text-sm text-charcoal/60 mb-6">צרו חשבון והתחילו לבנות את האתר שלכם</p>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-charcoal/60">
          כבר יש חשבון?{' '}
          <a href="/login" className="text-primary hover:underline">התחברו</a>
        </p>
      </div>
    </div>
  );
}
