import { useQuery } from '@tanstack/react-query';
import { TrendingUp, DollarSign, Ticket, Music, Users } from 'lucide-react';
import { adminService } from '../../services';
import { formatCurrency } from '../../utils';

export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.dashboard(),
    select: (d) => d.data.data,
    refetchInterval: 3000,
  });

  const stats = data?.stats || {};
  const monthlyRevenue = (data?.monthlyRevenue || []).map(m => ({
    ...m,
    revenue: parseFloat(m.revenue || 0),
    transactions: parseInt(m.transactions || 0, 10),
  }));

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted mb-1">Metrics & Insights</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
          Sales Analytics
        </h1>
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue || 0), icon: DollarSign, accent: true },
            { label: 'Total Bookings', value: (stats.totalBookings || 0).toLocaleString(), icon: Ticket },
            { label: 'Total Concerts', value: (stats.totalConcerts || 0).toLocaleString(), icon: Music },
            { label: 'Total Users', value: (stats.totalUsers || 0).toLocaleString(), icon: Users },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-card border border-border rounded-card p-6 shadow-card flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1">{stat.label}</p>
                  <p className={`font-display font-bold text-xl sm:text-2xl ${stat.accent ? 'text-accent' : 'text-text-primary'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${stat.accent ? 'bg-primary/20 text-accent border border-primary/30' : 'bg-surface text-muted border border-border'}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Revenue Trend Chart */}
      <div className="bg-card border border-border rounded-card p-6 shadow-card space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <TrendingUp className="w-4 h-4 text-accent" />
          <h3 className="font-display font-bold text-base text-text-primary">6-Month Revenue Trend</h3>
        </div>

        <div className="space-y-4">
          {monthlyRevenue.length > 0 ? (
            monthlyRevenue.map((item) => {
              const pct = Math.min(100, (item.revenue / maxRevenue) * 100);
              return (
                <div key={item.month} className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-mono font-semibold text-text-primary">{item.month}</span>
                    <div className="text-right">
                      <span className="font-mono font-bold text-accent">{formatCurrency(item.revenue)}</span>
                      <span className="ml-3 font-mono text-[10px] text-muted">{item.transactions} txn</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border">
                    <div
                      className="h-full bg-primary transition-all duration-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-muted text-center py-8">No historical sales data available yet.</p>
          )}
        </div>
      </div>

    </div>
  );
}
