'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href === prevPath.current) return;
      start();
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (pathname !== prevPath.current) {
      finish();
      prevPath.current = pathname;
    }
  }, [pathname]);

  function start() {
    setVisible(true);
    setProgress(15);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(intervalRef.current); return p; }
        return p + (90 - p) * 0.1;
      });
    }, 200);
  }

  function finish() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);
    setTimeout(() => { setVisible(false); setProgress(0); }, 300);
  }

  if (!visible && progress === 0) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-[3px]">
      <div
        className="h-full rounded-full bg-ocean transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: progress >= 100 ? 0 : 1 }}
      />
    </div>
  );
}
