'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { submitLeadAction, type SubmitLeadState } from '@/app/actions/submit-lead';
import { trackEvent } from '@/lib/tracking';

type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default function ContactFormBlock({ data, tenantId }: Props) {
  const title = (data.title as string) || 'צור קשר';
  const buttonLabel = (data.buttonLabel as string) || 'שליחה';

  const [state, formAction, pending] = useActionState<SubmitLeadState, FormData>(submitLeadAction, undefined);

  useEffect(() => {
    if (state?.success) {
      trackEvent('Lead', { source: 'contact_form' });
    }
  }, [state?.success]);

  if (state?.success) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-lg border border-green-200 bg-green-50 p-10">
          <h3 className="font-display text-2xl text-green-800">תודה שפניתם אלינו!</h3>
          <p className="mt-2 text-green-700">נחזור אליכם בהקדם.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      {title && (
        <h2
          className="mb-8 text-center font-display text-3xl"
          style={{ color: 'var(--tenant-primary)' }}
        >
          {title}
        </h2>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="tenantId" value={tenantId} />
        <input type="hidden" name="source" value="website_contact" />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className="mb-1 block text-sm font-medium">
              שם מלא *
            </label>
            <input
              id="cf-name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--tenant-primary)] focus:ring-1 focus:ring-[var(--tenant-primary)]"
            />
          </div>
          <div>
            <label htmlFor="cf-email" className="mb-1 block text-sm font-medium">
              אימייל *
            </label>
            <input
              id="cf-email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--tenant-primary)] focus:ring-1 focus:ring-[var(--tenant-primary)]"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-phone" className="mb-1 block text-sm font-medium">
              טלפון
            </label>
            <input
              id="cf-phone"
              name="phone"
              type="tel"
              className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--tenant-primary)] focus:ring-1 focus:ring-[var(--tenant-primary)]"
            />
          </div>
          <div>
            <label htmlFor="cf-company" className="mb-1 block text-sm font-medium">
              חברה
            </label>
            <input
              id="cf-company"
              name="company"
              type="text"
              className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--tenant-primary)] focus:ring-1 focus:ring-[var(--tenant-primary)]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="cf-message" className="mb-1 block text-sm font-medium">
            הודעה
          </label>
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--tenant-primary)] focus:ring-1 focus:ring-[var(--tenant-primary)]"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-[48px] items-center justify-center px-10 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--tenant-primary)' }}
          >
            {pending ? 'שולח...' : buttonLabel}
          </button>
        </div>
      </form>
    </section>
  );
}
