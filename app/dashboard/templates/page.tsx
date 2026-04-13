import PageHeader from '@/components/dashboard/PageHeader';
import TemplateGallery from './TemplateGallery';

export const metadata = { title: 'תבניות | דשבורד' };

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="תבניות" subtitle="בחרו תבנית חדשה לאתר — כל העמודים, התפריטים וצבעי העיצוב יוחלפו" />
      <TemplateGallery />
    </div>
  );
}
