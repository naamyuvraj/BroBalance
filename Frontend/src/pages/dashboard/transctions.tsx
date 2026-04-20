import { useEffect, useState } from "react";
import { TransactionCard } from "src/components/ui/Cards";
import Loading from "src/components/ui/Loading";

const API = import.meta.env.VITE_API_URL;

type FilterType = "all" | "lent" | "borrowed";

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API}/transaction`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTransactions(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Loading />;

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const totalLent = transactions
    .filter((t) => t.type === "lent")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBorrowed = transactions
    .filter((t) => t.type === "borrowed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-5">
      {/* page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight tracking-tight text-text-primary">
            Trans<span className="font-semibold">actions</span>
          </h1>
          <p className="typo-body mt-1">All your debts and payments</p>
        </div>
        {/* filter pills - only show here on desktop */}
        <div className="hidden md:flex gap-2">
          {(["all", "lent", "borrowed"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 text-sm font-light tracking-wide rounded-full capitalize transition-all duration-200 ${
                filter === f ? "btn-primary" : "btn-outline"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* lent / borrowed / net cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <div className="glass-card-green rounded-2xl px-3 py-3 flex flex-col items-center gap-1.5 md:flex-row md:items-center md:gap-3 md:px-4 md:py-3">
          <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
            </svg>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="typo-micro">Lent</span>
            <span className="text-sm font-semibold tabular-nums text-success">₹{totalLent.toLocaleString()}</span>
          </div>
        </div>
        <div className="glass-card-red rounded-2xl px-3 py-3 flex flex-col items-center gap-1.5 md:flex-row md:items-center md:gap-3 md:px-4 md:py-3">
          <div className="h-8 w-8 rounded-full bg-action-red/10 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-action-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="typo-micro">Borrowed</span>
            <span className="text-sm font-semibold tabular-nums text-action-red">₹{totalBorrowed.toLocaleString()}</span>
          </div>
        </div>
        <div className={`${totalLent - totalBorrowed >= 0 ? 'glass-card-green' : 'glass-card-red'} rounded-2xl px-3 py-3 flex flex-col items-center gap-1.5 md:flex-row md:items-center md:gap-3 md:px-4 md:py-3`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${totalLent - totalBorrowed >= 0 ? 'bg-success/10' : 'bg-action-red/10'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${totalLent - totalBorrowed >= 0 ? 'text-success' : 'text-action-red'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="typo-micro">Net</span>
            <span className={`text-sm font-semibold tabular-nums ${totalLent - totalBorrowed >= 0 ? "text-success" : "text-action-red"}`}>
              {totalLent - totalBorrowed >= 0 ? "+" : ""}₹{Math.abs(totalLent - totalBorrowed).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* filter pills - phone only */}
      <div className="flex gap-2 md:hidden">
        {(["all", "lent", "borrowed"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2.5 text-sm font-light tracking-wide rounded-full capitalize transition-all duration-200 ${
              filter === f ? "btn-primary" : "btn-outline"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* show txns or the empty state */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 md:p-10 md:py-12 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl glass flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7 text-text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <p className="text-lg md:text-xl font-extralight text-text-muted/80 italic mb-1.5">
            "Every great balance starts with zero"
          </p>
          <p className="typo-micro max-w-xs">
            {filter === "all"
              ? "Your transaction history will appear here once you start tracking expenses with friends."
              : `No ${filter} transactions yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((t: any) => (
            <TransactionCard
              key={t._id}
              name={t.friendName || t.to?.username || t.from?.username || "Unknown"}
              avatarUrl={t.to?.avatarUrl || t.from?.avatarUrl}
              amount={t.amount}
              type={t.type === "lent" ? "owed" : "owe"}
              description={t.description}
              date={new Date(t.createdAt).toLocaleDateString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
