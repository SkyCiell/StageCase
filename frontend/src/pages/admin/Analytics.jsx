import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services';
import { formatCurrency } from '../../utils';

const S = {
  muted: 'rgba(141,167,204,0.5)',
  white: '#F5F3F5',
  accent: '#8DA7CC',
  dimmed: 'rgba(245,243,245,0.45)',
  gold: '#C9A84C',
};

export default function Analytics() {
  const { data } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.dashboard(),
    select: (d) => d.data.data,
  });

  const monthlyRevenue = data?.monthlyRevenue || [];
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue || 0), 1);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2"
          style={{ color: S.muted }}
        >
          Metrics & Insights
        </p>
        <h1
          className="font-display font-black uppercase tracking-tight"
          style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', color: S.white, lineHeight: 1 }}
        >
          Sales Analytics
        </h1>
      </div>

      {/* Summary cards */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-2" style={{ background: 'var(--admin-border)' }}>
          {[
            { label: 'Total Revenue', value: formatCurrency(data.totalRevenue || 0) },
            { label: 'Total Bookings', value: (data.totalBookings || 0).toLocaleString() },
            { label: 'Total Concerts', value: (data.totalConcerts || 0).toLocaleString() },
            { label: 'Total Users', value: (data.totalUsers || 0).toLocaleString() },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-6"
              style={{ background: 'var(--admin-surface)' }}
            >
              <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: S.muted }}>
                {stat.label}
              </p>
              <p className="text-xl font-display font-black" style={{ color: S.white }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Revenue chart */}
      <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}>
        <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid var(--admin-border)' }}>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: S.muted }}>
            6-Month Revenue Trend
          </p>
        </div>

        <div className="p-6 space-y-5">
          {monthlyRevenue.length > 0 ? (
            monthlyRevenue.map((item) => {
              const pct = Math.min(100, (item.revenue / maxRevenue) * 100);
              return (
                <div key={item.month} className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-mono font-bold" style={{ color: S.dimmed }}>
                      {item.month}
                    </span>
                    <div className="text-right">
                      <span className="text-[13px] font-display font-black" style={{ color: S.gold }}>
                        {formatCurrency(item.revenue)}
                      </span>
                      <span className="ml-3 text-[10px] font-mono" style={{ color: S.muted }}>
                        {item.transactions} txn
                      </span>
                    </div>
                  </div>
                  {/* Bar */}
                  <div
                    className="h-[3px] w-full"
                    style={{ background: 'var(--admin-border)' }}
                  >
                    <div
                      className="h-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: '#8DA7CC' }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center font-mono text-[11px]" style={{ color: S.muted }}>
              No revenue data for the past 6 months.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
