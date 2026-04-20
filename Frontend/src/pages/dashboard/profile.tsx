import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  mobileNumber?: string;
  instagramHandle?: string;
  createdAt: string;
}

const API = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", mobileNumber: "", instagramHandle: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalFriends, setTotalFriends] = useState(0);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const fetchUser = fetch(`${API}/user/me`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
          setForm({
            username: data.data.username || "",
            mobileNumber: data.data.mobileNumber || "",
            instagramHandle: data.data.instagramHandle || "",
          });
        } else {
          setError(data.message || "Failed to load profile.");
        }
      })
      .catch(() => setError("Network error. Could not load profile."));

    const fetchFriends = fetch(`${API}/friend`, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTotalFriends(d.data?.length || 0);
      })
      .catch(() => {});

    Promise.all([fetchUser, fetchFriends]).finally(() => setLoading(false));
  }, [token]);

  // save the edits
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API}/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setEditing(false);
      } else {
        setError(data.message || "Failed to save changes.");
      }
    } catch {
      setError("Network error. Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  // how much of the profile is filled out
  const getCompletion = () => {
    if (!user) return 0;
    const fields = [user.username, user.email, user.avatarUrl, user.mobileNumber, user.instagramHandle];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  // when did they join
  const getMemberSince = () => {
    if (!user) return "";
    return new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 border-2 border-action-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted">
        {error || "Could not load profile."}
      </div>
    );
  }

  const completion = getCompletion();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="max-w-2xl md:max-w-3xl mx-auto space-y-6">

      {/* error msg if something broke */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 typo-body rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* profile pic + name card */}
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center">
        {/* pfp */}
        <div className="relative mb-4">
          <div className="h-24 w-24 rounded-full bg-action-red/10 border-2 border-action-red/30 flex items-center justify-center overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-action-red">
                {(user.username?.[0] || user.email[0]).toUpperCase()}
              </span>
            )}
          </div>
          {/* lil checkmark */}
          {completion === 100 && (
            <div className="absolute -top-1 -left-1 h-7 w-7 rounded-full bg-success flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* name + member since */}
        <h1 className="typo-heading text-xl font-bold">
          {user.username || "New User"}
        </h1>
        <p className="typo-micro mt-0.5">Member since {getMemberSince()}</p>

        {/* how many friends */}
        <div className="mt-4 flex items-center gap-2 glass rounded-full px-4 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-action-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          <span className="typo-button text-text-primary">{totalFriends}</span>
          <span className="typo-micro">friends</span>
        </div>

        {/* that progress bar showing profile completeness */}
        <div className="w-full max-w-xs mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="typo-label">Profile Completion</span>
            <span className="typo-button tabular-nums text-text-primary">{completion}%</span>
          </div>
          <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
            <div
              className="h-full rounded-full bg-action-red transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* personal info / edit mode */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="typo-subheading">Personal Information</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 typo-micro text-action-red hover:text-action-red-hover font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
              </svg>
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 typo-button text-text-muted hover:text-text-primary border border-border rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-3 py-1.5 typo-button text-white bg-action-red hover:bg-action-red-hover rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <InfoRow
            label="Username"
            value={user.username}
            editing={editing}
            inputValue={form.username}
            onChange={(v) => setForm({ ...form, username: v })}
            placeholder="Enter your name"
          />
          <InfoRow
            label="Email"
            value={user.email}
            editing={false}
            inputValue={user.email}
            onChange={() => {}}
            placeholder=""
          />
          <InfoRow
            label="Mobile"
            value={user.mobileNumber}
            editing={editing}
            inputValue={form.mobileNumber}
            onChange={(v) => setForm({ ...form, mobileNumber: v })}
            placeholder="Enter phone number"
          />
          <InfoRow
            label="Instagram"
            value={user.instagramHandle}
            editing={editing}
            inputValue={form.instagramHandle}
            onChange={(v) => setForm({ ...form, instagramHandle: v })}
            placeholder="@handle"
          />
        </div>
      </div>

      {/* account details */}
      <div className="glass-card rounded-2xl p-6 space-y-3">
        <h2 className="typo-subheading mb-4">Account</h2>
        <AccountRow label="Login method" value={user.avatarUrl ? "Google" : "Email & Password"} />
        <AccountRow label="User ID" value={user._id} mono />
      </div>

      {/* peace out button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-3 glass-card rounded-2xl px-5 py-4 text-action-red hover:bg-action-red/10 hover:border-action-red/20 transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
        <span className="typo-button">Log Out</span>
      </button>
    </div>
  );
}

/* helper components */

function InfoRow({
  label,
  value,
  editing,
  inputValue,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  editing: boolean;
  inputValue: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-3 border-b border-border last:border-0">
      <span className="typo-label w-28 shrink-0">{label}</span>
      {editing ? (
        <input
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 glass-input rounded-lg py-2 px-3 typo-body text-text-primary placeholder-text-muted"
        />
      ) : (
        <span className={`flex-1 typo-body ${value ? "text-text-primary" : "text-text-muted italic"}`}>
          {value || "Not set"}
        </span>
      )}
    </div>
  );
}

function AccountRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-3 border-b border-border last:border-0">
      <span className="typo-label w-28 shrink-0">{label}</span>
      <span className={`flex-1 typo-body text-text-primary truncate ${mono ? "font-mono text-xs text-text-secondary" : ""}`}>
        {value}
      </span>
    </div>
  );
}
