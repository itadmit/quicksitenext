'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getUnreadNotifications, markNotificationReadAction, markAllNotificationsReadAction } from '@/app/actions/notifications';
import { Bell } from 'lucide-react';

type Notification = {
  id: string;
  type: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: Date | string;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadNotifications() {
    try {
      const res = await getUnreadNotifications();
      setNotifications(res as Notification[]);
    } catch { /* ignore */ }
  }

  function handleClick(n: Notification) {
    startTransition(async () => {
      await markNotificationReadAction(n.id);
      setNotifications(prev => prev.filter(x => x.id !== n.id));
      if (n.link) router.push(n.link);
      setOpen(false);
    });
  }

  function handleMarkAll() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      setNotifications([]);
      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
      >
        <Bell className="h-[18px] w-[18px]" />
        {notifications.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-10 left-0 z-50 w-72 rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="text-sm font-semibold text-navy">התראות</span>
              {notifications.length > 0 && (
                <button onClick={handleMarkAll} className="cursor-pointer text-xs text-slate-500 hover:text-navy hover:underline">
                  סמן הכל כנקרא
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs text-slate-400">אין התראות חדשות</p>
              ) : (
                notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className="block w-full cursor-pointer border-b border-slate-50 px-4 py-3 text-right transition-colors last:border-b-0 hover:bg-slate-50"
                  >
                    <p className="text-sm text-navy">{n.message}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(n.createdAt).toLocaleString('he-IL')}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
