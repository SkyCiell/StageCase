import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminService } from '../../services';
import Badge from '../../components/ui/Badge';
import { formatCurrency, getStatusColor, getStatusLabel } from '../../utils';

function StatCard({ label, value, sub, isPrimary = false }) {
  return (
    <div className={`stats-card flex flex-col justify-between ${isPrimary ? 'border-jade/60 shadow-jade-glow bg-jade/10' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</p>
        <div className={`w-2 h-2 rounded-full ${isPrimary ? 'bg-jade-light' : 'bg-gold'}`} />
      </div>
      <div>
        <p className={`font-display font-bold text-2xl sm:text-3xl tracking-tight mb-1 ${isPrimary ? 'text-jade-light' : 'text-gold'}`}>
          {value}
        </p>
        {sub && <p className="text-[11px] text-text-secondary">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.dashboard(),
    select: d => d.data.data,
  });

  const stats          = data?.stats || {};
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="badge-jade text-[10px] uppercase tracking-wider mb-2">Control Panel</span>
          <h1 className="page-title mt-1">Admin Overview</h1>
          <p className="section-subheading">Real-time metrics and order processing center.</p>
        </div>
        <div className="text-xs text-text-muted">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-flat h-28 animate-pulse bg-surface" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            sub="Confirmed bookings"
            isPrimary={true}
          />
          <StatCard
            label="Confirmed Orders"
            value={stats.totalBookings || 0}
            sub="Completed transactions"
          />
          <StatCard
            label="Active Concerts"
            value={stats.totalConcerts || 0}
            sub="Live & upcoming shows"
          />
          <StatCard
            label="Registered Fans"
            value={stats.totalUsers || 0}
            sub="Total user accounts"
          />
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Recent Orders — 8 cols */}
        <div className="lg:col-span-8">
          <div className="card-flat p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h2 className="font-display font-bold text-lg text-ivory">Recent Orders</h2>
              <Link to="/admin/bookings" className="text-xs text-jade-light hover:underline font-semibold">
                Manage All Orders →
              </Link>
            </div>

            {recentBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/[0.06] text-text-muted font-mono uppercase">
                    <tr>
                      <th className="py-3 px-3">Ref Code</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Concert</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {recentBookings.map(b => (
                      <tr key={b.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-mono font-bold text-jade-light">{b.booking_code}</td>
                        <td className="py-3 px-3 text-ivory font-medium">{b.user?.name || '—'}</td>
                        <td className="py-3 px-3 text-text-secondary truncate max-w-[160px]">{b.concert?.title}</td>
                        <td className="py-3 px-3 font-bold text-gold">{formatCurrency(b.total_price)}</td>
                        <td className="py-3 px-3">
                          <Badge variant={getStatusColor(b.status)}>{getStatusLabel(b.status)}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-text-secondary">No recent order activity.</div>
            )}
          </div>
        </div>

        {/* Quick Actions & System Status — 4 cols */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-flat p-6 space-y-4">
            <h2 className="font-display font-bold text-base text-ivory">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Add New Concert', to: '/admin/concerts', desc: 'Create show listing' },
                { label: 'Review Bookings', to: '/admin/bookings', desc: 'Approve payment proofs' },
                { label: 'Register Venue', to: '/admin/venues', desc: 'Add new concert hall' },
                { label: 'Sales Analytics', to: '/admin/analytics', desc: 'View revenue trends' },
              ].map(action => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.08] bg-surface-light/30 hover:border-jade-light hover:bg-jade/10 transition-all group"
                >
                  <div>
                    <p className="text-xs font-semibold text-ivory group-hover:text-jade-light transition-colors">
                      {action.label}
                    </p>
                    <p className="text-[10px] text-text-muted mt-0.5">{action.desc}</p>
                  </div>
                  <span className="text-text-muted group-hover:text-jade-light transition-colors text-xs">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card-flat p-6 space-y-4">
            <h2 className="font-display font-bold text-base text-ivory">System Status</h2>
            <div className="space-y-3 text-xs">
              {[
                { name: 'API Services', status: 'Operational', ok: true },
                { name: 'Payment Queue', status: 'Active', ok: true },
                { name: 'QR Engine', status: 'Ready', ok: true },
              ].map(sys => (
                <div key={sys.name} className="flex justify-between items-center">
                  <span className="text-text-secondary">{sys.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="font-semibold text-success">{sys.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
