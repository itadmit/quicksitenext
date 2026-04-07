'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_PREFIX = 'tenant_popup_dismissed_';

type PopupData = {
  id: string;
  enabled: boolean;
  priority: number;
  trigger: 'on_load' | 'exit_intent' | 'time_on_site' | 'scroll_depth';
  delayMs: number;
  timeOnSiteMs: number;
  scrollDepthPercent: number;
  title: string;
  body: string;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  dismissLabel: string;
  frequency: 'always' | 'once_per_session' | 'once_per_days_after_dismiss';
  hideDaysAfterDismiss: number;
};

type Props = {
  popups: PopupData[];
};

function isDismissedInStorage(id: string, hideDays: number): boolean {
  if (typeof window === 'undefined' || hideDays <= 0) return false;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    if (!raw) return false;
    const until = parseInt(raw, 10);
    return Number.isFinite(until) && Date.now() < until;
  } catch {
    return false;
  }
}

function markDismissed(id: string, hideDays: number) {
  if (hideDays <= 0) return;
  try {
    const until = Date.now() + hideDays * 86_400_000;
    localStorage.setItem(STORAGE_PREFIX + id, String(until));
  } catch {
    /* ignore */
  }
}

function sessionShownKey(id: string) {
  return `tenant_popup_session_${id}`;
}

function wasShownThisSession(id: string): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  return sessionStorage.getItem(sessionShownKey(id)) === '1';
}

function markShownThisSession(id: string) {
  try {
    sessionStorage.setItem(sessionShownKey(id), '1');
  } catch {
    /* ignore */
  }
}

function canAttemptShow(p: PopupData): boolean {
  if (isDismissedInStorage(p.id, p.hideDaysAfterDismiss)) return false;
  if (p.frequency === 'once_per_session' && wasShownThisSession(p.id)) return false;
  return true;
}

export default function TenantPopupHost({ popups }: Props) {
  const [active, setActive] = useState<PopupData | null>(null);
  const activeRef = useRef<PopupData | null>(null);

  const finalizeClose = useCallback(() => {
    const cur = activeRef.current;
    activeRef.current = null;
    setActive(null);
    if (cur && cur.hideDaysAfterDismiss > 0) {
      markDismissed(cur.id, cur.hideDaysAfterDismiss);
    }
  }, []);

  const tryOpen = useCallback((p: PopupData) => {
    if (activeRef.current) return;
    if (!canAttemptShow(p)) return;
    activeRef.current = p;
    setActive(p);
    if (p.frequency === 'once_per_session') {
      markShownThisSession(p.id);
    }
  }, []);

  useEffect(() => {
    if (!popups.length) return;

    const cleanups: Array<() => void> = [];

    for (const p of popups) {
      if (!p.enabled) continue;

      if (p.trigger === 'on_load') {
        const delay = p.delayMs ?? 0;
        const t = window.setTimeout(() => tryOpen(p), delay);
        cleanups.push(() => clearTimeout(t));
      }

      if (p.trigger === 'time_on_site') {
        const ms = p.timeOnSiteMs ?? 15_000;
        const t = window.setTimeout(() => tryOpen(p), ms);
        cleanups.push(() => clearTimeout(t));
      }

      if (p.trigger === 'scroll_depth') {
        const pct = p.scrollDepthPercent ?? 50;
        const onScroll = () => {
          const doc = document.documentElement;
          const scrollTop = window.scrollY || doc.scrollTop;
          const max = doc.scrollHeight - window.innerHeight;
          if (max <= 0) return;
          const current = (scrollTop / max) * 100;
          if (current >= pct) {
            tryOpen(p);
            window.removeEventListener('scroll', onScroll, true);
          }
        };
        window.addEventListener('scroll', onScroll, { passive: true, capture: true });
        cleanups.push(() => window.removeEventListener('scroll', onScroll, true));
      }

      if (p.trigger === 'exit_intent') {
        const onOut = (e: MouseEvent) => {
          const to = e.relatedTarget as Node | null;
          if (to && document.documentElement.contains(to)) return;
          if (e.clientY < 30) tryOpen(p);
        };
        document.addEventListener('mouseout', onOut);
        cleanups.push(() => document.removeEventListener('mouseout', onOut));
      }
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [popups, tryOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeRef.current) finalizeClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finalizeClose]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tenant-popup-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-charcoal/10 bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={finalizeClose}
          className="absolute left-4 top-4 text-2xl leading-none text-charcoal/40 transition hover:text-charcoal"
          aria-label="סגור"
        >
          ×
        </button>

        {active.imageUrl && (
          <img src={active.imageUrl} alt="" className="mb-6 w-full rounded object-cover" />
        )}

        <h2
          id="tenant-popup-title"
          className="pr-8 font-display text-2xl font-bold text-charcoal"
        >
          {active.title}
        </h2>
        <p className="mt-4 whitespace-pre-wrap text-charcoal/80">{active.body}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
          {active.ctaLabel && active.ctaHref && (
            <a
              href={active.ctaHref}
              className="inline-flex min-h-[48px] items-center justify-center px-8 py-3 text-center text-xs font-bold uppercase tracking-widest text-white transition hover:opacity-90"
              style={{ backgroundColor: 'var(--tenant-primary)' }}
              onClick={() => finalizeClose()}
            >
              {active.ctaLabel}
            </a>
          )}
          <button
            type="button"
            onClick={finalizeClose}
            className="inline-flex min-h-[48px] items-center justify-center border border-charcoal/20 px-8 py-3 text-xs font-bold uppercase tracking-widest text-charcoal transition hover:border-charcoal"
          >
            {active.dismissLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
