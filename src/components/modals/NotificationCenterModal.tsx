import React, { useState, useEffect } from 'react';
import { X, Bell, Check, Clock, CheckCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/supabase';
import { Notification } from '../../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, refreshProfile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setLoading(true);
      api
        .getNotifications(user.id)
        .then(setNotifications)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleMarkRead = async (notifId: string) => {
    await api.markNotificationRead(notifId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
    );
    refreshProfile();
  };

  const handleMarkAllRead = async () => {
    for (const n of notifications.filter((notif) => !notif.is_read)) {
      await api.markNotificationRead(n.id);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    refreshProfile();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-[#262838] rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 overflow-y-auto max-h-[85vh]">
        {/* Top Gold Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f7df8b] via-[#d4af37] to-[#8d6a13]" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-xl font-bold font-heading text-white">Notifications</h3>
          </div>
          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-[#d4af37] hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#d4af37]" />
            <span className="text-xs mt-2 block">Loading notifications...</span>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && handleMarkRead(n.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  n.is_read
                    ? 'bg-[#12141e]/50 border-slate-800/60 opacity-80'
                    : 'bg-[#151724] border-[#d4af37]/40 shadow-sm shadow-[#d4af37]/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0" />
                    )}
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(n.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-4">{n.message}</p>
                <div className="mt-2 pl-4 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="uppercase font-semibold tracking-wider text-[#d4af37]">
                    {n.type}
                  </span>
                  <span>{new Date(n.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500 bg-[#12141d] rounded-2xl border border-slate-800">
            No notifications available at this time.
          </div>
        )}
      </div>
    </div>
  );
};
