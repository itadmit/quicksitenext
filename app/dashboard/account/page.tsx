import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AccountForms from './AccountForms';

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div>
      <h1 className="font-noto text-3xl font-black text-charcoal mb-8">חשבון</h1>
      <AccountForms name={user.name} email={user.email} />
    </div>
  );
}
