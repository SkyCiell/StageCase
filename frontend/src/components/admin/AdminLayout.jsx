import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../services/api";
import SCLogo from "../SCLogo";

const ADMIN_NAV = [
  { to: "/admin",           label: "Overview",      icon: "⬡", exact: true },
  { to: "/admin/bookings",  label: "Orders",        icon: "◈"              },
  { to: "/admin/concerts",  label: "Concerts",      icon: "◉"              },
  { to: "/admin/venues",    label: "Venues",        icon: "◫"              },
  { to: "/admin/users",     label: "Users",         icon: "◎"              },
  { to: "/admin/analytics", label: "Analytics",     icon: "◇"              },
];

function AdminAvatar({ user, size = 32 }) {
  const src = user?.avatar ? getImageUrl(user.avatar, "avatars") : null;
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "A";
  return (
    <span
      className="inline-flex items-center justify-center rounded-full overflow-hidden shrink-0"
      style={{ width: size, height: size, background: "#2A629C" }}
    >
      {src
        ? <img src={src} alt={user?.name} className="w-full h-full object-cover" />
        : <span className="font-mono font-black text-[#F5F3F5]" style={{ fontSize: size * 0.36 }}>{initials}</span>
      }
    </span>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--admin-bg)", color: "#F5F3F5" }}>

      {/* ════ SIDEBAR ════ */}
      <aside
        className="flex-shrink-0 flex flex-col relative transition-all duration-300"
        style={{
          width: collapsed ? 64 : 220,
          background: "var(--admin-sidebar)",
          borderRight: "1px solid var(--admin-border)",
        }}
      >
        {/* Accent stripe */}
        <div className="absolute top-0 right-0 bottom-0 w-px" style={{ background: "var(--admin-border)" }} />

        {/* Logo area */}
        <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: "1px solid var(--admin-border)" }}>
          <SCLogo size={28} />
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display font-black text-[#F5F3F5] text-xs uppercase tracking-widest truncate">StageCase</p>
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] mt-px" style={{ color: "var(--admin-muted)" }}>Admin</p>
            </div>
          )}
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(p => !p)}
            className="ml-auto shrink-0 text-xs transition-colors"
            style={{ color: "rgba(141,167,204,0.4)" }}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "▶" : "◀"}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto mt-2">
          {!collapsed && (
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] px-3 pb-2 pt-1" style={{ color: "rgba(141,167,204,0.35)" }}>Menu</p>
          )}
          {ADMIN_NAV.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              title={collapsed ? link.label : undefined}
              className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""} ${collapsed ? "justify-center px-0" : ""}`}
            >
              <span className="text-sm shrink-0" style={{ color: "var(--admin-muted)" }}>{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User bottom */}
        <div className="p-3 space-y-2" style={{ borderTop: "1px solid var(--admin-border)" }}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <AdminAvatar user={user} size={28} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-[#F5F3F5] font-mono truncate">{user?.name}</p>
                <p className="text-[9px] truncate" style={{ color: "rgba(141,167,204,0.5)" }}>Administrator</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center py-1">
              <AdminAvatar user={user} size={28} />
            </div>
          )}
          <button
            onClick={handleLogout}
            className="admin-nav-link w-full text-left"
            style={{ color: "rgba(141,167,204,0.4)" }}
          >
            <span className="text-sm shrink-0">→</span>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Slim topbar */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-8 py-3"
          style={{ background: "var(--admin-bg)", borderBottom: "1px solid var(--admin-border)" }}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#4CAF7A" }} />
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "rgba(141,167,204,0.5)" }}>Live</span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="text-[11px] font-mono uppercase tracking-widest transition-colors"
              style={{ color: "rgba(141,167,204,0.5)" }}
              onMouseEnter={e => e.target.style.color = "#F5F3F5"}
              onMouseLeave={e => e.target.style.color = "rgba(141,167,204,0.5)"}
            >
              View Site ↗
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
