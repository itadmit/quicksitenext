'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateCptFieldsAction } from '../../actions';

type Field = {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
};

const FIELD_TYPES = [
  { value: 'text', label: 'טקסט' },
  { value: 'textarea', label: 'טקסט ארוך' },
  { value: 'number', label: 'מספר' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'אימייל' },
  { value: 'select', label: 'בחירה' },
  { value: 'checkbox', label: 'תיבת סימון' },
  { value: 'date', label: 'תאריך' },
  { value: 'image', label: 'תמונה' },
];

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';

export default function FieldsEditor({ cptId, initialFields }: { cptId: string; initialFields: string }) {
  const [fields, setFields] = useState<Field[]>(() => {
    try { return JSON.parse(initialFields); } catch { return []; }
  });
  const [saving, startSave] = useTransition();
  const [error, setError] = useState('');
  const router = useRouter();

  function addField() {
    setFields([...fields, { name: '', label: '', type: 'text', required: false }]);
  }

  function removeField(index: number) {
    setFields(fields.filter((_, i) => i !== index));
  }

  function updateField(index: number, key: keyof Field, value: unknown) {
    setFields(fields.map((f, i) => i === index ? { ...f, [key]: value } : f));
  }

  function moveField(from: number, to: number) {
    if (to < 0 || to >= fields.length) return;
    const arr = [...fields];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setFields(arr);
  }

  function handleSave() {
    for (const f of fields) {
      if (!f.name || !f.label) { setError('שם ותווית נדרשים לכל שדה'); return; }
      if (!/^[a-z0-9_]+$/.test(f.name)) { setError(`שם שדה "${f.name}" חייב להכיל רק אותיות קטנות, מספרים וקו תחתון`); return; }
    }
    setError('');
    startSave(async () => {
      const res = await updateCptFieldsAction(cptId, JSON.stringify(fields));
      if (res?.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {fields.map((field, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <span className="text-sm font-medium text-navy">שדה #{i + 1}</span>
            <div className="flex gap-2">
              <button onClick={() => moveField(i, i - 1)} disabled={i === 0} className="text-slate-400 hover:text-navy disabled:opacity-30">↑</button>
              <button onClick={() => moveField(i, i + 1)} disabled={i === fields.length - 1} className="text-slate-400 hover:text-navy disabled:opacity-30">↓</button>
              <button onClick={() => removeField(i)} className="text-red-500 hover:text-red-700 text-sm">✕</button>
            </div>
          </div>
          <div className="space-y-3 px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="mb-1 block text-xs font-medium text-slate-500">שם שדה (באנגלית)</span>
                <input value={field.name} onChange={e => updateField(i, 'name', e.target.value)} dir="ltr" className={inputCls + ' font-mono'} placeholder="field_name" />
              </label>
              <label className="block"><span className="mb-1 block text-xs font-medium text-slate-500">תווית</span>
                <input value={field.label} onChange={e => updateField(i, 'label', e.target.value)} className={inputCls} />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="mb-1 block text-xs font-medium text-slate-500">סוג</span>
                <select value={field.type} onChange={e => updateField(i, 'type', e.target.value)} className={inputCls + ' cursor-pointer'}>
                  {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 self-end pb-2">
                <input type="checkbox" checked={field.required} onChange={e => updateField(i, 'required', e.target.checked)} className="h-4 w-4 accent-ocean" />
                <span className="text-sm text-navy">שדה חובה</span>
              </label>
            </div>
            {field.type === 'select' && (
              <label className="block"><span className="mb-1 block text-xs font-medium text-slate-500">אפשרויות (מופרדות בפסיקים)</span>
                <input value={(field.options ?? []).join(', ')} onChange={e => updateField(i, 'options', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className={inputCls} />
              </label>
            )}
          </div>
        </div>
      ))}

      <button onClick={addField} className="w-full rounded-2xl border border-dashed border-slate-200 py-4 text-sm font-medium text-slate-500 transition-colors hover:border-ocean hover:text-ocean">
        + הוסף שדה
      </button>

      <button onClick={handleSave} disabled={saving} className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ocean/85 disabled:opacity-50">
        {saving ? 'שומר...' : 'שמור שדות'}
      </button>
    </div>
  );
}
