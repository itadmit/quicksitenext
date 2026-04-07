import LoginForm from './LoginForm';

export const metadata = { title: 'התחברות | CMS Platform' };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-nude/50 px-4">
      <div className="w-full max-w-md border border-charcoal/10 bg-white p-8 shadow-sm">
        <h1 className="font-noto text-2xl font-black text-charcoal mb-1">התחברות</h1>
        <p className="text-sm text-charcoal/60 mb-6">הזינו את פרטי החשבון שלכם</p>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-charcoal/60">
          אין חשבון?{' '}
          <a href="/register" className="text-primary hover:underline">הירשמו</a>
        </p>
      </div>
    </div>
  );
}
