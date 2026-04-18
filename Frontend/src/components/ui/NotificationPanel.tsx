import { useEffect, useState, useCallback } from "react";

const API = "http://localhost:8000/api";

interface Notification {
  _id: string;
  type: "friend_request" | "friend_accepted" | "transaction_request" | "transaction_paid" | "reminder" | "message";
  title: string;
  body: string;
  read: boolean;
  metadata: Record<string, any>;
  fromUserId: { _id: string; username: string; email: string; avatarUrl?: string } | null;
  createdAt: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onUnreadCount: (count: number) => void;
}

const typeIcons: Record<string, JSX.Element> = {
  friend_request: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
    </svg>
  ),
  friend_accepted: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  ),
  transaction_request: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  transaction_paid: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
    </svg>
  ),
  reminder: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  message: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  ),
};

const typeColors: Record<string, string> = {
  friend_request: "text-blue-400 bg-blue-400/10",
  friend_accepted: "text-success bg-success/10",
  transaction_request: "text-action-red bg-action-red/10",
  transaction_paid: "text-success bg-success/10",
  reminder: "text-yellow-400 bg-yellow-400/10",
  message: "text-purple-400 bg-purple-400/10",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function NotificationPanel({ open, onClose, onUnreadCount }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchUnreadCount = useCallback(() => {
    if (!token) return;
    fetch(`${API}/notification/unread-count`, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) onUnreadCount(d.data.count);
      })
      .catch(() => {});
  }, [token]);

  // check for new notifs every 30s
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // load all notifs when panel opens
  useEffect(() => {
    if (!open || !token) return;
    setLoading(true);
    fetch(`${API}/notification?limit=50`, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setNotifications(d.data.notifications);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, token]);

  const markAsRead = (id: string) => {
    fetch(`${API}/notification/${id}/read`, { method: "PATCH", headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
          fetchUnreadCount();
        }
      })
      .catch(() => {});
  };

  const markAllAsRead = () => {
    fetch(`${API}/notification/read-all`, { method: "PATCH", headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          onUnreadCount(0);
        }
      })
      .catch(() => {});
  };

  if (!open) return null;

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  return (
    <>
      {/* dark bg behind */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* the panel itself */}
      <div className="fixed inset-x-0 top-0 z-50 max-h-[85vh] overflow-y-auto mx-3 mt-3 md:absolute md:right-0 md:left-auto md:w-96 md:mx-0 glass-card rounded-2xl border border-white/[0.08] animate-in slide-in-from-top-2">
        {/* top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-bg-primary/80 backdrop-blur-xl rounded-t-2xl">
          <h3 className="text-lg font-light tracking-tight text-text-primary">
            Notifi<span className="font-semibold">cations</span>
          </h3>
          <div className="flex items-center gap-3">
            {unread.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-light text-action-red hover:text-action-red-hover transition-colors"
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* notif list */}
        <div className="px-3 py-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 border-2 border-action-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-text-muted/30 mb-3" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 0 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-light text-text-muted/60">No notifications yet</p>
              <p className="text-xs text-text-muted/40 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {unread.length > 0 && (
                <>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-text-muted/50 px-2 pt-1 pb-1">New</p>
                  {unread.map((n) => (
                    <NotificationItem key={n._id} notification={n} onRead={markAsRead} />
                  ))}
                </>
              )}
              {read.length > 0 && (
                <>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-text-muted/50 px-2 pt-3 pb-1">Earlier</p>
                  {read.map((n) => (
                    <NotificationItem key={n._id} notification={n} onRead={markAsRead} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function NotificationItem({ notification: n, onRead }: { notification: Notification; onRead: (id: string) => void }) {
  const colors = typeColors[n.type] || "text-text-muted bg-white/[0.04]";
  const icon = typeIcons[n.type];

  return (
    <div
      onClick={() => !n.read && onRead(n._id)}
      className={`flex items-start gap-3 px-3 py-3 rounded-xl transition-colors cursor-pointer ${
        n.read ? "opacity-60" : "bg-white/[0.02] hover:bg-white/[0.04]"
      }`}
    >
      {/* notif icon */}
      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${colors}`}>
        {icon}
      </div>

      {/* notif text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${n.read ? "text-text-secondary" : "text-text-primary"}`}>
            <span className={n.read ? "font-light" : "font-medium"}>{n.title}</span>
          </p>
          {!n.read && <span className="h-2 w-2 rounded-full bg-action-red shrink-0 mt-1.5" />}
        </div>
        <p className="text-xs text-text-muted/60 mt-0.5 line-clamp-2">{n.body}</p>
        <p className="text-[10px] text-text-muted/40 mt-1">{timeAgo(n.createdAt)}</p>
      </div>
    </div>
  );
}
