'use client';

import { useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addDomainAction, removeDomainAction, verifyDomainAction, type DomainActionState } from './actions';

type Domain = {
  id: string; hostname: string; type: string;
  verified: boolean; verifiedAt: Date | string | null; createdAt: Date | string;
};

export default function DomainsClient({ domains }: { domains: Domain[] }) {
  const router = useRouter();
  const [acting, startAction] = useTransition();
  const [state, formAction, pending] = useActionState<DomainActionState, FormData>(
    async (prev, fd) => {
      const result = await addDomainAction(prev, fd);
      if (result?.success) router.refresh();
      return result;
    },
    undefined,
  );

  function handleRemove(id: string) {
    if (!confirm('להסיר את הדומיין?')) return;
    startAction(async () => { await removeDomainAction(id); router.refresh(); });
  }

  function handleVerify(id: string) {
    startAction(async () => { await verifyDomainAction(id); router.refresh(); });
  }

  return (
    <div>
      <h1 className="font-noto text-3xl font-black text-charcoal mb-8">דומיינים</h1>

      <div className="border border-charcoal/10 bg-white p-6 mb-6 max-w-xl">
        <h2 className="font-noto text-lg font-bold text-charcoal mb-4">הוסף דומיין מותאם</h2>
        <form action={formAction} className="flex gap-3 items-end">
          <label className="flex-1">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">שם דומיין</span>
            <input
              name="hostname"
              required
              dir="ltr"
              placeholder="example.com"
              className="w-full border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal focus:border-primary focus:outline-none font-mono text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
          >
            {pending ? '...' : 'הוסף'}
          </button>
        </form>
        {state?.error && <p className="text-sm text-red-600 mt-2">{state.error}</p>}
        {state?.success && <p className="text-sm text-green-600 mt-2">דומיין נוסף בהצלחה</p>}
      </div>

      {domains.length === 0 ? (
        <div className="border border-charcoal/10 bg-white p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-charcoal/20 mb-3 block">language</span>
          <p className="text-charcoal/50 text-sm">אין דומיינים עדיין</p>
        </div>
      ) : (
        <div className="border border-charcoal/10 bg-white overflow-hidden max-w-3xl">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-charcoal/10 bg-charcoal/[0.02]">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">דומיין</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סוג</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">מאומת</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {domains.map((domain) => (
                <tr key={domain.id} className="border-b border-charcoal/5 hover:bg-charcoal/[0.01]">
                  <td className="px-4 py-3 font-mono text-sm text-charcoal" dir="ltr">{domain.hostname}</td>
                  <td className="px-4 py-3 text-sm text-charcoal/60">
                    {domain.type === 'subdomain' ? 'סאב-דומיין' : 'מותאם'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded ${domain.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {domain.verified ? 'מאומת' : 'ממתין'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 justify-end">
                      {!domain.verified && (
                        <button
                          onClick={() => handleVerify(domain.id)}
                          disabled={acting}
                          className="text-primary text-xs font-bold hover:underline disabled:opacity-50"
                        >
                          אמת
                        </button>
                      )}
                      {domain.type === 'custom' && (
                        <button
                          onClick={() => handleRemove(domain.id)}
                          disabled={acting}
                          className="text-red-600 text-xs font-bold hover:underline disabled:opacity-50"
                        >
                          הסר
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
