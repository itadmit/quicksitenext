'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/tracking';

type Props = {
  pageTitle?: string;
  pageSlug?: string;
};

export default function TrackPageView({ pageTitle, pageSlug }: Props) {
  useEffect(() => {
    trackEvent('ViewContent', {
      content_name: pageTitle || document.title,
      content_category: 'page',
      page_path: pageSlug || window.location.pathname,
    });
  }, [pageTitle, pageSlug]);

  return null;
}
