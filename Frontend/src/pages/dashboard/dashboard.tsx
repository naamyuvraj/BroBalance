import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TransactionCard, FriendCard } from "src/components/ui/Cards";
import Loading from "src/components/ui/Loading";
import NotificationPanel from "src/components/ui/NotificationPanel";

const API = "http://localhost:8000/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ totalFriends: 0, toReceive: 0, toPay: 0 });
  const [recentFriends, setRecentFriends] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const fetchStats = fetch(`${API}/dashboard/stats`, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d.data);
      })
      .catch(() => {});

    const fetchFriends = fetch(`${API}/friend?limit=5&sort=recent`, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setRecentFriends(d.data);
      })
      .catch(() => {});

    const fetchTransactions = fetch(`${API}/transaction?limit=5&sort=recent`, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setRecentTransactions(d.data);
      })
      .catch(() => {});

    Promise.all([fetchStats, fetchFriends, fetchTransactions]).finally(() =>
      setLoading(false)
    );
  }, [token]);

  if (loading) return <Loading />;

  const net = stats.toReceive - stats.toPay;

  // the green/red net bar thing at the bottom
  const netBar = (py: string) => (
    <div className={`${net >= 0 ? 'glass-card-green' : 'glass-card-red'} rounded-2xl px-4 ${py} flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${net >= 0 ? 'bg-success/15' : 'bg-action-red/15'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${net >= 0 ? 'text-success' : 'text-action-red'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div>
          <p className="typo-label">Net Balance</p>
          <p className="typo-micro mt-0.5">{net >= 0 ? "You're in the green" : "You owe more"}</p>
        </div>
      </div>
      <p className={`text-lg font-semibold tabular-nums tracking-tight ${net >= 0 ? 'text-success' : 'text-action-red'}`}>
        {net >= 0 ? '+' : ''}₹{Math.abs(net).toLocaleString()}
      </p>
    </div>
  );

  // those two cards showing how much u owe / are owed
  const receiveCard = (p: string, amountSize: string, square = true) => (
    <div className={`glass-card-green rounded-2xl ${p} flex flex-col justify-between ${square ? 'aspect-square' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="typo-label text-success/80">To Receive</span>
        <div className="h-7 w-7 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </div>
      <div>
        <p className={`${amountSize} font-bold tabular-nums text-success tracking-tight`}>
          ₹ {stats.toReceive.toLocaleString()}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-xs text-success/60">incoming</span>
        </div>
      </div>
    </div>
  );

  const payCard = (p: string, amountSize: string, square = true) => (
    <div className={`glass-card-red rounded-2xl ${p} flex flex-col justify-between ${square ? 'aspect-square' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="typo-label text-action-red/80">To Pay</span>
        <div className="h-7 w-7 rounded-lg bg-action-red/10 border border-action-red/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-action-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>
        </div>
      </div>
      <div>
        <p className={`${amountSize} font-bold tabular-nums text-action-red tracking-tight`}>
          ₹ {stats.toPay.toLocaleString()}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="h-2 w-2 rounded-full bg-action-red" />
          <span className="text-xs text-action-red/60">outgoing</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden">
      {/* phone layout */}
      <div className="flex flex-col md:hidden" style={{ minHeight: 'calc(100svh - 120px)' }}>

        {/* logo + notif bell */}
        <div className="flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-medium tracking-tight text-text-primary" style={{ textShadow: '0 0 20px rgba(240,101,91,0.4), 0 0 40px rgba(240,101,91,0.2)' }}>
            Bro<span className="font-bold text-gradient-red">Balance</span>
          </h2>
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-1 transition-all duration-200 hover:scale-110"
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.3)) drop-shadow(0 0 14px rgba(255,255,255,0.15))' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 0 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clipRule="evenodd" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full bg-action-red text-white text-[10px] font-bold leading-none shadow-lg shadow-action-red/40">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        <NotificationPanel
          open={showNotifications}
          onClose={() => setShowNotifications(false)}
          onUnreadCount={setUnreadCount}
        />

        {/* big flashy hero */}
        <div className="relative mt-12 overflow-hidden">
          {/* that cool grid background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.39]"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <style>{`
              @keyframes jiggle {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(1.5px, -1px); }
                50% { transform: translate(-1px, 1.5px); }
                75% { transform: translate(1px, 1px); }
              }
              .mesh-line { animation: jiggle 6s ease-in-out infinite; }
              .mesh-d1 { animation-delay: 0s; }
              .mesh-d2 { animation-delay: 0.3s; }
              .mesh-d3 { animation-delay: 0.6s; }
              .mesh-d4 { animation-delay: 0.9s; }
              .mesh-d5 { animation-delay: 1.2s; }
              .mesh-d6 { animation-delay: 1.5s; }
            `}</style>
            {/* vertical lines */}
            <line className="mesh-line mesh-d1" x1="50" y1="0" x2="50" y2="400" stroke="currentColor" strokeWidth="0.5" />
            <line className="mesh-line mesh-d2" x1="100" y1="0" x2="100" y2="400" stroke="currentColor" strokeWidth="0.5" />
            <line className="mesh-line mesh-d3" x1="150" y1="0" x2="150" y2="400" stroke="currentColor" strokeWidth="0.5" />
            <line className="mesh-line mesh-d4" x1="200" y1="0" x2="200" y2="400" stroke="currentColor" strokeWidth="0.5" />
            <line className="mesh-line mesh-d5" x1="250" y1="0" x2="250" y2="400" stroke="currentColor" strokeWidth="0.5" />
            <line className="mesh-line mesh-d6" x1="300" y1="0" x2="300" y2="400" stroke="currentColor" strokeWidth="0.5" />
            <line className="mesh-line mesh-d1" x1="350" y1="0" x2="350" y2="400" stroke="currentColor" strokeWidth="0.5" />
            {/* horizontal lines */}
            <line className="mesh-line mesh-d4" x1="0" y1="50" x2="400" y2="50" stroke="currentColor" strokeWidth="0.5" />
            <line className="mesh-line mesh-d5" x1="0" y1="100" x2="400" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line className="mesh-line mesh-d6" x1="0" y1="150" x2="400" y2="150" stroke="currentColor" strokeWidth="0.5" />
            <line className="mesh-line mesh-d1" x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="0.5" />
            <line className="mesh-line mesh-d2" x1="0" y1="250" x2="400" y2="250" stroke="currentColor" strokeWidth="0.5" />
            <line className="mesh-line mesh-d3" x1="0" y1="300" x2="400" y2="300" stroke="currentColor" strokeWidth="0.5" />
            <line className="mesh-line mesh-d4" x1="0" y1="350" x2="400" y2="350" stroke="currentColor" strokeWidth="0.5" />
            {/* lil dots where lines cross */}
            {[50,100,150,200,250,300,350].map((x, i) =>
              [50,100,150,200,250,300,350].map((y, j) => (
                <circle key={`${i}-${j}`} className={`mesh-line mesh-d${((i+j)%6)+1}`} cx={x} cy={y} r="1.5" fill="currentColor" />
              ))
            )}
          </svg>

          {/* coin png floating on top */}
          <img
            src="/coin.png"
            alt=""
            className="absolute -right-[1rem] top-1/2 -translate-y-1/2 w-[clamp(7rem,35vw,14rem)] object-contain opacity-99 pointer-events-none"
          />

          <h1 className="relative z-10 text-[clamp(3.5rem,14vw,5.5rem)] leading-[1.05] tracking-tight text-text-primary w-full">
            <span className="font-light text-gradient-red">Clarity</span> <span className="font-extrabold">&amp;</span><br />
            <span className="font-light text-gradient-red">strength</span><br />
            <span className="font-extrabold">in money</span><br />
            <span className="font-extrabold">&amp; bonds.</span>
          </h1>
        </div>

        {/* tagline */}
        <p className="mt-5 text-[1.1rem] font-light leading-relaxed text-text-secondary/50">
          Split expenses with friends and track <br />
          <span className="text-text-secondary/80">every rupee effortlessly with transparency.</span>
        </p>

        {/* action buttons */}
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={() => navigate("/dashboard/transactions", { state: { openAddTx: true } })}
            className="btn-primary flex-1 py-3.5 text-[0.95rem] font-light tracking-wide"
          >
            Add Now
          </button>
          <button
            onClick={() => navigate("/dashboard/friends")}
            className="btn-outline flex-1 py-3.5 text-[0.95rem] font-light tracking-wide"
          >
            View Friends
          </button>
        </div>

        {/* money cards + net bar pushed to bottom */}
        <div className="mt-auto pt-6 shrink-0">
          <div className="grid grid-cols-2 gap-4">
            {receiveCard("p-4", "text-[1.75rem]")}
            {payCard("p-4", "text-[1.75rem]")}
          </div>
          <div className="mt-4">{netBar("py-4")}</div>
        </div>
      </div>

      {/* laptop/desktop layout */}
      <div className="hidden md:block space-y-8">
        {/* hero on left, money cards on right */}
        <div className="flex gap-8 items-start">
          {/* headline + buttons */}
          <div className="flex-1 min-w-0">
            <h1 className="text-5xl lg:text-6xl tracking-tight text-text-primary leading-[1.08]">
              <span className="font-light text-gradient-red">Clarity</span> <span className="font-extrabold">in money</span>{" "}
              <span className="font-extrabold">&amp;</span> <span className="font-light text-gradient-red">strength</span> <span className="font-extrabold">in bonds.</span>
            </h1>
            <p className="mt-4 text-base font-light text-text-secondary/50 leading-relaxed">
              Split expenses with friends. Track every rupee effortlessly.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => navigate("/dashboard/transactions", { state: { openAddTx: true } })}
                className="btn-primary px-6 py-2.5 text-sm font-light tracking-wide"
              >
                Add Now
              </button>
              <button
                onClick={() => navigate("/dashboard/friends")}
                className="btn-outline px-6 py-2.5 text-sm font-light tracking-wide"
              >
                View Friends
              </button>
            </div>
          </div>

          {/* compact stat cards */}
          <div className="w-72 lg:w-80 shrink-0 space-y-3">
            {receiveCard("p-4", "text-xl", false)}
            {payCard("p-4", "text-xl", false)}
          </div>
        </div>

        {/* net bar stretches full width */}
        {netBar("py-3")}

        {/* recent stuff - friends left, txns right */}
        <div className="grid grid-cols-2 gap-6">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="typo-subheading">Recent Friends</h2>
              <button
                onClick={() => navigate("/dashboard/friends")}
                className="typo-micro text-action-red hover:text-action-red-hover font-medium transition-colors"
              >
                View all
              </button>
            </div>
            {recentFriends.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <p className="text-base font-light text-text-muted italic">No friends yet — add someone to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentFriends.map((f: any) => (
                  <FriendCard
                    key={f._id}
                    name={f.username || f.email}
                    avatarUrl={f.avatarUrl}
                    email={f.email}
                    balance={f.balance}
                    onClick={() => navigate("/dashboard/friends")}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="typo-subheading">Recent Transactions</h2>
              <button
                onClick={() => navigate("/dashboard/transactions")}
                className="typo-micro text-action-red hover:text-action-red-hover font-medium transition-colors"
              >
                View all
              </button>
            </div>
            {recentTransactions.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <p className="text-base font-light text-text-muted italic">No transactions yet — tap + to create one</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTransactions.map((t: any) => (
                  <TransactionCard
                    key={t._id}
                    name={t.friendName || t.to?.username || "Unknown"}
                    avatarUrl={t.to?.avatarUrl}
                    amount={t.amount}
                    type={t.type === "lent" ? "owed" : "owe"}
                    description={t.description}
                    date={new Date(t.createdAt).toLocaleDateString()}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
