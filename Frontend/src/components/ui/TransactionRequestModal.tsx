import Modal from "src/components/ui/Modal";

interface TransactionRequestNotification {
  _id: string;
  title: string;
  body: string;
  fromUserId: { _id: string; username: string; avatarUrl?: string } | null;
  metadata: Record<string, any>;
  createdAt: string;
}

interface Props {
  open: boolean;
  notification: TransactionRequestNotification | null;
  onClose: () => void;
  onAccept: () => void;
  onViewTransaction: () => void;
}

export default function TransactionRequestModal({ open, notification, onClose, onAccept, onViewTransaction }: Props) {
  if (!notification) return null;

  const sender = notification.fromUserId;

  return (
    <Modal open={open} onClose={onClose} title="Transaction Request">
      <div className="space-y-5">
        {/* sender info */}
        <div className="flex items-center gap-3">
          {sender?.avatarUrl ? (
            <img src={sender.avatarUrl} alt={sender.username} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-action-red/10 flex items-center justify-center text-action-red font-semibold text-sm">
              {sender?.username?.charAt(0).toUpperCase() ?? "?"}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-text-primary">{sender?.username ?? "Someone"}</p>
            <p className="text-xs text-text-muted">{timeAgo(notification.createdAt)}</p>
          </div>
        </div>

        {/* message */}
        <div className="glass-card rounded-xl px-4 py-3">
          <p className="text-sm text-text-secondary">{notification.body}</p>
        </div>

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-medium"
          >
            Got it
          </button>
          <button
            onClick={() => {
              onAccept();
              onViewTransaction();
            }}
            className="flex-1 glass-card hover:bg-white/[0.06] py-2.5 rounded-xl text-sm font-medium text-text-secondary transition-colors"
          >
            View Transaction
          </button>
        </div>
      </div>
    </Modal>
  );
}

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
