import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
import FAB from "src/components/ui/FAB";
import AddTransactionModal from "src/components/ui/AddTransactionModal";

const navItems = [
  {
    to:'/dashboard/dashboard',
    label: "Dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
      </svg>
    ),
  },
  {
    to: "/dashboard/profile",
    label: "Profile",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    to: "/dashboard/transactions",
    label: "Transactions",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    to: "/dashboard/friends",
    label: "Friends",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
];

export default function DashboardLayout() {
  const [showAddTx, setShowAddTx] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard" || location.pathname === "/dashboard/dashboard";

  // if navigated here with openAddTx state, open the modal
  useEffect(() => {
    if ((location.state as any)?.openAddTx) {
      setShowAddTx(true);
      // Clear the state so it doesn't re-trigger on back/forward
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const sidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-8">
        <span className="text-xl font-extralight tracking-tight text-text-primary">
          Bro<span className="font-semibold text-gradient-red">Balance</span>
        </span>
      </div>

      {/* Nav label */}
      <div className="px-5 mb-2">
        <span className="typo-label">Menu</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 typo-button transition-all duration-200 ${
                isActive
                  ? "bg-action-red/10 text-action-red"
                  : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-colors ${isActive ? "text-action-red" : "text-text-muted group-hover:text-text-secondary"}`}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-action-red" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-4 pb-5 pt-4 border-t border-white/[0.04]">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 typo-body hover:text-action-red hover:bg-action-red/5 transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-bg-primary bg-glow text-text-primary font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col glass-strong border-r border-white/[0.06]">
        {sidebarContent()}
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 pt-6 pb-24 md:p-8 md:pb-8">
          <Outlet />
        </main>

        {/* mobile bottom nav */}
        <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-2 glass-strong rounded-full px-3 py-2" style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 2px rgba(0,0,0,0.25) inset, 0 8px 32px rgba(0,0,0,0.5)' }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-center h-10 w-10 rounded-full transition-all duration-200 ${
                    isActive
                      ? "btn-primary"
                      : "text-text-muted hover:text-text-primary"
                  }`
                }
              >
                {item.icon}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* fab button (hidden on dashboard) */}
      {!isDashboard && <FAB onClick={() => setShowAddTx(true)} />}
      <AddTransactionModal
        open={showAddTx}
        onClose={() => setShowAddTx(false)}
        onCreated={() => {
          // Refresh the current page by navigating to the same route
          navigate(".", { replace: true });
        }}
      />
    </div>
  );
}
