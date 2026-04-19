import { useRef, useState, useEffect, useCallback } from "react";

/* ── mesh grid bg for hero ── */
function HeroMeshGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.2]" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ── contact modal — glass popup with emailjs ── */
function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setSending(true);
    try {
      // emailjs — user must set these env vars:
      // VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
      const emailjs = await import("@emailjs/browser");
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "",
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "",
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "",
      );
      setSent(true);
      formRef.current.reset();
    } catch {
      alert("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!open) setSent(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={onClose}>
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {/* modal */}
      <div
        className="relative glass-card rounded-3xl p-8 md:p-10 w-full max-w-md animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h3 className="mb-1" style={{ fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
          <span className="font-light text-text-secondary">Get in </span>
          <span className="font-bold text-text-primary">Touch</span>
        </h3>
        <p className="text-sm font-light text-text-muted mb-6">We&rsquo;ll get back to you within 24 hours.</p>

        {sent ? (
          <div className="text-center py-8">
            <div className="h-12 w-12 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </div>
            <p className="text-sm font-medium text-text-primary">Message sent!</p>
            <p className="text-xs font-light text-text-muted mt-1">We&rsquo;ll respond soon.</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <input
              name="from_name"
              required
              placeholder="Your name"
              className="w-full glass-input rounded-xl px-4 py-3 text-sm font-light text-text-primary placeholder-text-muted"
            />
            <input
              name="from_email"
              type="email"
              required
              placeholder="Your email"
              className="w-full glass-input rounded-xl px-4 py-3 text-sm font-light text-text-primary placeholder-text-muted"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Your message..."
              className="w-full glass-input rounded-xl px-4 py-3 text-sm font-light text-text-primary placeholder-text-muted resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full btn-primary py-3 text-sm font-semibold disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


/* ── how-it-works illustrations ── */

function HIWAddFriend() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-4 left-4 md:left-6 hiw-inner-card rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-action-red/15 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-action-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-text-primary">You</span>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="h-9 w-9 rounded-full bg-action-red/20 border border-action-red/30 flex items-center justify-center z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-action-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="35%" y1="38%" x2="50%" y2="50%" stroke="#F0655B" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
        <line x1="50%" y1="50%" x2="65%" y2="62%" stroke="#F0655B" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
        <polygon points="0,-4 8,0 0,4" fill="#F0655B" fillOpacity="0.6" transform="translate(65%, 62%) rotate(35)" />
      </svg>
      <div className="absolute bottom-4 right-4 md:right-6 hiw-inner-card rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-action-red/15 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-action-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m3-3h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-text-primary">Friend</span>
      </div>
    </div>
  );
}

function HIWLogExpense() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-4 left-4 md:left-6 hiw-inner-card rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-action-red/15 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-action-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-text-primary">You</span>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="h-9 w-9 rounded-full bg-action-red/20 border border-action-red/30 flex items-center justify-center z-10">
          <span className="text-action-red font-bold text-sm">₹</span>
        </div>
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="35%" y1="38%" x2="50%" y2="50%" stroke="#F0655B" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
        <line x1="50%" y1="50%" x2="65%" y2="62%" stroke="#F0655B" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
        <polygon points="0,-4 8,0 0,4" fill="#F0655B" fillOpacity="0.6" transform="translate(65%, 62%) rotate(35)" />
      </svg>
      <div className="absolute bottom-4 right-4 md:right-6 hiw-inner-card rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-action-red/15 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-action-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-text-primary">Friend</span>
      </div>
    </div>
  );
}

function HIWSettle() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-4 left-4 md:left-6 hiw-inner-card rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-success/15 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-text-primary">Owed</span>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="h-9 w-9 rounded-full bg-success/20 border border-success/30 flex items-center justify-center z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="35%" y1="38%" x2="50%" y2="50%" stroke="#4ADE80" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
        <line x1="50%" y1="50%" x2="65%" y2="62%" stroke="#4ADE80" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
        <polygon points="0,-4 8,0 0,4" fill="#4ADE80" fillOpacity="0.6" transform="translate(65%, 62%) rotate(35)" />
      </svg>
      <div className="absolute bottom-4 right-4 md:right-6 hiw-inner-card rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-success/15 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-text-primary">Settled</span>
      </div>
    </div>
  );
}


// ── main page ──

