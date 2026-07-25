import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import SCLogo from '../SCLogo';

/* ── SVG Icons — custom minimal line icons ── */
const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h8v8H3zM13 3h8v5h-8zM13 11h8v10h-8zM3 14h8v7H3z" />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 14l2 2 4-4M7 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9l-6-6H7z" />
    </svg>
  ),
  concerts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM21 16c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
    </svg>
  ),
  venues: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m4-10h2m4 0h2M9 7h2m4 0h2" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  exit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

const ADMIN_NAV = [
  { to: '/admin',            label: 'Overview',        icon: 'dashboard',  exact: true },
  { to: '/admin/bookings',   label: 'Manage Orders',   icon: 'orders'               },
  { to: '/admin/concerts',   label: 'Concerts',        icon: 'concerts'             },
  { to: '/admin/venues',     label: 'Venues',          icon: 'venues'               },
  { to: '/admin/users',      label: 'Users',           icon: 'users'                },
  { to: '/admin/analytics',  label: 'Analytics',       icon: 'analytics'            },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-background flex">

      {/* ══════════════════════════════
          SIDEBAR
      ══════════════════════════════ */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-surface border-r border-white/[0.06] relative">
        {/* Left bronze accent stripe */}
        <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-bronze/50 to-transparent" />

        {/* Logo */}
        <div className="px-6 pt-8 pb-6 border-b border-white/[0.06]">
          <Link to="/" className="flex items-center gap-3 group">
            <SCLogo size={24} />
            <div>
              <span className="font-display font-black text-ivory tracking-[0.15em] text-xs uppercase
                               group-hover:text-bronze transition-colors duration-300">
                StageCase
              </span>
              <p className="text-[9px] text-amber uppercase tracking-[0.25em] font-bold mt-0.5">
                Admin Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Nav section label */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-[9px] text-text-muted uppercase tracking-[0.3em] font-bold">Navigation</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 pb-4">
          {ADMIN_NAV.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="flex-shrink-0 text-current opacity-70">
                {icons[link.icon]}
              </span>
              <span className="text-[13px] tracking-wide">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom — user info + exit */}
        <div className="px-3 pb-6 border-t border-white/[0.06] pt-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-ivory leading-tight truncate">{user?.name}</p>
              <p className="text-[10px] text-text-muted leading-tight tracking-wider">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="admin-nav-link w-full text-bronze/60 hover:text-bronze"
          >
            <span className="opacity-70">{icons.exit}</span>
            <span className="text-[13px] tracking-wide">Exit to Site</span>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════
          MAIN CONTENT
      ══════════════════════════════ */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
          <div className="h-[1px] absolute bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-bronze/20 to-transparent" />
          <div />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-bronze rounded-full animate-pulse-soft" />
              <span className="text-[10px] text-text-muted tracking-widest uppercase">Live</span>
            </div>
            <Link
              to="/"
              className="text-[11px] text-text-muted hover:text-ivory tracking-wider uppercase
                         flex items-center gap-1.5 transition-colors"
            >
              View Site
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
