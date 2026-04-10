import { useEffect, useState } from "react";
import Modal from "src/components/ui/Modal";

const API = "http://localhost:8000/api";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function AddTransactionModal({ open, onClose, onCreated }: AddTransactionModalProps) {
  const [friends, setFriends] = useState<any[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [friendId, setFriendId] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"lent" | "borrowed">("lent");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (open && token) {
      setLoadingFriends(true);
      fetch(`${API}/friend`, { headers })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setFriends(d.data);
        })
        .catch(() => {})
        .finally(() => setLoadingFriends(false));
    }
    // Reset form when opening
    if (open) {
      setFriendId("");
      setAmount("");
      setType("lent");
      setDescription("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendId || !amount) {
      setError("Please select a friend and enter an amount");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API}/transaction`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          friendId,
          amount: parsedAmount,
          type,
          description,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onCreated?.();
        onClose();
      } else {
        setError(data.message || "Failed to create transaction");
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Transaction">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="glass-card-red rounded-xl px-4 py-3 text-sm text-action-red">
            {error}
          </div>
        )}

        {/* Friend select */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest font-semibold text-text-muted/50 mb-2">
            Friend
          </label>
          {loadingFriends ? (
            <div className="flex items-center gap-2 rounded-xl py-3 px-4 text-sm text-text-muted" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="h-4 w-4 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
              Loading friends...
            </div>
          ) : (
            <select
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
              className="w-full glass-input rounded-xl py-3 px-4 text-sm text-text-primary appearance-none"
            >
              <option value="">Select a friend</option>
              {friends.map((f: any) => (
                <option key={f._id} value={f._id}>
                  {f.username || f.email}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Type toggle */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest font-semibold text-text-muted/50 mb-2">
            Type
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("lent")}
              className={`flex-1 py-2.5 text-sm font-light tracking-wide rounded-full transition-all duration-200 ${
                type === "lent"
                  ? "bg-success/15 text-success border border-success/25"
                  : "text-text-muted border border-white/[0.06] hover:border-white/[0.12]"
              }`}
              style={type === "lent" ? { boxShadow: '0 1px 0 rgba(74,222,128,0.15) inset, 0 -1px 1px rgba(0,0,0,0.2) inset, 0 0 20px rgba(74,222,128,0.08)' } : {}}
            >
              I Lent
            </button>
            <button
              type="button"
              onClick={() => setType("borrowed")}
              className={`flex-1 py-2.5 text-sm font-light tracking-wide rounded-full transition-all duration-200 ${
                type === "borrowed"
                  ? "bg-action-red/15 text-action-red border border-action-red/25"
                  : "text-text-muted border border-white/[0.06] hover:border-white/[0.12]"
              }`}
              style={type === "borrowed" ? { boxShadow: '0 1px 0 rgba(240,101,91,0.15) inset, 0 -1px 1px rgba(0,0,0,0.2) inset, 0 0 20px rgba(240,101,91,0.08)' } : {}}
            >
              I Borrowed
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest font-semibold text-text-muted/50 mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60 text-sm">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full glass-input rounded-xl py-3 pl-8 pr-4 text-sm text-text-primary placeholder-text-muted/40 tabular-nums"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest font-semibold text-text-muted/50 mb-2">
            Description <span className="normal-case tracking-normal font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this for?"
            className="w-full glass-input rounded-xl py-3 px-4 text-sm text-text-primary placeholder-text-muted/40"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-3.5 text-sm font-light tracking-wide disabled:opacity-50"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </span>
          ) : (
            "Create Transaction"
          )}
        </button>
      </form>
    </Modal>
  );
}
