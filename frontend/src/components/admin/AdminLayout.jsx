import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Ticket, 
  Music, 
  MapPin, 
  Users, 
  BarChart3, 
  LogOut, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  QrCode
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../services/api";
import SCLogo from "../SCLogo";
import QRScannerModal from "./QRScannerModal";

const ADMIN_NAV = [
  { to: "/admin",           label: "Overview",      icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings",  label: "Orders",        icon: Ticket              },
  { to: "/admin/concerts",  label: "Concerts",      icon: Music               },
  { to: "/admin/venues",    label: "Venues",        icon: MapPin              },
  { to: "/admin/users",     label: "Users",         icon: Users               },
  { to: "/admin/analytics", label: "Analytics",     icon: BarChart3           },
];

function AdminAvatar({ user, size = 32 }) {
  const src = user?.avatar ? getImageUrl(user.avatar, "avatars") : null;
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "A";
  return (
    <span
      className="inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 bg-primary border border-border"
      style={{ width: size, height: size }}
    >
      {src
        ? <img src={src} alt={user?.name} className="w-full h-full object-cover" />
        : <span className="font-sans font-bold text-text-primary text-xs">{initials}</span>
      }
    </span>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen flex bg-background text-text-primary">

      {/* ════ SIDEBAR ════ */}
      <aside
        className="shrink-0 flex flex-col relative transition-all duration-250 bg-bg-secondary border-r border-border"
        style={{
          width: collapsed ? 72 : 240,
        }}
      >
        {/* Logo Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border h-[72px]">
          <SCLogo size={32} />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-text-primary text-sm tracking-wide truncate">StageCase</p>
              <p className="text-[10px] font-mono text-accent uppercase tracking-widest truncate">Admin Portal</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(p => !p)}
            className="p-1 rounded-md text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted px-3 py-2">
              Management Menu
            </p>
          )}
          {ADMIN_NAV.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                title={collapsed ? link.label : undefined}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-primary text-text-primary shadow-sm font-semibold" 
                      : "text-text-secondary hover:text-text-primary hover:bg-surface"
                  } ${collapsed ? "justify-center" : ""}`
                }
              >
                <Icon className="w-4 h-4 shrink-0 stroke-[1.75]" />
                {!collapsed && <span>{link.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-border space-y-2">
          {!collapsed ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-surface border border-border">
              <AdminAvatar user={user} size={32} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-text-primary truncate">{user?.name}</p>
                <p className="text-[10px] text-accent flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Administrator
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <AdminAvatar user={user} size={32} />
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium text-danger hover:bg-danger/10 transition-colors w-full cursor-pointer ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0 stroke-[1.75]" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ════ MAIN WORKSPACE ════ */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
        {/* Topbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-8 h-[72px] bg-bg-secondary border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-mono text-muted uppercase tracking-wider">System Live</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-text-primary bg-surface hover:bg-surface/80 border border-border transition-colors py-1.5 px-3 rounded-md cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-accent" />
              <span>Verify Ticket Pass</span>
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-accent transition-colors btn-ghost py-1.5 px-3"
            >
              <span>View Main Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>

      {/* Admin QR Gate Pass Authenticator Modal */}
      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
}
