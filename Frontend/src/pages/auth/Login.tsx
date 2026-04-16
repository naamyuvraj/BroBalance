import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://w2mxl9h3-8000.inc1.devtunnels.ms/api/auth/login", {
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
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Network error", err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://w2mxl9h3-8000.inc1.devtunnels.ms/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-bg-primary bg-glow noise-overlay flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col px-6 md:px-8 py-6 md:items-center md:justify-center">
        {/* Top bar — logo left-aligned on mobile, centered on desktop */}
        <div className="flex items-center gap-2.5 mb-12 md:mb-10 md:justify-center animate-fade-up">
          <div className="h-10 w-10 rounded-2xl bg-action-red/12 border border-action-red/15 flex items-center justify-center">
            <span className="text-action-red font-bold text-lg">B</span>
          </div>
          <span className="typo-heading text-lg font-semibold tracking-tight">BroBalance</span>
        </div>

        {/* Hero text — left-aligned mobile, centered desktop */}
        <div className="md:text-center max-w-md mb-8">
          <h1 className="animate-fade-up animate-fade-up-delay-1" style={{ fontSize: 'clamp(2.5rem, 10vw, 3.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            <span className="text-gradient-red">Track</span>
            <span className="text-text-primary"> &</span>
            <br />
            <span className="text-gradient-red">Settle</span>
            <br />
            <span className="text-text-primary">the Debts</span>
            <br />
            <span className="text-text-primary">You Share</span>
          </h1>
          <p className="typo-body text-text-secondary mt-5 max-w-xs md:max-w-sm md:mx-auto animate-fade-up animate-fade-up-delay-2">
            Split expenses, track balances, and settle up
            with your friends — effortlessly.
          </p>
        </div>

        {/* Action buttons — pill-shaped like reference */}
        <div className="flex items-center gap-3 mb-10 md:justify-center animate-fade-up animate-fade-up-delay-2">
          <button
            type="button"
            onClick={() => document.getElementById('login-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary typo-button px-7 py-3"
          >
            Sign In
          </button>
          <a
            href="/signup"
            className="btn-outline typo-button px-7 py-3"
          >
            Sign Up
          </a>
        </div>

        {/* Preview cards — mimicking the crypto ticker cards from the reference */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm md:mx-auto mb-10 animate-fade-up animate-fade-up-delay-3">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="typo-label tracking-widest">YOU OWE</span>
              <div className="h-7 w-7 rounded-full bg-action-red/10 border border-action-red/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-action-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0V11.25" />
                </svg>
              </div>
            </div>
            <p className="typo-micro text-action-red mb-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-action-red mr-1 align-middle" />
              2.19%
            </p>
            <p className="tabular-nums text-text-primary" style={{ fontSize: '1.35rem', fontWeight: 700 }}>₹4,200.00</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="typo-label tracking-widest">YOU'RE OWED</span>
              <div className="h-7 w-7 rounded-full bg-success/10 border border-success/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
                </svg>
              </div>
            </div>
            <p className="typo-micro text-success mb-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success mr-1 align-middle" />
              1.73%
            </p>
            <p className="tabular-nums text-text-primary" style={{ fontSize: '1.35rem', fontWeight: 700 }}>₹7,850.00</p>
          </div>
        </div>

        {/* Login form card */}
        <div id="login-form" className="w-full max-w-sm md:mx-auto glass-card rounded-3xl p-6 animate-fade-up animate-fade-up-delay-4">
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
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary typo-button py-3"
            >
              Sign In
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
            Don't have an account?{" "}
            <a href="/signup" className="text-action-red hover:text-action-red-hover font-medium transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
