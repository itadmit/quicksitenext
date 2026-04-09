import { SkeletonPageHeader, SkeletonForm } from '@/components/dashboard/Skeleton';

export default function SettingsLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <SkeletonPageHeader />
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="flex gap-3">
          {['כללי', 'SEO', 'קוד', 'סושיאל', 'הפניות'].map(t => (
            <div key={t} className="h-9 w-16 rounded-xl bg-slate-100" />
          ))}
        </div>
        <SkeletonForm fields={4} />
        <SkeletonForm fields={2} />
      </div>
    </div>
  );
}
