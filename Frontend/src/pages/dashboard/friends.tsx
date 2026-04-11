import { useEffect, useState } from "react";
import { FriendCard, TransactionCard } from "src/components/ui/Cards";
import Loading from "src/components/ui/Loading";
import Modal from "src/components/ui/Modal";
import SearchBar from "src/components/ui/SearchBar";

const API = "http://localhost:8000/api";

interface Friend {
  _id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  balance?: number;
}

interface SearchedUser {
  _id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  mobileNumber?: string;
  instagramHandle?: string;
  isFriend: boolean;
  pendingRequest: boolean;
}

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Friend profile modal
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friendTransactions, setFriendTransactions] = useState<any[]>([]);
  const [loadingFriendTx, setLoadingFriendTx] = useState(false);

  // New user search
  const [userSearch, setUserSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);

  // User profile popup
  const [selectedUser, setSelectedUser] = useState<SearchedUser | null>(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  // Pending requests
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchFriends();
    fetchPendingRequests();
  }, [token]);

  const fetchFriends = () => {
    fetch(`${API}/friend`, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setFriends(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchPendingRequests = () => {
    fetch(`${API}/friend/requests/pending`, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPendingRequests(d.data);
      })
      .catch(() => {});
  };

  const handleFriendClick = (friend: Friend) => {
    setSelectedFriend(friend);
    setLoadingFriendTx(true);

    // get transactions with this friend
    fetch(`${API}/transaction?friendId=${friend._id}`, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setFriendTransactions(d.data);
      })
      .catch(() => {})
      .finally(() => setLoadingFriendTx(false));
  };

  const handleUserSearch = () => {
    if (!userSearch.trim()) return;
    setSearching(true);

    fetch(`${API}/user/search?q=${encodeURIComponent(userSearch)}`, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSearchResults(d.data);
      })
      .catch(() => {})
      .finally(() => setSearching(false));
  };

  const handleSendRequest = (userId: string) => {
    setSendingRequest(true);

    fetch(`${API}/friend/request`, {
      method: "POST",
      headers,
      body: JSON.stringify({ to: userId }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSelectedUser((prev) => (prev ? { ...prev, pendingRequest: true } : null));
          setSearchResults((prev) =>
            prev.map((u) => (u._id === userId ? { ...u, pendingRequest: true } : u))
          );
        }
      })
      .catch(() => {})
      .finally(() => setSendingRequest(false));
  };

  const handleAcceptRequest = (requestId: string) => {
    fetch(`${API}/friend/request/${requestId}/accept`, {
      method: "POST",
      headers,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setPendingRequests((prev) => prev.filter((r) => r._id !== requestId));
          fetchFriends();
        }
      })
      .catch(() => {});
  };

  const handleDeclineRequest = (requestId: string) => {
    fetch(`${API}/friend/request/${requestId}/decline`, {
      method: "POST",
      headers,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setPendingRequests((prev) => prev.filter((r) => r._id !== requestId));
        }
      })
      .catch(() => {});
  };

  if (loading) return <Loading />;

  const filteredFriends = friends.filter(
    (f) =>
      f.username?.toLowerCase().includes(search.toLowerCase()) ||
      f.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight tracking-tight text-text-primary">
            Your <span className="font-semibold">Friends</span>
          </h1>
          <p className="typo-body mt-1">{friends.length} connection{friends.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => {
            setShowUserSearch(true);
            setUserSearch("");
            setSearchResults([]);
          }}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-light tracking-wide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          Add Friend
        </button>
      </div>

      {/* Pending requests */}
      {pendingRequests.length > 0 && (
        <section>
          <h2 className="typo-subheading text-sm mb-3">
            Pending Requests ({pendingRequests.length})
          </h2>
          <div className="space-y-2">
            {pendingRequests.map((req: any) => (
              <div
                key={req._id}
                className="flex items-center gap-4 glass-card border-action-red/20 rounded-xl px-4 py-3"
              >
                <div className="h-10 w-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                  {req.from?.avatarUrl ? (
                    <img src={req.from.avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="typo-button text-text-secondary">
                      {(req.from?.username?.[0] || "?").toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="typo-subheading text-sm truncate">
                    {req.from?.username || req.from?.email}
                  </p>
                  <p className="typo-micro">wants to connect</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleAcceptRequest(req._id)}
                    className="btn-primary px-4 py-1.5 text-xs font-light tracking-wide"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(req._id)}
                    className="btn-outline px-4 py-1.5 text-xs font-light tracking-wide"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search friends */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search your friends..."
      />

      {/* Friends list */}
      {filteredFriends.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-2xl glass flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <p className="text-xl font-extralight text-text-muted/80 italic mb-2">
            {search ? "No matches found" : "\"Great things are never done alone\""}
          </p>
          <p className="typo-micro max-w-xs">
            {search
              ? "Try a different search term"
              : "Add your first friend and start tracking shared expenses effortlessly."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFriends.map((f) => (
            <FriendCard
              key={f._id}
              name={f.username || f.email}
              avatarUrl={f.avatarUrl}
              email={f.email}
              balance={f.balance}
              onClick={() => handleFriendClick(f)}
            />
          ))}
        </div>
      )}

      {/* friend details modal */}
      <Modal
        open={!!selectedFriend}
        onClose={() => {
          setSelectedFriend(null);
          setFriendTransactions([]);
        }}
        title="Friend Details"
        wide
      >
        {selectedFriend && (
          <div className="space-y-5">
            {/* Friend info */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center overflow-hidden shrink-0">
                {selectedFriend.avatarUrl ? (
                  <img src={selectedFriend.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-text-secondary">
                    {(selectedFriend.username?.[0] || "?").toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="typo-subheading truncate">
                  {selectedFriend.username}
                </p>
                <p className="typo-body truncate">{selectedFriend.email}</p>
              </div>
              {selectedFriend.balance !== undefined && (
                <div className="ml-auto text-right shrink-0">
                  <p
                    className={`typo-financial-sm tabular-nums text-lg ${
                      selectedFriend.balance > 0
                        ? "text-success"
                        : selectedFriend.balance < 0
                        ? "text-action-red"
                        : "text-text-muted"
                    }`}
                  >
                    {selectedFriend.balance > 0 ? "+" : ""}₹
                    {Math.abs(selectedFriend.balance).toLocaleString()}
                  </p>
                  <p className="typo-micro">
                    {selectedFriend.balance > 0
                      ? "they owe you"
                      : selectedFriend.balance < 0
                      ? "you owe them"
                      : "settled up"}
                  </p>
                </div>
              )}
            </div>

            <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

            {/* Transactions with this friend */}
            <div>
              <h3 className="text-[11px] uppercase tracking-widest font-semibold text-text-muted/50 mb-3">Transactions</h3>
              {loadingFriendTx ? (
                <Loading size="sm" />
              ) : friendTransactions.length === 0 ? (
                <p className="typo-body text-center py-4">
                  No transactions with this friend yet
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {friendTransactions.map((t: any) => (
                    <TransactionCard
                      key={t._id}
                      name={t.description || "Transaction"}
                      amount={t.amount}
                      type={t.type === "lent" ? "owed" : "owe"}
                      description={t.description}
                      date={new Date(t.createdAt).toLocaleDateString()}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* find people modal */}
      <Modal
        open={showUserSearch}
        onClose={() => {
          setShowUserSearch(false);
          setSelectedUser(null);
          setSearchResults([]);
        }}
        title="Find People"
        wide
      >
        {!selectedUser ? (
          <div className="space-y-4">
            {/* Search input */}
            <div className="flex gap-2">
              <div className="flex-1">
                <SearchBar
                  value={userSearch}
                  onChange={setUserSearch}
                  placeholder="Search by name or email..."
                />
              </div>
              <button
                onClick={handleUserSearch}
                disabled={searching || !userSearch.trim()}
                className="btn-primary px-5 py-2.5 text-sm font-light tracking-wide disabled:opacity-50 shrink-0"
              >
                {searching ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </div>

            {/* Results */}
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className="flex items-center gap-4 glass-card rounded-xl px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="typo-button text-text-secondary">
                          {(user.username?.[0] || "?").toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="typo-subheading text-sm truncate">
                        {user.username || "No name"}
                      </p>
                      <p className="typo-micro truncate">{user.email}</p>
                    </div>
                    {user.isFriend && (
                      <span className="typo-micro text-success font-medium shrink-0">Friend</span>
                    )}
                    {user.pendingRequest && (
                      <span className="typo-micro text-warning font-medium shrink-0">Pending</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              !searching && userSearch && (
                <p className="typo-body text-center py-4">No users found</p>
              )
            )}
          </div>
        ) : (
          /* User profile popup view */
          <div className="space-y-5">
            <button
              onClick={() => setSelectedUser(null)}
              className="flex items-center gap-1 text-xs text-text-muted/60 hover:text-text-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              Back to results
            </button>

            {/* Profile card */}
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center overflow-hidden mb-4" style={{ boxShadow: '0 0 20px rgba(240,101,91,0.08), 0 1px 0 rgba(255,255,255,0.04) inset' }}>
                {selectedUser.avatarUrl ? (
                  <img src={selectedUser.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-text-secondary">
                    {(selectedUser.username?.[0] || "?").toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="typo-heading">
                {selectedUser.username || "Unknown"}
              </h3>
              <p className="typo-body">{selectedUser.email}</p>
            </div>

            {/* Details */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <DetailRow label="Email" value={selectedUser.email} />
              {selectedUser.mobileNumber && (
                <DetailRow label="Mobile" value={selectedUser.mobileNumber} />
              )}
              {selectedUser.instagramHandle && (
                <DetailRow label="Instagram" value={selectedUser.instagramHandle} />
              )}
            </div>

            {/* Action button */}
            {selectedUser.isFriend ? (
              <div className="text-center py-2">
                <span className="inline-flex items-center gap-2 typo-body text-success font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Already Friends
                </span>
              </div>
            ) : selectedUser.pendingRequest ? (
              <div className="text-center py-2">
                <span className="inline-flex items-center gap-2 typo-body text-warning font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Request Pending
                </span>
              </div>
            ) : (
              <button
                onClick={() => handleSendRequest(selectedUser._id)}
                disabled={sendingRequest}
                className="btn-primary w-full py-3 text-base font-light tracking-wide disabled:opacity-50"
              >
                {sendingRequest ? "Sending..." : "Send Connection Request"}
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] uppercase tracking-widest font-semibold text-text-muted/50">{label}</span>
      <span className="text-sm text-text-primary">{value}</span>
    </div>
  );
}
