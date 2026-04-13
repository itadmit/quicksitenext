declare global {
  interface Window {
    qsTrack?: (eventName: string, params?: Record<string, unknown>) => void;
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export type TrackingEvent = 'Lead' | 'ViewContent' | 'Contact' | 'PageView' | 'ClickCTA';

export function trackEvent(eventName: TrackingEvent, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    window.qsTrack?.(eventName, params);
  } catch {
    // silently fail
  }
}
