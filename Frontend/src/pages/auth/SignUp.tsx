import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.data.token);
        window.location.href = "/dashboard/profile";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Network error", err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-bg-primary bg-glow noise-overlay flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col px-6 md:px-8 py-6 md:items-center md:justify-center">
        {/* logo */}
        <div className="flex items-center gap-2.5 mb-10 md:justify-center animate-fade-up">
          <div className="h-10 w-10 rounded-2xl bg-action-red/12 border border-action-red/15 flex items-center justify-center">
            <span className="text-action-red font-bold text-lg">B</span>
          </div>
          <span className="typo-heading text-lg font-semibold tracking-tight">BroBalance</span>
        </div>

        {/* heading */}
        <div className="md:text-center max-w-sm mb-8 animate-fade-up animate-fade-up-delay-1">
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 2.75rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            <span className="text-gradient-red">Join</span>{" "}
            <span className="text-text-primary">the Squad</span>
          </h1>
          <p className="typo-body text-text-secondary mt-3 max-w-xs">
            Create your account and start tracking
          </p>
        </div>

        {/* signup form */}
        <div className="w-full max-w-sm md:mx-auto glass-card rounded-3xl p-6 animate-fade-up animate-fade-up-delay-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block typo-label mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input rounded-xl py-3 px-4 typo-body text-text-primary placeholder-text-muted"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block typo-label mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input rounded-xl py-3 px-4 typo-body text-text-primary placeholder-text-muted"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block typo-label mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full glass-input rounded-xl py-3 px-4 typo-body text-text-primary placeholder-text-muted"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary typo-button py-3"
            >
              Sign Up
            </button>
          </form>

          <div className="my-5 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="typo-label">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full btn-outline typo-body py-3 flex items-center justify-center gap-3"
          >
            <img
              className="h-5 w-5"
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
            />
            Continue with Google
          </button>

          <p className="text-center typo-micro mt-5">
            Already have an account?{" "}
            <a href="/" className="text-action-red hover:text-action-red-hover font-medium transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
