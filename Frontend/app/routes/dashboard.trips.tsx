import { useEffect, useState } from "react";
import { Link } from "react-router";

const API = import.meta.env.VITE_API_URL;

interface Trip {
  _id: string;
  name: string;
  description?: string;
  category: "trip" | "house" | "event" | "other";
  totalSpend: number;
  expenseCount: number;
  members: Array<{
    _id: string;
    username?: string;
    email: string;
    avatarUrl?: string;
  }>;
  createdAt: string;
}

interface Friend {
  _id: string;
  user: {
    _id: string;
    username?: string;
    email: string;
    avatarUrl?: string;
  };
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Trip form state
  const [tripName, setTripName] = useState("");
  const [tripDesc, setTripDesc] = useState("");
  const [tripCategory, setTripCategory] = useState<"trip" | "house" | "event" | "other">("trip");
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/trip`, { headers });
      const data = await res.json();
      if (data.success) {
        setTrips(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch trips", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await fetch(`${API}/friend`, { headers });
      const data = await res.json();
      if (data.success) {
        setFriends(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch friends", err);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchFriends();
  }, []);

  const toggleFriendSelection = (friendUserId: string) => {
    setSelectedFriendIds((prev) =>
      prev.includes(friendUserId)
        ? prev.filter((id) => id !== friendUserId)
        : [...prev, friendUserId]
    );
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripName.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/trip`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: tripName,
          description: tripDesc,
          category: tripCategory,
          memberIds: selectedFriendIds,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setTripName("");
        setTripDesc("");
        setSelectedFriendIds([]);
        fetchTrips();
      }
    } catch (err) {
      console.error("Failed to create trip", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "trip":
        return "🌴";
      case "house":
        return "🏠";
      case "event":
        return "🎟️";
      default:
        return "📦";
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-white/10">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-action-red/10 border border-action-red/20 text-action-red text-xs font-semibold uppercase tracking-wider">
            Group Expense Engine
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Trips & <span className="text-action-red">Group Dues</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Organize trips with your friends, record shared bills with receipts, and automatically compute the shortest conflict-free payment paths to clear all dues.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-action-red/30 hover:scale-[1.02] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create New Trip
        </button>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card h-48 rounded-2xl animate-pulse bg-white/5" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4 border border-white/5">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-3xl">
            ✈️
          </div>
          <h3 className="text-xl font-bold text-white">No Trips Yet</h3>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Going on a trip or splitting monthly house bills with roommates? Create a trip and invite your friends to start logging expenses!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium"
          >
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link
              key={trip._id}
              to={`/dashboard/trips/${trip._id}`}
              className="group glass-card p-6 rounded-2xl border border-white/10 hover:border-action-red/40 hover:shadow-xl hover:shadow-action-red/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                    <span>{getCategoryIcon(trip.category)}</span>
                    <span className="capitalize">{trip.category}</span>
                  </span>
                  <span className="text-xs text-text-muted">
                    {trip.expenseCount} {trip.expenseCount === 1 ? "bill" : "bills"}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-action-red transition-colors">
                    {trip.name}
                  </h3>
                  {trip.description && (
                    <p className="text-text-muted text-xs line-clamp-2 mt-1">
                      {trip.description}
                    </p>
                  )}
                </div>

                {/* Total Spend Hero Pill */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">Total Group Spend</span>
                  <span className="text-lg font-extrabold text-white">
                    ₹{trip.totalSpend.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Footer: Member Avatars */}
              <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center -space-x-2 overflow-hidden">
                  {trip.members.slice(0, 4).map((member) => (
                    <div
                      key={member._id}
                      className="w-8 h-8 rounded-full bg-action-red/20 border-2 border-bg-card flex items-center justify-center text-xs font-bold text-white uppercase"
                      title={member.username || member.email}
                    >
                      {(member.username || member.email)[0]}
                    </div>
                  ))}
                  {trip.members.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-bg-card flex items-center justify-center text-xs font-semibold text-text-secondary">
                      +{trip.members.length - 4}
                    </div>
                  )}
                </div>

                <span className="text-xs font-semibold text-action-red flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Workspace &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create New Trip Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg p-6 md:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6 animate-scale-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🌴</span> Create Group Trip
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white flex items-center justify-center transition-colors"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Trip / Group Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa Trip 2026, Manali Roadtrip, Apartment 402"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-text-muted focus:outline-none focus:border-action-red/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4 guys trip, splitting food, stay & gas"
                  value={tripDesc}
                  onChange={(e) => setTripDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-text-muted focus:outline-none focus:border-action-red/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["trip", "house", "event", "other"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTripCategory(cat)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold capitalize flex flex-col items-center gap-1 transition-all ${
                        tripCategory === cat
                          ? "bg-action-red/20 border-action-red text-white"
                          : "bg-white/5 border-white/10 text-text-secondary hover:bg-white/10"
                      }`}
                    >
                      <span>{getCategoryIcon(cat)}</span>
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Invite Friends Selection */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Invite Friends ({selectedFriendIds.length} selected)
                </label>
                {friends.length === 0 ? (
                  <p className="text-xs text-text-muted italic bg-white/5 p-3 rounded-xl">
                    No connected friends found. You can still create the trip and invite friends later!
                  </p>
                ) : (
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {friends.map((f) => {
                      const fUserId = f.user._id;
                      const isSelected = selectedFriendIds.includes(fUserId);
                      const name = f.user.username || f.user.email.split("@")[0];

                      return (
                        <div
                          key={f._id}
                          onClick={() => toggleFriendSelection(fUserId)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? "bg-action-red/15 border-action-red/60 text-white"
                              : "bg-white/5 border-white/10 text-text-secondary hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-action-red/30 flex items-center justify-center font-bold text-xs text-white uppercase">
                              {name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{name}</p>
                              <p className="text-xs text-text-muted">{f.user.email}</p>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                              isSelected ? "bg-action-red border-action-red text-white" : "border-white/20"
                            }`}
                          >
                            {isSelected && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !tripName.trim()}
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
