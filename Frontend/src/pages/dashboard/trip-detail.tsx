import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router";

const API = import.meta.env.VITE_API_URL;

interface UserRef {
  _id: string;
  username?: string;
  email: string;
  avatarUrl?: string;
}

interface Expense {
  _id: string;
  description: string;
  amount: number;
  paidBy: UserRef;
  splitAmong: UserRef[];
  category: string;
  billImageUrl?: string;
  createdAt: string;
}

interface MemberBalance {
  user: UserRef;
  totalPaid: number;
  totalShare: number;
  netBalance: number;
}

interface OptimizedSettlement {
  from: UserRef;
  to: UserRef;
  amount: number;
}

interface TripDetailsData {
  trip: {
    _id: string;
    name: string;
    description?: string;
    category: string;
    creatorId: UserRef;
    members: UserRef[];
    createdAt: string;
  };
  totalTripSpend: number;
  expenses: Expense[];
  memberBalances: MemberBalance[];
  optimizedSettlements: OptimizedSettlement[];
}

export default function TripDetailPage() {
  const { tripId } = useParams();
  const [data, setData] = useState<TripDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"expenses" | "balances" | "settlements">("expenses");

  // Add Expense Modal & Camera/File Upload states
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidByUserId, setPaidByUserId] = useState("");
  const [selectedSplitMemberIds, setSelectedSplitMemberIds] = useState<string[]>([]);
  const [category, setCategory] = useState("food");
  const [billImageBase64, setBillImageBase64] = useState("");
  const [submittingExpense, setSubmittingExpense] = useState(false);

  // Camera capture modal states
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Selected receipt image modal viewer
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchTripDetails = async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/trip/${tripId}`, { headers });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        if (json.data.trip.members.length > 0 && !paidByUserId) {
          setPaidByUserId(json.data.trip.members[0]._id);
          setSelectedSplitMemberIds(json.data.trip.members.map((m: any) => m._id));
        }
      }
    } catch (err) {
      console.error("Failed to fetch trip details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  // Handle File Upload for Bill Receipt
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBillImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Live Camera Capture
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed", err);
      alert("Unable to access camera. Please check camera permissions or upload a file.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setBillImageBase64(dataUrl);
        stopCamera();
      }
    }
  };

  const handleAddExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0 || !tripId) return;

    setSubmittingExpense(true);
    try {
      const res = await fetch(`${API}/trip/${tripId}/expenses`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          description,
          amount: Number(amount),
          paidBy: paidByUserId,
          splitAmong: selectedSplitMemberIds,
          category,
          billImageUrl: billImageBase64,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowAddExpenseModal(false);
        setDescription("");
        setAmount("");
        setBillImageBase64("");
        fetchTripDetails();
      }
    } catch (err) {
      console.error("Failed to add expense", err);
    } finally {
      setSubmittingExpense(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this bill?") || !tripId) return;
    try {
      const res = await fetch(`${API}/trip/${tripId}/expenses/${expenseId}`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json();
      if (json.success) {
        fetchTripDetails();
      }
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="glass-card h-40 rounded-3xl animate-pulse bg-white/5" />
        <div className="glass-card h-80 rounded-3xl animate-pulse bg-white/5" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto glass-card p-8 rounded-3xl text-center space-y-4">
        <p className="text-white text-lg">Trip not found</p>
        <Link to="/dashboard/trips" className="btn-primary px-4 py-2 rounded-xl text-sm inline-block">
          Back to Trips
        </Link>
      </div>
    );
  }

  const { trip, totalTripSpend, expenses, memberBalances, optimizedSettlements } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Header Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link to="/dashboard/trips" className="text-text-muted hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                &larr; All Trips
              </Link>
              <span className="px-2.5 py-0.5 rounded-full bg-action-red/20 text-action-red text-xs font-bold uppercase tracking-wider">
                {trip.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {trip.name}
            </h1>
            {trip.description && (
              <p className="text-text-secondary text-sm max-w-xl">{trip.description}</p>
            )}
          </div>

          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="btn-primary px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-action-red/30 hover:scale-[1.02] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Bill / Expense
          </button>
        </div>

        {/* Hero Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <p className="text-xs text-text-secondary uppercase font-semibold tracking-wider">Total Group Spend</p>
            <p className="text-2xl font-extrabold text-white">₹{totalTripSpend.toLocaleString("en-IN")}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <p className="text-xs text-text-secondary uppercase font-semibold tracking-wider">Group Members</p>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-2xl font-extrabold text-white">{trip.members.length}</span>
              <span className="text-xs text-text-muted">people sharing</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <p className="text-xs text-text-secondary uppercase font-semibold tracking-wider">Shortest Dues Needed</p>
            <p className="text-2xl font-extrabold text-action-red">
              {optimizedSettlements.length} {optimizedSettlements.length === 1 ? "payment" : "payments"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 glass-card rounded-2xl border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab("expenses")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "expenses"
              ? "bg-action-red text-white shadow-lg shadow-action-red/30"
              : "text-text-secondary hover:text-white"
          }`}
        >
          <span>🧾</span> Bills ({expenses.length})
        </button>

        <button
          onClick={() => setActiveTab("balances")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "balances"
              ? "bg-action-red text-white shadow-lg shadow-action-red/30"
              : "text-text-secondary hover:text-white"
          }`}
        >
          <span>⚖️</span> Member Dues
        </button>

        <button
          onClick={() => setActiveTab("settlements")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "settlements"
              ? "bg-action-red text-white shadow-lg shadow-action-red/30"
              : "text-text-secondary hover:text-white"
          }`}
        >
          <span>⚡</span> Shortest Dues Settlement ({optimizedSettlements.length})
        </button>
      </div>

      {/* TAB 1: EXPENSES LIST */}
      {activeTab === "expenses" && (
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl text-center space-y-4 border border-white/5">
              <span className="text-4xl">🧾</span>
              <h3 className="text-xl font-bold text-white">No Bills Logged Yet</h3>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                Add your trip bills (dinner, hotel stay, gas, drinks) and select who paid and who shares!
              </p>
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                Log First Expense
              </button>
            </div>
          ) : (
            expenses.map((e) => {
              const paidByName = e.paidBy?.username || e.paidBy?.email.split("@")[0] || "Someone";
              const splitCount = e.splitAmong?.length || trip.members.length;

              return (
                <div
                  key={e._id}
                  className="glass-card p-5 md:p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail receipt button or category icon */}
                    {e.billImageUrl ? (
                      <div
                        onClick={() => setSelectedReceiptUrl(e.billImageUrl!)}
                        className="w-14 h-14 rounded-xl overflow-hidden border border-action-red/40 cursor-pointer relative group flex-shrink-0"
                        title="Click to view full receipt"
                      >
                        <img src={e.billImageUrl} alt="Bill receipt" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs text-white font-bold">
                          View
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                        {e.category === "food" ? "🍱" : e.category === "stay" ? "🏨" : e.category === "travel" ? "🚗" : "🎟️"}
                      </div>
                    )}

                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white">{e.description}</h4>
                      <p className="text-xs text-text-secondary flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium">Paid by {paidByName}</span>
                        <span>&bull;</span>
                        <span>Split among {splitCount} people</span>
                        <span>&bull;</span>
                        <span className="text-text-muted">
                          {new Date(e.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="text-right">
                      <p className="text-xl font-extrabold text-white">₹{e.amount.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-text-muted">₹{(e.amount / splitCount).toFixed(0)} / person</p>
                    </div>

                    <button
                      onClick={() => handleDeleteExpense(e._id)}
                      className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 text-text-muted hover:text-red-400 flex items-center justify-center transition-colors"
                      title="Delete bill"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: MEMBER BALANCES */}
      {activeTab === "balances" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memberBalances.map((mb) => {
            const name = mb.user.username || mb.user.email.split("@")[0];
            const isOwed = mb.netBalance > 0;
            const owes = mb.netBalance < 0;

            return (
              <div
                key={mb.user._id}
                className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-action-red/20 border border-action-red/30 flex items-center justify-center font-bold text-white text-base uppercase">
                      {name[0]}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{name}</h4>
                      <p className="text-xs text-text-muted">{mb.user.email}</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isOwed
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : owes
                        ? "bg-action-red/20 text-action-red border border-action-red/30"
                        : "bg-white/10 text-text-muted"
                    }`}
                  >
                    {isOwed ? "Gets Back" : owes ? "Owes Group" : "Settled"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-xs text-text-muted">Total Paid Out</p>
                    <p className="text-base font-bold text-white">₹{mb.totalPaid.toLocaleString("en-IN")}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-xs text-text-muted">Total Fair Share</p>
                    <p className="text-base font-bold text-white">₹{mb.totalShare.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-text-secondary font-medium">Net Position</span>
                  <span
                    className={`text-xl font-extrabold ${
                      isOwed ? "text-green-400" : owes ? "text-action-red" : "text-white"
                    }`}
                  >
                    {isOwed ? `+₹${mb.netBalance.toLocaleString("en-IN")}` : `₹${mb.netBalance.toLocaleString("en-IN")}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: SHORTEST DUES SETTLEMENT (GREEDY CASH FLOW RESOLUTION) */}
      {activeTab === "settlements" && (
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="space-y-2 border-b border-white/10 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-action-red/20 text-action-red text-xs font-bold uppercase tracking-wider">
              ⚡ Minimum Cash Flow Algorithm
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              Shortest Conflict Resolution ({optimizedSettlements.length} direct {optimizedSettlements.length === 1 ? "payment" : "payments"})
            </h3>
            <p className="text-text-secondary text-sm">
              Instead of everyone paying each other multiple times, our algorithm simplifies all trip dues into the absolute minimum number of direct transactions.
            </p>
          </div>

          {optimizedSettlements.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <span className="text-5xl">🎉</span>
              <h4 className="text-xl font-bold text-white">All Dues Resolved!</h4>
              <p className="text-text-secondary text-sm">Everyone in this trip is 100% even.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {optimizedSettlements.map((s, idx) => {
                const fromName = s.from?.username || s.from?.email.split("@")[0] || "Someone";
                const toName = s.to?.username || s.to?.email.split("@")[0] || "Someone";

                return (
                  <div
                    key={idx}
                    className="p-5 md:p-6 rounded-2xl bg-white/[0.03] border border-action-red/30 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                      {/* From Member */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-action-red/30 border border-action-red/50 flex items-center justify-center font-bold text-white uppercase text-sm">
                          {fromName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{fromName}</p>
                          <p className="text-xs text-action-red font-medium">Pays</p>
                        </div>
                      </div>

                      {/* Payment Arrow & Amount Pill */}
                      <div className="flex flex-col items-center px-4">
                        <span className="text-lg font-black text-white px-4 py-1.5 rounded-full bg-action-red/20 border border-action-red/40 text-action-red shadow-lg shadow-action-red/20">
                          ₹{s.amount.toLocaleString("en-IN")}
                        </span>
                        <div className="w-24 h-0.5 bg-gradient-to-r from-action-red to-green-400 my-1 relative">
                          <div className="absolute -right-1 -top-1 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-green-400" />
                        </div>
                      </div>

                      {/* To Member */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/30 border border-green-500/50 flex items-center justify-center font-bold text-white uppercase text-sm">
                          {toName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{toName}</p>
                          <p className="text-xs text-green-400 font-medium">Receives</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Marked settlement of ₹${s.amount} from ${fromName} to ${toName} as paid!`)}
                      className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-green-500/20 text-white hover:text-green-400 border border-white/15 hover:border-green-500/40 text-xs font-bold tracking-wider uppercase transition-all"
                    >
                      ✓ Mark Settled
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ADD EXPENSE MODAL WITH CAMERA CAPTURE & FILE UPLOAD */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg p-6 md:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🧾</span> Log Group Expense / Bill
              </h3>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white flex items-center justify-center transition-colors"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Expense Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dinner at Thalassa, Fuel Refill, Resort Stay"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-text-muted focus:outline-none focus:border-action-red/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Total Amount (₹) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="2400"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-text-muted focus:outline-none focus:border-action-red/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-action-red/60"
                  >
                    <option value="food">🍱 Food & Drinks</option>
                    <option value="stay">🏨 Hotel & Stay</option>
                    <option value="travel">🚗 Fuel & Travel</option>
                    <option value="activity">🎟️ Activities</option>
                    <option value="other">📦 Other</option>
                  </select>
                </div>
              </div>

              {/* Paid By Selection */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Who Paid?
                </label>
                <select
                  value={paidByUserId}
                  onChange={(e) => setPaidByUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-action-red/60"
                >
                  {trip.members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.username || m.email.split("@")[0]} ({m.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Split Among Selection */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Split Evenly Among ({selectedSplitMemberIds.length} members)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
                  {trip.members.map((m) => {
                    const isChecked = selectedSplitMemberIds.includes(m._id);
                    const name = m.username || m.email.split("@")[0];

                    return (
                      <div
                        key={m._id}
                        onClick={() => {
                          setSelectedSplitMemberIds((prev) =>
                            prev.includes(m._id) ? prev.filter((id) => id !== m._id) : [...prev, m._id]
                          );
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center justify-between transition-all ${
                          isChecked
                            ? "bg-action-red/20 border-action-red text-white"
                            : "bg-white/5 border-white/10 text-text-secondary"
                        }`}
                      >
                        <span>{name}</span>
                        {isChecked && <span>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bill Receipt Upload & Direct Camera Capture */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Bill Receipt (Upload File or Camera Capture)
                </label>

                {billImageBase64 ? (
                  <div className="relative rounded-2xl overflow-hidden border border-action-red/50 max-h-48 group">
                    <img src={billImageBase64} alt="Receipt preview" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => setBillImageBase64("")}
                      className="absolute top-2 right-2 bg-black/80 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                      title="Remove receipt image"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <label className="p-3.5 rounded-2xl bg-white/5 border border-dashed border-white/20 hover:border-action-red/50 cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-colors text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-action-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <span className="text-xs font-medium text-white">Upload Receipt File</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <button
                      type="button"
                      onClick={startCamera}
                      className="p-3.5 rounded-2xl bg-white/5 border border-dashed border-white/20 hover:border-action-red/50 flex flex-col items-center justify-center gap-1.5 transition-colors text-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-action-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316A2.192 2.192 0 0 0 14.475 3.75h-4.95c-.714 0-1.378.36-1.768.96l-.93 1.465Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      <span className="text-xs font-medium text-white">Take Photo (Camera)</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingExpense || !description.trim() || !amount}
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                >
                  {submittingExpense ? "Logging..." : "Log Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE CAMERA CAPTURE MODAL */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="glass-card w-full max-w-md p-6 rounded-3xl border border-white/20 space-y-4 text-center">
            <h4 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <span>📸</span> Capture Bill Receipt
            </h4>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-white/10">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-action-red/30"
              >
                Snap Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN RECEIPT MODAL VIEWER */}
      {selectedReceiptUrl && (
        <div
          onClick={() => setSelectedReceiptUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg cursor-pointer"
        >
          <div className="max-w-2xl max-h-[85vh] p-2 relative animate-scale-in">
            <img src={selectedReceiptUrl} alt="Full receipt" className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-white/20" />
            <p className="text-center text-xs text-text-muted mt-3">Click anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
}
