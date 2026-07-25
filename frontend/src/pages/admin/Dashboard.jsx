import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminService } from "../../services";
import { formatCurrency, getStatusColor, getStatusLabel } from "../../utils";
import Badge from "../../components/ui/Badge";

/* ── Stat block — pure typography, no box ── */
function Stat({ label, value, accent = false }) {
  return (
    <div className="py-6 px-1 flex flex-col gap-1.5" style={{ borderBottom: "1px solid var(--admin-border)" }}>
      <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: "rgba(141,167,204,0.55)" }}>{label}</p>
      <p
        className="font-display font-black leading-none tracking-tight"
        style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: accent ? "#8DA7CC" : "#F5F3F5" }}
      >
        {value}
      </p>
    </div>
  );
}

/* ── Minimal section header ── */
function SectionHead({ title, action }) {
  return (
    <div className="flex items-baseline justify-between pb-3 mb-4" style={{ borderBottom: "1px solid var(--admin-border)" }}>
      <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(141,167,204,0.7)" }}>{title}</h2>
      {action}
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminService.dashboard(),
    select: (d) => d.data.data,
  });

  const stats          = data?.stats || {};
  const recentBookings = data?.recentBookings || [];

  const STATS = [
    { label: "Total Revenue",     value: formatCurrency(stats.totalRevenue), accent: true  },
    { label: "Confirmed Orders",  value: stats.totalBookings  ?? "—"                       },
    { label: "Active Concerts",   value: stats.totalConcerts  ?? "—"                       },
    { label: "Registered Fans",   value: stats.totalUsers     ?? "—"                       },
  ];

  return (
    <div className="space-y-10 max-w-5xl">

      {/* ── Page header ── */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2" style={{ color: "rgba(141,167,204,0.4)" }}>
          Control Panel
        </p>
        <h1 className="font-display font-black text-[#F5F3F5] uppercase tracking-tight" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", lineHeight: 1 }}>
          Overview
        </h1>
        <p className="text-[11px] font-mono mt-2" style={{ color: "rgba(141,167,204,0.45)" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* ── Stats row — horizontal dividers only, no cards ── */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y" style={{ borderColor: "var(--admin-border)" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse mx-1" style={{ background: "var(--admin-card)", borderRadius: 4 }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8">
          {STATS.map((s) => <Stat key={s.label} {...s} />)}
        </div>
      )}

      {/* ── Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Recent orders — 8 cols */}
        <div className="lg:col-span-8">
          <SectionHead
            title="Recent Orders"
            action={
              <Link to="/admin/bookings" className="text-[10px] font-mono uppercase tracking-widest transition-colors"
                style={{ color: "var(--admin-muted)" }}
                onMouseEnter={e => e.target.style.color = "#F5F3F5"}
                onMouseLeave={e => e.target.style.color = "var(--admin-muted)"}
              >
                View All →
              </Link>
            }
          />

          {recentBookings.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr>
                  {["Ref", "Customer", "Concert", "Amount", "Status"].map(h => (
                    <th key={h} className="pb-3 text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: "rgba(141,167,204,0.35)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b, i) => (
                  <tr
                    key={b.id}
                    className="transition-colors"
                    style={{
                      borderTop: "1px solid var(--admin-border)",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(42,98,156,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td className="py-3 pr-4 font-mono text-xs font-bold" style={{ color: "#8DA7CC" }}>{b.booking_code}</td>
                    <td className="py-3 pr-4 text-xs text-[#F5F3F5] font-medium">{b.user?.name || "—"}</td>
                    <td className="py-3 pr-4 text-xs max-w-[140px] truncate" style={{ color: "rgba(245,243,245,0.5)" }}>{b.concert?.title}</td>
                    <td className="py-3 pr-4 text-xs font-bold font-mono text-[#F5F3F5]">{formatCurrency(b.total_price)}</td>
                    <td className="py-3"><Badge variant={getStatusColor(b.status)}>{getStatusLabel(b.status)}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="py-12 text-center text-xs font-mono" style={{ color: "rgba(141,167,204,0.3)" }}>No recent orders.</p>
          )}
        </div>

        {/* Quick actions — 4 cols */}
        <div className="lg:col-span-4 space-y-8">

          <div>
            <SectionHead title="Quick Actions" />
            <ul className="space-y-0">
              {[
                { label: "Add Concert",      sub: "Create show listing",      to: "/admin/concerts"  },
                { label: "Review Bookings",  sub: "Approve payment proofs",   to: "/admin/bookings"  },
                { label: "Register Venue",   sub: "Add concert hall",         to: "/admin/venues"    },
                { label: "Sales Analytics",  sub: "View revenue trends",      to: "/admin/analytics" },
              ].map((a) => (
                <li key={a.to} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <Link
                    to={a.to}
                    className="flex items-center justify-between py-3.5 transition-all group"
                    onMouseEnter={e => { e.currentTarget.style.paddingLeft = "4px"; }}
                    onMouseLeave={e => { e.currentTarget.style.paddingLeft = "0"; }}
                  >
                    <div>
                      <p className="text-xs font-bold text-[#F5F3F5] font-mono transition-colors group-hover:text-[#8DA7CC]">{a.label}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(141,167,204,0.4)" }}>{a.sub}</p>
                    </div>
                    <span className="text-xs transition-transform group-hover:translate-x-1 duration-200" style={{ color: "rgba(141,167,204,0.4)" }}>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHead title="System Status" />
            <ul className="space-y-3">
              {[
                { name: "API Services",   ok: true  },
                { name: "Payment Queue",  ok: true  },
                { name: "QR Engine",      ok: true  },
              ].map((sys) => (
                <li key={sys.name} className="flex items-center justify-between">
                  <span className="text-xs font-mono" style={{ color: "rgba(141,167,204,0.55)" }}>{sys.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sys.ok ? "#4CAF7A" : "#D65A5A" }} />
                    <span className="text-[10px] font-mono font-bold" style={{ color: sys.ok ? "#4CAF7A" : "#D65A5A" }}>
                      {sys.ok ? "OK" : "ERR"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
