import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ticket, 
  User, 
  Heart, 
  Bell, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  Music,
  Compass,
  ChevronDown
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../services/api";
import SCLogo from "../SCLogo";

const NAV_LINKS = [
  { to: "/",           label: "Home",       icon: Compass, exact: true },
  { to: "/concerts",   label: "Concerts",   icon: Music               },
  { to: "/my-tickets", label: "My Tickets", icon: Ticket,  auth: true  },
  { to: "/favorites",  label: "Favorites",  icon: Heart,   auth: true  },
];

function UserAvatar({ user, size = 32 }) {
  const src = user?.avatar ? getImageUrl(user.avatar, "avatars") : null;
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  return (
    <span
      className="inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 bg-primary border border-border"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={user?.name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-sans font-bold text-text-primary text-xs">
          {initials}
        </span>
      )}
    </span>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const menuRef   = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  const handleLogout = () => { logout(); navigate("/"); };
  const filteredLinks = NAV_LINKS.filter((l) => !l.auth || isAuthenticated);

  return (
    <header className="sticky top-0 z-50 bg-bg-secondary border-b border-border h-[72px] flex items-center">
      <div className="container-premium w-full flex items-center justify-between">
        
        {/* ── Brand Logo ── */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <SCLogo size={34} />
          <div className="flex flex-col">
            <span className="font-display font-bold text-text-primary text-base tracking-wide group-hover:text-accent transition-colors">
              StageCase
            </span>
            <span className="text-[10px] text-muted font-mono uppercase tracking-wider hidden sm:block">
              Live Concert Platform
            </span>
          </div>
        </Link>

        {/* ── Desktop Center Navigation ── */}
        <nav className="hidden md:flex items-center gap-2">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-text-primary shadow-sm font-semibold"
                      : "text-text-secondary hover:text-accent hover:bg-surface"
                  }`
                }
              >
                <Icon className="w-4 h-4 stroke-[1.75]" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                  isActive 
                    ? "bg-primary text-text-primary shadow-sm" 
                    : "text-accent hover:bg-surface border border-accent/30"
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 stroke-[1.75]" />
              <span>Admin</span>
            </NavLink>
          )}
        </nav>

        {/* ── Desktop Right Side Auth & Profile ── */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen((p) => !p)}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-card border border-border rounded-full hover:border-accent transition-all duration-200 cursor-pointer"
              >
                <UserAvatar user={user} size={28} />
                <span className="hidden sm:block text-xs font-medium text-text-primary max-w-[120px] truncate">
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-modal shadow-dropdown overflow-hidden z-50 p-2"
                  >
                    {/* User info banner */}
                    <div className="px-3 py-3 border-b border-border mb-1 flex items-center gap-3">
                      <UserAvatar user={user} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-text-primary truncate">{user?.name}</p>
                        <p className="text-[11px] text-muted truncate">{user?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      {[
                        { to: "/profile",       icon: User,   label: "My Profile" },
                        { to: "/my-tickets",    icon: Ticket, label: "My Digital Tickets" },
                        { to: "/notifications", icon: Bell,   label: "Notifications" },
                        { to: "/favorites",     icon: Heart,  label: "Saved Concerts" },
                      ].map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface rounded-md transition-colors"
                          >
                            <ItemIcon className="w-4 h-4 text-muted stroke-[1.75]" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-1 pt-1 border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-danger hover:bg-danger/10 rounded-md transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 stroke-[1.75]" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn-ghost text-xs py-2 px-4"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary text-xs py-2 px-4"
              >
                Get Tickets
              </Link>
            </div>
          )}

          {/* ── Mobile Hamburger Toggle ── */}
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md bg-surface border border-border text-text-primary cursor-pointer hover:border-accent transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Dropdown ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-bg-secondary border-b border-border shadow-dropdown md:hidden z-40 p-4"
          >
            {isAuthenticated && (
              <div className="flex items-center gap-3 pb-3 mb-3 border-b border-border">
                <UserAvatar user={user} size={36} />
                <div>
                  <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                  <p className="text-xs text-muted">{user?.email}</p>
                </div>
              </div>
            )}

            <nav className="space-y-1">
              {filteredLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? "bg-primary text-text-primary font-semibold"
                          : "text-text-secondary hover:bg-surface hover:text-text-primary"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md text-accent hover:bg-surface transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 stroke-[1.75]" />
                  <span>Admin Dashboard</span>
                </NavLink>
              )}
            </nav>

            <div className="pt-3 mt-3 border-t border-border">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 btn-ghost text-xs text-danger py-2.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" className="btn-secondary text-xs text-center py-2.5">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-xs text-center py-2.5">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