export default function LandingPage() {
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [nlEmail, setNlEmail] = useState("");
  const [nlStatus, setNlStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  // track scroll to shrink navbar after hero
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollHIW = (dir: "left" | "right") => {
    if (!howItWorksRef.current) return;
    howItWorksRef.current.scrollBy({
      left: dir === "right" ? 340 : -340,
      behavior: "smooth",
    });
  };

  // newsletter subscribe → POST to our backend
  const handleNewsletter = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!nlEmail.trim()) return;
      setNlStatus("sending");
      try {
        const API = import.meta.env.VITE_API_URL ?? "";
        const res = await fetch(`${API}/api/newsletter/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: nlEmail.trim() }),
        });
        if (!res.ok) throw new Error();
        setNlStatus("done");
        setNlEmail("");
      } catch {
        setNlStatus("error");
      }
    },
    [nlEmail],
  );

  const steps = [
    {
      num: "01",
      title: "Add Your Friends",
      desc: "Search by email or username. Send a request. Once they accept, you're connected and ready to split.",
      illustration: <HIWAddFriend />,
    },
    {
      num: "02",
      title: "Log the Expense",
      desc: "Paid for something? Pick a friend, enter the amount, mark it as lent or borrowed. Done in seconds.",
      illustration: <HIWLogExpense />,
    },
    {
      num: "03",
      title: "Settle Up",
      desc: "When they pay you back, mark it settled. Balances update instantly. No arguments, no drama.",
      illustration: <HIWSettle />,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">

      {/* contact modal */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {/* ─── NAVBAR — shrinks to just Get Started after scroll ─── */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-[90] w-auto">
        <div
          className={`nav-glass rounded-full flex items-center transition-all duration-500 ease-out ${
            scrolled
              ? "px-1.5 py-1 gap-0"
              : "px-2 py-1.5 gap-1"
          }`}
        >
          {/* logo — glowing, hides on scroll */}
          <a
            href="/"
            className={`flex items-center transition-all duration-500 overflow-hidden ${
              scrolled ? "w-0 opacity-0 px-0" : "w-auto opacity-100 px-4 py-2"
            }`}
          >
            <span className="text-sm tracking-tight whitespace-nowrap logo-glow">
              <span className="font-light text-text-secondary">Bro</span>
              <span className="font-semibold text-text-primary">Balance</span>
            </span>
          </a>

          {/* divider */}
          <div className={`w-px h-5 bg-white/[0.08] hidden md:block transition-all duration-500 ${scrolled ? "opacity-0 w-0" : "opacity-100"}`} />

          {/* nav links — hide on scroll */}
          <div className={`hidden md:flex items-center transition-all duration-500 overflow-hidden ${scrolled ? "max-w-0 opacity-0" : "max-w-[400px] opacity-100"}`}>
            {["Features", "How it Works", "About"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-3.5 py-2 rounded-full text-[13px] font-medium text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-all whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </div>

          {/* divider */}
          <div className={`w-px h-5 bg-white/[0.08] transition-all duration-500 ${scrolled ? "opacity-0 w-0" : "opacity-100"}`} />

          {/* sign in — hide on scroll */}
          <a
            href="/login"
            className={`rounded-full text-[13px] font-medium text-text-secondary hover:text-text-primary transition-all duration-500 whitespace-nowrap ${
              scrolled ? "w-0 overflow-hidden opacity-0 px-0" : "w-auto opacity-100 px-3.5 py-2"
            }`}
          >
            Sign in
          </a>

          {/* get started — always visible */}
          <a
            href="/signup"
            className="btn-get-started px-5 py-2 rounded-full text-[13px] font-semibold text-white transition-all whitespace-nowrap"
          >
            Get Started
          </a>
        </div>
      </nav>


      {/* ─── HERO ─── */}
      <section className="relative min-h-[100vh] flex items-center px-6 bg-glow noise-overlay overflow-hidden">
        <HeroMeshGrid />

        <div className="relative z-10 max-w-6xl mx-auto w-full pt-44 pb-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

            <div className="flex-1 text-center lg:text-left">
              <h1 className="animate-fade-up" style={{ fontSize: "clamp(2.8rem, 8vw, 5rem)", lineHeight: 1, letterSpacing: "-0.04em" }}>
                <span className="font-extralight text-text-primary">Split it. </span>
                <span className="font-black text-gradient-red">Track it.</span>
                <br />
                <span className="font-extralight text-text-primary">Forget </span>
                <span className="font-black text-text-primary">about it.</span>
              </h1>

              <p className="mt-7 text-base md:text-lg font-light text-text-secondary max-w-xl leading-relaxed animate-fade-up animate-fade-up-delay-1 lg:mx-0 mx-auto">
                Stop sending <span className="font-medium text-text-primary">&ldquo;bro you owe me&rdquo;</span> texts.
                BroBalance keeps track of every rupee between you and your
                friends — so the <span className="font-medium text-text-primary">friendships stay clean</span>.
              </p>

              <div className="flex items-center gap-4 mt-10 animate-fade-up animate-fade-up-delay-2 justify-center lg:justify-start">
                <a href="/signup" className="btn-primary typo-button px-8 py-3.5 text-sm">
                  Start for Free
                </a>
                <a href="#how-it-works" className="btn-outline typo-button px-8 py-3.5 text-sm">
                  See How
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mt-16 animate-fade-up animate-fade-up-delay-3 mx-auto lg:mx-0">
                <div className="glass-card rounded-2xl p-4 text-left hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-text-muted">You owe</span>
                    <div className="h-5 w-5 rounded-full bg-action-red/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-action-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0V11.25" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[11px] text-action-red/60 mb-0.5">
                    <span className="inline-block h-1 w-1 rounded-full bg-action-red mr-1 align-middle" />2 friends
                  </p>
                  <p className="tabular-nums text-text-primary font-bold text-xl">₹4,200</p>
                </div>
                <div className="glass-card rounded-2xl p-4 text-left hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-text-muted">You&rsquo;re owed</span>
                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[11px] text-success/60 mb-0.5">
                    <span className="inline-block h-1 w-1 rounded-full bg-success mr-1 align-middle" />3 friends
                  </p>
                  <p className="tabular-nums text-text-primary font-bold text-xl">₹7,850</p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center animate-fade-up animate-fade-up-delay-2 max-w-md lg:max-w-lg">
              <div className="relative">
                <img
                  src="/coin.png"
                  alt="Coins"
                  className="w-72 md:w-96 lg:w-[420px] coin-float drop-shadow-[0_20px_60px_rgba(240,101,91,0.15)]"
                  style={{ animationDuration: "5s" }}
                />
                <div className="absolute inset-0 -z-10 bg-action-red/[0.06] rounded-full blur-[80px] scale-110" />
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center lg:justify-start animate-fade-up animate-fade-up-delay-4">
            <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 rounded-full bg-white/20 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      <div className="h-24 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-card" />

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 md:py-32 px-6 bg-bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[11px] font-semibold tracking-[0.15em] uppercase text-action-red mb-6">
              Features
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              <span className="font-extralight text-text-primary">Everything you need,</span>
              <br />
              <span className="font-bold text-gradient-red">nothing you don&rsquo;t</span>
            </h2>
            <p className="mt-5 text-base font-light text-text-secondary max-w-md mx-auto">
              Built for the way friends actually handle money. Simple, fast, no nonsense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
            <div className="md:col-span-7 glass-card rounded-3xl p-8 md:p-10 group relative overflow-hidden min-h-[280px]">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-action-red/[0.06] rounded-full blur-[80px] group-hover:bg-action-red/[0.1] transition-all duration-700" />
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-action-red/10 border border-action-red/15 flex items-center justify-center text-action-red mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                <h3 className="mb-3" style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
                  <span className="font-light">Split </span><span className="font-bold">Expenses</span>
                </h3>
                <p className="text-sm font-light text-text-secondary leading-relaxed max-w-sm">
                  Lent ₹500 for dinner? Log it in two taps. Pick a friend, type the amount, and the math takes care of itself.
                </p>
                <div className="mt-8 inline-flex items-center gap-3 glass rounded-xl px-4 py-2.5">
                  <span className="text-action-red text-xl font-bold tabular-nums">₹500</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="text-sm text-text-muted font-light">dinner split</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 glass-card rounded-3xl p-8 md:p-10 group relative overflow-hidden min-h-[280px]">
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-success/[0.05] rounded-full blur-[60px] group-hover:bg-success/[0.08] transition-all duration-700" />
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-success/10 border border-success/15 flex items-center justify-center text-success mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h3 className="mb-3" style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
                  <span className="font-light">Live </span><span className="font-bold">Balances</span>
                </h3>
                <p className="text-sm font-light text-text-secondary leading-relaxed">
                  See exactly who owes whom — updated in real time. No spreadsheets, no guessing.
                </p>
                <div className="mt-8 flex items-end gap-2 h-16">
                  {[40, 65, 30, 80, 55, 45, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-all duration-500 group-hover:opacity-100"
                      style={{ height: `${h}%`, background: h > 60 ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.06)", opacity: 0.7 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {[
              { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>, title: "Friend Circle", desc: "Add your squad, manage connections, keep your circle tight." },
              { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>, title: "Gentle Nudges", desc: "Remind without the awkwardness. We make it polite." },
              { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>, title: "Secure", desc: "Google OAuth, JWT tokens. Your money info stays yours." },
              { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>, title: "Instant", desc: "Expense added? You'll know before they finish typing." },
            ].map((f) => (
              <div key={f.title} className="md:col-span-3 glass-card rounded-2xl p-6 group hover:border-white/[0.08] transition-all">
                <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-text-secondary mb-4 group-hover:text-action-red group-hover:border-action-red/20 group-hover:bg-action-red/[0.06] transition-all">
                  {f.icon}
                </div>
                <h3 className="text-sm mb-1.5"><span className="font-bold">{f.title}</span></h3>
                <p className="text-xs font-light text-text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-24 bg-gradient-to-b from-bg-card via-bg-primary to-bg-primary" />

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[11px] font-semibold tracking-[0.15em] uppercase text-action-red mb-6">
              How it Works
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              <span className="font-extralight text-text-primary">Three steps.</span>
              <br />
              <span className="font-bold text-gradient-red">Zero drama.</span>
            </h2>
          </div>

          <div className="flex md:hidden justify-end gap-2 mb-4 pr-1">
            <button onClick={() => scrollHIW("left")} className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-white/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scrollHIW("right")} className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-white/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div ref={howItWorksRef} className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 hiw-scroll">
            {steps.map((step) => (
              <div key={step.num} className="flex-shrink-0 w-[85vw] max-w-[360px] md:w-auto md:max-w-none snap-center hiw-card rounded-3xl p-6 md:p-7 flex flex-col group transition-all">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-full bg-action-red flex items-center justify-center flex-shrink-0 shadow-lg shadow-action-red/20">
                    <span className="text-white text-sm font-bold">{step.num}</span>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", letterSpacing: "-0.01em" }}>
                    <span className="font-bold text-text-primary">{step.title}</span>
                  </h3>
                </div>
                <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/[0.04] mb-5 min-h-[200px] relative overflow-hidden group-hover:border-action-red/10 transition-colors">
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-action-red/[0.06] rounded-full blur-[50px]" />
                  {step.illustration}
                </div>
                <p className="text-sm font-light text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-24 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-card" />

      {/* ─── QUOTE ─── */}
      <section className="py-24 md:py-32 px-6 bg-bg-card">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-[2rem] p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-action-red/[0.05] rounded-full blur-[80px]" />
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-action-red/25 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z" />
              </svg>
              <blockquote style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
                <span className="font-extralight text-text-primary">Money between friends </span>
                <span className="font-semibold text-text-primary">shouldn&rsquo;t be awkward.</span>
                <br />
                <span className="font-extralight text-text-secondary">We built this so it </span>
                <span className="font-semibold text-gradient-red">doesn&rsquo;t have to be.</span>
              </blockquote>
              <p className="text-xs font-medium tracking-[0.1em] uppercase text-text-muted mt-8">&mdash; the BroBalance team</p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-24 bg-gradient-to-b from-bg-card via-bg-primary to-bg-primary" />

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto md:flex md:items-start md:gap-20">
          <div className="md:flex-1 mb-10 md:mb-0">
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[11px] font-semibold tracking-[0.15em] uppercase text-action-red mb-6">
              The Idea
            </span>
            <h2 className="mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              <span className="font-extralight text-text-primary">Born from a</span>
              <br />
              <span className="font-bold text-gradient-red">real problem</span>
            </h2>
          </div>
          <div className="md:flex-1 space-y-5">
            <p className="text-base font-light text-text-secondary leading-relaxed">
              We were tired of the mental math. Who paid for last night? Did Rahul
              ever pay back for that trip? Was it ₹500 or ₹800? <span className="font-medium text-text-primary">Nobody remembers</span>,
              and nobody wants to be the person who brings it up.
            </p>
            <p className="text-base font-light text-text-secondary leading-relaxed">
              BroBalance keeps a clean, honest ledger between friends. No judgement,
              no awkward conversations. Just add what you spent, and the app handles the rest.
            </p>
            <p className="text-base font-light text-text-secondary leading-relaxed">
              It&rsquo;s not about the money — it&rsquo;s about keeping things <span className="font-medium text-text-primary">fair</span> so the friendship stays <span className="font-medium text-text-primary">solid</span>.
            </p>
          </div>
        </div>
      </section>

      <div className="h-24 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-card" />

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 md:py-32 px-6 bg-bg-card">
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            <span className="font-extralight text-text-primary">Ready to stop </span>
            <span className="font-black text-gradient-red">guessing?</span>
          </h2>
          <p className="text-base font-light text-text-secondary mt-6 max-w-md mx-auto leading-relaxed">
            Sign up in 30 seconds. Add your first friend. Log your first expense.
            That&rsquo;s it — <span className="font-medium text-text-primary">you&rsquo;re in</span>.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <a href="/signup" className="btn-primary typo-button px-8 py-3.5 text-sm">
              Create Account
            </a>
            <a href="/login" className="btn-outline typo-button px-8 py-3.5 text-sm">
              I Have an Account
            </a>
          </div>
        </div>
      </section>

      <div className="h-16 bg-gradient-to-b from-bg-card to-bg-card" />

      {/* ─── FOOTER ─── */}
      <footer className="bg-bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
          <div className="md:flex md:gap-16 lg:gap-24">

            {/* newsletter */}
            <div className="md:max-w-sm mb-12 md:mb-0">
              <p style={{ fontSize: "1.05rem", lineHeight: 1.5 }}>
                <span className="font-light text-text-secondary">Join our newsletter to </span>
                <span className="font-semibold text-text-primary">stay up to date</span>
                <span className="font-light text-text-secondary"> on the latest news and updates.</span>
              </p>

              <form onSubmit={handleNewsletter} className="flex items-center bg-bg-primary rounded-full border border-border overflow-hidden mt-6">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={nlEmail}
                  onChange={(e) => { setNlEmail(e.target.value); if (nlStatus !== "idle") setNlStatus("idle"); }}
                  className="flex-1 bg-transparent px-5 py-3 text-sm font-light text-text-primary placeholder-text-muted outline-none"
                />
                <button
                  type="submit"
                  disabled={nlStatus === "sending"}
                  className="bg-action-red hover:bg-action-red-hover text-white text-[13px] font-semibold px-5 py-2.5 rounded-full m-1 transition-colors disabled:opacity-50"
                >
                  {nlStatus === "sending" ? "..." : nlStatus === "done" ? "✓" : "Subscribe"}
                </button>
              </form>
              {nlStatus === "done" && (
                <p className="text-[11px] font-medium text-success mt-2">You&rsquo;re subscribed!</p>
              )}
              {nlStatus === "error" && (
                <p className="text-[11px] font-medium text-action-red mt-2">Something went wrong. Try again.</p>
              )}

              <p className="text-[11px] font-light text-text-muted mt-3 leading-relaxed">
                By subscribing, you agree to our <a href="/privacy" className="underline hover:text-text-primary">Privacy Policy</a> and consent to receive updates.
              </p>

              {/* socials — GitHub + Instagram only */}
              <div className="flex items-center gap-3 mt-8">
                <a href="#" className="h-9 w-9 rounded-full border border-white/[0.08] flex items-center justify-center text-text-muted hover:text-text-primary hover:border-white/20 transition-all" aria-label="GitHub">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                </a>
                <a href="#" className="h-9 w-9 rounded-full border border-white/[0.08] flex items-center justify-center text-text-muted hover:text-text-primary hover:border-white/20 transition-all" aria-label="Instagram">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
              </div>
            </div>

            {/* link columns — no Twitter, no FAQ, Contact opens modal */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {[
                { heading: "Sitemap", links: [{ label: "About Us", href: "#about" }, { label: "Features", href: "#features" }, { label: "How it Works", href: "#how-it-works" }] },
                { heading: "Product", links: [{ label: "Sign Up", href: "/signup" }, { label: "Sign In", href: "/login" }, { label: "Dashboard", href: "#" }] },
                { heading: "Connect", links: [{ label: "GitHub", href: "#" }, { label: "Instagram", href: "#" }, { label: "Contact", href: "__contact__" }] },
              ].map((col) => (
                <div key={col.heading}>
                  <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text-muted mb-5">{col.heading}</h4>
                  <ul className="space-y-3">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        {link.href === "__contact__" ? (
                          <button
                            onClick={() => setContactOpen(true)}
                            className="text-[13px] font-light text-text-secondary hover:text-text-primary transition-colors"
                          >
                            {link.label}
                          </button>
                        ) : (
                          <a href={link.href} className="text-[13px] font-light text-text-secondary hover:text-text-primary transition-colors">
                            {link.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* giant wordmark */}
        <div className="relative overflow-hidden px-6 pt-8 pb-4">
          <p className="text-center select-none leading-none" style={{ fontSize: "clamp(4rem, 20vw, 14rem)", letterSpacing: "-0.04em" }}>
            <span className="font-extralight text-action-red/40">Bro</span>
            <span className="font-black text-action-red">Balance</span>
          </p>
        </div>

        {/* copyright */}
        <div className="border-t border-white/[0.04] px-6 py-5">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] font-light text-text-muted">&copy; {new Date().getFullYear()} BroBalance. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <a href="/privacy" className="text-[11px] font-light text-text-muted hover:text-text-primary transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-[11px] font-light text-text-muted hover:text-text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
