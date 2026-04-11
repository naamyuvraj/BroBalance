import { useState } from "react";
import { NavLink, Outlet } from "react-router";

const navItems = [
  { to: "/dashboard/profile", label: "Profile" },
  { to: "/dashboard/transactions", label: "Transactions" },
  { to: "/dashboard/friends", label: "Friends" },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex md:w-60 flex-col bg-neutral-900 border-r border-neutral-800">
        <div className="p-6 text-xl font-bold tracking-wide">BroBalance</div>
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar - mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-neutral-900 border-r border-neutral-800 transform transition-transform md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <span className="text-xl font-bold tracking-wide">BroBalance</span>
          <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 p-4 md:hidden bg-neutral-900 border-b border-neutral-800">
          <button onClick={() => setOpen(true)} className="text-neutral-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-lg font-bold">BroBalance</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
