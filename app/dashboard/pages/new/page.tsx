import PageHeader from '@/components/dashboard/PageHeader';
import DashboardCard from '@/components/dashboard/DashboardCard';
import NewPageForm from './NewPageForm';

export const metadata = { title: 'עמוד חדש | דשבורד' };

export default function NewPagePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="עמוד חדש" backHref="/dashboard/pages" />
      <DashboardCard>
        <NewPageForm />
      </DashboardCard>
    </div>
  );
}
