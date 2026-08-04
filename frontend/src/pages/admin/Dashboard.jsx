import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { DollarSign, Ticket, Music, Users, ArrowUpRight } from "lucide-react";
import { adminService } from "../../services";
import { formatCurrency, getStatusLabel } from "../../utils";

function StatCard({ label, value, icon: Icon, accent = false }) {
  return (
    <div className="bg-card border border-border rounded-card p-6 shadow-card flex items-center justify-between">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1.5">{label}</p>
        <p className={`font-display font-bold text-2xl sm:text-3xl ${accent ? "text-accent" : "text-text-primary"}`}>
          {value}
        </p>
      </div>
      <div className={`w-12 h-12 rounded-md flex items-center justify-center ${accent ? "bg-primary/20 text-accent border border-primary/30" : "bg-surface text-muted border border-border"}`}>
        <Icon className="w-5 h-5 stroke-[1.75]" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminService.dashboard(),
    select: (d) => d.data.data,
    refetchInterval: 3000,
  });

  const stats          = data?.stats || {};
  const recentBookings = data?.recentBookings || [];

  const STATS = [
    { label: "Total Revenue",     value: formatCurrency(stats.totalRevenue), icon: DollarSign, accent: true },
    { label: "Confirmed Orders",  value: stats.totalBookings  ?? "—", icon: Ticket },
    { label: "Active Concerts",   value: stats.totalConcerts  ?? "—", icon: Music },
    { label: "Registered Fans",   value: stats.totalUsers     ?? "—", icon: Users },
  ];

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Page Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">Admin Dashboard</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
          Overview
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-card rounded-card border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-card border border-border rounded-card p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="font-display font-bold text-lg text-text-primary">Recent Orders</h2>
            <p className="text-xs text-muted">Latest ticket bookings and transaction statuses</p>
          </div>
          <Link
            to="/admin/bookings"
            className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-accent transition-colors"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted font-mono uppercase">
                  <th className="pb-3 pt-2 font-semibold">Ref Code</th>
                  <th className="pb-3 pt-2 font-semibold">Customer</th>
                  <th className="pb-3 pt-2 font-semibold">Concert</th>
                  <th className="pb-3 pt-2 font-semibold">Total</th>
                  <th className="pb-3 pt-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentBookings.map((b) => {
                  const isRejected = b.status === "rejected" || b.status === "cancelled" || b.payment?.status === "rejected";
                  const isConfirmed = b.status === "confirmed" || b.payment?.status === "approved";

                  return (
                    <tr key={b.id} className="hover:bg-surface/50 transition-colors">
                      <td className="py-3 font-mono font-bold text-accent">#{b.booking_code}</td>
                      <td className="py-3 font-semibold text-text-primary">{b.user?.name || "—"}</td>
                      <td className="py-3 text-text-secondary truncate max-w-[200px]">{b.concert?.title || "—"}</td>
                      <td className="py-3 font-mono font-semibold text-text-primary">{formatCurrency(b.total_price)}</td>
                      <td className="py-3 text-right">
                        <span className={
                          isRejected
                            ? "bg-danger text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm"
                            : isConfirmed
                            ? "badge-jade"
                            : "badge-gold"
                        }>
                          {isRejected ? "REJECTED" : isConfirmed ? "CONFIRMED" : getStatusLabel(b.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-muted py-8 text-center">No recent orders found.</p>
        )}
      </div>

    </div>
  );
}
