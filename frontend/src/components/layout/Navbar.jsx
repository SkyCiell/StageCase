import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../services/api";
import SCLogo from "../SCLogo";

const NAV_LINKS = [
  { to: "/",           label: "Home",       exact: true },
  { to: "/concerts",   label: "Concerts"               },
  { to: "/my-tickets", label: "My Tickets", auth: true  },
  { to: "/favorites",  label: "Favorites",  auth: true  },
];

function UserAvatar({ user, size = 30 }) {
  const src = user?.avatar ? getImageUrl(user.avatar, "avatars") : null;
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  return (
    <span
      className="inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 bg-[#2A629C]"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={user?.name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-mono font-black text-[#F5F3F5]" style={{ fontSize: size * 0.38 }}>
          {initials}
        </span>
      )}
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const menuRef   = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <>
      {/* ════════════════════════════════════════
          PILL NAVBAR — floating, fully rounded
      ════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <div
          className={`w-full max-w-4xl flex items-center justify-between px-3 py-2 transition-all duration-300 ${
            scrolled ? "shadow-2xl" : "shadow-lg"
          }`}
          style={{
            background: "#343C4E",
            borderRadius: 9999,
            border: "1px solid rgba(245,243,245,0.12)",
          }}
        >
          {/* ── Logo pill on left ── */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <SCLogo size={36} />
            <span className="hidden sm:block font-display font-black text-[#F5F3F5] text-sm uppercase tracking-widest group-hover:text-[#8DA7CC] transition-colors">
              StageCase
            </span>
          </Link>

          {/* ── Center nav links — desktop only ── */}
          <nav className="hidden md:flex items-center gap-1">
            {filteredLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  `px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-widest transition-colors rounded-full ${
                    isActive
                      ? "bg-[#2A629C] text-[#F5F3F5]"
                      : "text-[#D3CCD0]/70 hover:text-[#F5F3F5] hover:bg-[#F5F3F5]/5"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-widest transition-colors rounded-full ${
                    isActive ? "bg-[#8DA7CC] text-[#343C4E]" : "text-[#8DA7CC] hover:bg-[#8DA7CC]/10"
                  }`
                }
              >
                Admin ↗
              </NavLink>
            )}
          </nav>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              /* User pill button */
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 transition-colors hover:bg-[#F5F3F5]/8"
                  style={{ borderRadius: 9999, border: "1px solid rgba(245,243,245,0.15)" }}
                >
                  <UserAvatar user={user} size={26} />
                  <span className="hidden sm:block text-[11px] font-mono font-bold text-[#F5F3F5] tracking-wide">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <svg
                    className={`w-3 h-3 text-[#D3CCD0]/50 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-52 bg-[#343C4E] shadow-2xl z-50 overflow-hidden"
                      style={{ borderRadius: 16, border: "1px solid rgba(245,243,245,0.12)" }}
                    >
                      {/* User info */}
                      <div className="px-4 py-3.5 border-b border-[#F5F3F5]/8 flex items-center gap-3">
                        <UserAvatar user={user} size={32} />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-[#F5F3F5] font-mono truncate">{user?.name}</p>
                          <p className="text-[9px] text-[#D3CCD0]/50 font-mono truncate">{user?.email}</p>
                        </div>
                      </div>

                      <div className="py-1.5 px-1.5">
                        {[
                          { to: "/profile",       icon: "◎", label: "Profile" },
                          { to: "/my-tickets",    icon: "◈", label: "My Tickets" },
                          { to: "/notifications", icon: "◉", label: "Notifications" },
                          { to: "/favorites",     icon: "◇", label: "Favorites" },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-3 px-3 py-2.5 text-[11px] text-[#D3CCD0] hover:text-[#F5F3F5] hover:bg-[#2A629C]/25 font-mono transition-colors"
                            style={{ borderRadius: 10 }}
                          >
                            <span className="text-[#8DA7CC]">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="px-3 pb-3 border-t border-[#F5F3F5]/8 pt-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-[11px] text-[#D3CCD0]/50 hover:text-[#F5F3F5] font-mono uppercase tracking-widest transition-colors flex items-center gap-2"
                          style={{ borderRadius: 10 }}
                        >
                          <span>→</span> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Auth pills */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#D3CCD0]/70 hover:text-[#F5F3F5] transition-colors px-3 py-1.5 hidden sm:block"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#F5F3F5] bg-[#2A629C] hover:bg-[#1E4F82] px-4 py-1.5 transition-colors"
                  style={{ borderRadius: 9999 }}
                >
                  Get Tickets
                </Link>
              </div>
            )}

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setMobileMenuOpen((p) => !p)}
              className="md:hidden flex items-center justify-center w-8 h-8 ml-1"
              style={{ borderRadius: 9999 }}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 w-5">
                <span className={`block h-px bg-[#F5F3F5] transition-all duration-300 origin-center ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                <span className={`block h-px bg-[#F5F3F5] transition-all duration-200 ${mobileMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block h-px bg-[#F5F3F5] transition-all duration-300 origin-center ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown — appears below pill, also rounded ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full mt-2 w-full max-w-4xl left-1/2 -translate-x-1/2 px-4 md:hidden"
              style={{ zIndex: 40 }}
            >
              <div
                className="bg-[#343C4E] shadow-2xl py-4"
                style={{ borderRadius: 20, border: "1px solid rgba(245,243,245,0.12)" }}
              >
                {/* User info if logged in */}
                {isAuthenticated && (
                  <div className="flex items-center gap-3 px-5 pb-4 mb-1 border-b border-[#F5F3F5]/8">
                    <UserAvatar user={user} size={38} />
                    <div>
                      <p className="text-sm font-bold text-[#F5F3F5] font-mono">{user?.name}</p>
                      <p className="text-[10px] text-[#D3CCD0]/50 font-mono">{user?.email}</p>
                    </div>
                  </div>
                )}

                {/* Nav links — centered */}
                <nav className="flex flex-col items-center gap-0.5 px-3 py-2">
                  {filteredLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.exact}
                      className={({ isActive }) =>
                        `w-full text-center py-3 text-sm font-mono font-bold uppercase tracking-widest transition-colors ${
                          isActive
                            ? "text-[#F5F3F5] bg-[#2A629C]"
                            : "text-[#D3CCD0]/60 hover:text-[#F5F3F5] hover:bg-[#F5F3F5]/5"
                        }`
                      }
                      style={{ borderRadius: 12 }}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      className="w-full text-center py-3 text-sm font-mono font-bold uppercase tracking-widest text-[#8DA7CC] hover:text-[#F5F3F5] hover:bg-[#F5F3F5]/5 transition-colors"
                      style={{ borderRadius: 12 }}
                    >
                      Admin ↗
                    </NavLink>
                  )}

                  {isAuthenticated && (
                    <>
                      <div className="w-full h-px bg-[#F5F3F5]/8 my-1" />
                      <Link to="/profile"       className="w-full text-center py-2.5 text-sm font-mono text-[#D3CCD0]/60 hover:text-[#F5F3F5] hover:bg-[#F5F3F5]/5 transition-colors" style={{ borderRadius: 12 }}>Profile</Link>
                      <Link to="/notifications" className="w-full text-center py-2.5 text-sm font-mono text-[#D3CCD0]/60 hover:text-[#F5F3F5] hover:bg-[#F5F3F5]/5 transition-colors" style={{ borderRadius: 12 }}>Notifications</Link>
                    </>
                  )}
                </nav>

                {/* Bottom auth */}
                <div className="px-5 pt-3 border-t border-[#F5F3F5]/8 mt-1">
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="w-full text-center text-[11px] text-[#D3CCD0]/40 hover:text-[#F5F3F5] font-mono uppercase tracking-widest transition-colors py-2"
                    >
                      → Sign Out
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <Link to="/login"    className="flex-1 text-center text-sm font-mono font-bold uppercase text-[#D3CCD0]/70 hover:text-[#F5F3F5] py-2.5 border border-[#F5F3F5]/15 hover:border-[#F5F3F5]/30 transition-colors" style={{ borderRadius: 9999 }}>Sign In</Link>
                      <Link to="/register" className="flex-1 text-center text-sm font-mono font-bold uppercase text-[#F5F3F5] bg-[#2A629C] hover:bg-[#1E4F82] py-2.5 transition-colors"                                                             style={{ borderRadius: 9999 }}>Get Tickets</Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
