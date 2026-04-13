'use client';

import { useState } from 'react';
import { Code, Eye } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function EditableHtmlBlock({ data, onChange }: Props) {
  const code = (data.code as string) || '';
  const [showCode, setShowCode] = useState(false);

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        {/* Toggle */}
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-1.5">
          <button
            onClick={() => setShowCode(false)}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
              !showCode ? 'bg-white text-navy shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
            data-no-select
          >
            <Eye className="h-3 w-3" /> תצוגה
          </button>
          <button
            onClick={() => setShowCode(true)}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
              showCode ? 'bg-white text-navy shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
            data-no-select
          >
            <Code className="h-3 w-3" /> קוד
          </button>
        </div>

        {showCode ? (
          <textarea
            value={code}
            onChange={(e) => onChange({ ...data, code: e.target.value })}
            className="w-full bg-navy p-4 font-mono text-sm text-white/90 outline-none resize-y min-h-[120px]"
            dir="ltr"
            placeholder="<!-- הכניסו קוד HTML כאן -->"
            data-no-select
          />
        ) : (
          <div className="min-h-[60px] p-4">
            {code ? (
              <div dangerouslySetInnerHTML={{ __html: code }} />
            ) : (
              <p className="text-center text-sm text-slate-400">עברו לתצוגת קוד כדי להוסיף HTML</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
