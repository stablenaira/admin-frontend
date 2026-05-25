import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { Activity, Coins, Gavel, LayoutDashboard, Layers, LogOut, Settings, Shield, Store } from "lucide-react";

function NavItem({ to, label, icon: Icon, collapsed, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
          isActive ? "bg-[#00ff7a12] text-[#00ff7a]" : "text-white/65 hover:bg-white/6 hover:text-white"
        }`
      }
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/6">
        <Icon className="h-4 w-4" />
      </span>
      {collapsed ? null : <span className="truncate">{label}</span>}
    </NavLink>
  );
}

function initialsFrom(email, name) {
  const base = (name || "").trim() || (email || "").split("@")[0] || "U";
  const parts = base.split(/[.\s_-]+/).filter(Boolean);
  const a = (parts[0] || "U")[0] || "U";
  const b = (parts[1] || "")[0] || "";
  return (a + b).toUpperCase();
}

export function TreasurySidebar({ collapsed = false, onClose }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const email = user?.email || "";
  const name = user?.displayName || "";
  const isAdmin = Boolean(user?.isAdmin);

  return (
    <aside className="flex h-full w-full shrink-0 flex-col bg-black/60 p-4">
      <div className={`flex items-center gap-3 px-2 py-2 ${collapsed ? "justify-center" : ""}`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00ff7a] to-[#008f44] text-sm font-extrabold text-black shadow-[0_0_24px_rgba(0,255,122,0.18)]">
          ₦
        </div>
        {collapsed ? null : (
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-white">StableNaira</div>
            <div className="truncate text-xs font-semibold text-white/45">Treasury Console</div>
          </div>
        )}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg border border-white/10 bg-white/6 px-2.5 py-1.5 text-xs font-extrabold text-white/75 hover:bg-white/10 hover:text-white"
            aria-label="Close navigation"
          >
            ×
          </button>
        ) : null}
      </div>

      <nav className="mt-5 space-y-1">
        <NavItem to="/dashboard" label="Overview" icon={LayoutDashboard} collapsed={collapsed} onNavigate={onClose} />
        <NavItem to="/pools" label="Pools" icon={Layers} collapsed={collapsed} onNavigate={onClose} />
        <NavItem to="/reserves" label="Reserves" icon={Shield} collapsed={collapsed} onNavigate={onClose} />
        <NavItem to="/controls" label="Mint & Burn" icon={Coins} collapsed={collapsed} onNavigate={onClose} />
        <NavItem to="/governance" label="Governance" icon={Gavel} collapsed={collapsed} onNavigate={onClose} />
        <NavItem to="/activity" label="Activity" icon={Activity} collapsed={collapsed} onNavigate={onClose} />
        <NavItem to="/merchants" label="Merchants" icon={Store} collapsed={collapsed} onNavigate={onClose} />
        <NavItem to="/settings" label="Settings" icon={Settings} collapsed={collapsed} onNavigate={onClose} />
      </nav>

      <div className="mt-auto pt-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 text-xs font-extrabold text-white">
            {initialsFrom(email, name)}
          </div>
          {collapsed ? null : (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">{name || "User"}</div>
              <div className="truncate font-mono text-[11px] font-semibold text-white/35">{email}</div>
            </div>
          )}
        </div>

        <div className={`mt-3 flex items-center gap-2 ${collapsed ? "justify-center" : "justify-between"}`}>
          {collapsed ? null : (
            <span className={`text-xs font-bold ${isAdmin ? "text-[#00ff7a]" : "text-white/45"}`}>
              {isAdmin ? "Admin" : "Member"}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="rounded-lg border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-extrabold text-white/75 hover:bg-white/10 hover:text-white"
          >
            {collapsed ? <LogOut className="h-4 w-4" /> : <span className="inline-flex items-center gap-2"><LogOut className="h-4 w-4" /> Log out</span>}
          </button>
        </div>
      </div>
      </div>
    </aside>
  );
}
