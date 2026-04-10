interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: "red" | "green" | "yellow";
}

const accentMap = {
  red: {
    bg: "bg-action-red/10",
    text: "text-action-red",
    border: "border-action-red/20",
  },
  green: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
  },
  yellow: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/20",
  },
};

export function StatCard({ label, value, icon, accent = "red" }: StatCardProps) {
  const a = accentMap[accent];
  return (
    <div className={`glass-card rounded-2xl p-5 flex items-start gap-4`}>
      <div className={`h-11 w-11 rounded-xl ${a.bg} ${a.border} border flex items-center justify-center shrink-0`}>
        <span className={a.text}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="typo-label mb-1.5">{label}</p>
        <p className="typo-financial-sm truncate">{value}</p>
      </div>
    </div>
  );
}

interface TransactionCardProps {
  name: string;
  avatarUrl?: string;
  amount: number;
  type: "owe" | "owed";
  description?: string;
  date: string;
  onClick?: () => void;
}

export function TransactionCard({
  name,
  avatarUrl,
  amount,
  type,
  description,
  date,
  onClick,
}: TransactionCardProps) {
  const isOwe = type === "owe";
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 glass-card rounded-xl px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
    >
      <div className="h-10 w-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="typo-button text-text-secondary">
            {name[0]?.toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="typo-subheading text-sm truncate">{name}</p>
        {description && (
          <p className="typo-micro truncate">{description}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className={`typo-button tabular-nums ${isOwe ? "text-action-red" : "text-success"}`}>
          {isOwe ? "-" : "+"}₹{amount.toLocaleString()}
        </p>
        <p className="typo-micro mt-0.5">{date}</p>
      </div>
    </div>
  );
}

interface FriendCardProps {
  name: string;
  avatarUrl?: string;
  email?: string;
  balance?: number;
  onClick?: () => void;
}

export function FriendCard({ name, avatarUrl, email, balance, onClick }: FriendCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 glass-card rounded-xl px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
    >
      <div className="h-10 w-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="typo-button text-text-secondary">
            {name[0]?.toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="typo-subheading text-sm truncate">{name}</p>
        {email && <p className="typo-micro truncate">{email}</p>}
      </div>
      {balance !== undefined && (
        <div className="text-right shrink-0">
          <p
            className={`typo-button tabular-nums ${
              balance > 0 ? "text-success" : balance < 0 ? "text-action-red" : "text-text-muted"
            }`}
          >
            {balance > 0 ? "+" : ""}₹{Math.abs(balance).toLocaleString()}
          </p>
          <p className="typo-micro mt-0.5">
            {balance > 0 ? "to receive" : balance < 0 ? "to pay" : "settled"}
          </p>
        </div>
      )}
    </div>
  );
}
