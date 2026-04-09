'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { duplicatePageAction } from './[id]/actions';

export default function PageActions({ pageId }: { pageId: string }) {
  const [pending, startTransition] = useTransition();

  function handleDuplicate() {
    startTransition(async () => {
      await duplicatePageAction(pageId);
    });
  }

  return (
    <div className="flex justify-end gap-3">
      <Link href={`/dashboard/pages/${pageId}`} className="text-sm font-medium text-ocean hover:underline">עריכה</Link>
      <button onClick={handleDuplicate} disabled={pending} className="text-sm font-medium text-slate-500 hover:text-ocean hover:underline disabled:opacity-50">
        {pending ? '...' : 'שכפול'}
      </button>
    </div>
  );
}
