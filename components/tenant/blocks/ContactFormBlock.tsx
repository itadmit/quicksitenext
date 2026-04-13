'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { submitLeadAction, type SubmitLeadState } from '@/app/actions/submit-lead';
import { trackEvent } from '@/lib/tracking';

type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

const inputBase = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--tenant-primary)] focus:ring-1 focus:ring-[var(--tenant-primary)]';

function FormFields() {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1 block text-sm font-medium text-navy">
            שם מלא *
          </label>
          <input id="cf-name" name="name" type="text" required className={inputBase} />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1 block text-sm font-medium text-navy">
            אימייל *
          </label>
          <input id="cf-email" name="email" type="email" required dir="ltr" className={inputBase} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-phone" className="mb-1 block text-sm font-medium text-navy">
            טלפון
          </label>
          <input id="cf-phone" name="phone" type="tel" dir="ltr" className={inputBase} />
        </div>
        <div>
          <label htmlFor="cf-company" className="mb-1 block text-sm font-medium text-navy">
            חברה
          </label>
          <input id="cf-company" name="company" type="text" className={inputBase} />
        </div>
      </div>
      <div>
        <label htmlFor="cf-message" className="mb-1 block text-sm font-medium text-navy">
          הודעה
        </label>
        <textarea id="cf-message" name="message" rows={5} className={`${inputBase} resize-none`} />
      </div>
    </>
  );
}

function SuccessMessage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-10">
        <h3 className="font-noto text-2xl font-black text-green-800">תודה שפניתם אלינו!</h3>
        <p className="mt-2 text-green-700">נחזור אליכם בהקדם.</p>
      </div>
    </section>
  );
}

function StandaloneVariant({
  title,
  buttonLabel,
  state,
  formAction,
  pending,
  tenantId,
}: {
  title: string;
  buttonLabel: string;
  state: SubmitLeadState | undefined;
  formAction: (payload: FormData) => void;
  pending: boolean;
  tenantId: string;
}) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      {title && (
        <h2
          className="mb-8 text-center font-noto text-3xl font-black text-navy"
          style={{ color: 'var(--tenant-primary)' }}
        >
          {title}
        </h2>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="tenantId" value={tenantId} />
        <input type="hidden" name="source" value="website_contact" />
        <FormFields />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="text-center">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-full px-10 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--tenant-primary)' }}
          >
            {pending ? 'שולח...' : buttonLabel}
          </button>
        </div>
      </form>
    </section>
  );
}

function SplitVariant({
  title,
  subtitle,
  buttonLabel,
  state,
  formAction,
  pending,
  tenantId,
}: {
  title: string;
  subtitle: string;
  buttonLabel: string;
  state: SubmitLeadState | undefined;
  formAction: (payload: FormData) => void;
  pending: boolean;
  tenantId: string;
}) {
  return (
    <section className="bg-slate-50 px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        {/* Right column — info */}
        <div className="flex flex-col justify-center">
          {title && (
            <h2
              className="font-noto text-3xl font-black text-navy"
              style={{ color: 'var(--tenant-primary)' }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-4 text-base leading-relaxed text-navy/60">{subtitle}</p>
          )}
        </div>

        {/* Left column — form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <form action={formAction} className="space-y-5">
            <input type="hidden" name="tenantId" value={tenantId} />
            <input type="hidden" name="source" value="website_contact" />
            <FormFields />

            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="w-full cursor-pointer rounded-full py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--tenant-primary)' }}
            >
              {pending ? 'שולח...' : buttonLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function ContactFormBlock({ data, tenantId }: Props) {
  const title = (data.title as string) || 'צור קשר';
  const subtitle = (data.subtitle as string) || '';
  const buttonLabel = (data.buttonLabel as string) || 'שליחה';
  const variant = (data.variant as string) || 'standalone';

  const [state, formAction, pending] = useActionState<SubmitLeadState, FormData>(submitLeadAction, undefined);

  useEffect(() => {
    if (state?.success) {
      trackEvent('Lead', { source: 'contact_form' });
    }
  }, [state?.success]);

  if (state?.success) {
    return <SuccessMessage />;
  }

  if (variant === 'split') {
    return (
      <SplitVariant
        title={title}
        subtitle={subtitle}
        buttonLabel={buttonLabel}
        state={state}
        formAction={formAction}
        pending={pending}
        tenantId={tenantId}
      />
    );
  }

  return (
    <StandaloneVariant
      title={title}
      buttonLabel={buttonLabel}
      state={state}
      formAction={formAction}
      pending={pending}
      tenantId={tenantId}
    />
  );
}
