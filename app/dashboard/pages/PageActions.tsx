'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { Pencil, Copy, PenTool } from 'lucide-react';
import { duplicatePageAction } from './[id]/actions';

export default function PageActions({ pageId }: { pageId: string }) {
  const [pending, startTransition] = useTransition();

  function handleDuplicate() {
    startTransition(async () => {
      await duplicatePageAction(pageId);
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/dashboard/pages/${pageId}/visual`}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-ocean transition-colors duration-150 hover:bg-ocean/10"
        title="עורך ויזואלי"
      >
        <PenTool className="h-4 w-4" />
      </Link>
      <Link
        href={`/dashboard/pages/${pageId}`}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-navy"
        title="עריכה"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        onClick={handleDuplicate}
        disabled={pending}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-navy disabled:opacity-40"
        title="שכפול"
      >
        <Copy className={`h-4 w-4 ${pending ? 'animate-pulse' : ''}`} />
      </button>
    </div>
  );
}
