import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services';
import { formatCurrency } from '../../utils';

export default function Analytics() {
  const { data } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.dashboard(),
    select: d => d.data.data,
  });

  const monthlyRevenue = data?.monthlyRevenue || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-4 h-[1px] bg-bronze" />
          <span className="text-[10px] text-bronze tracking-[0.25em] uppercase font-semibold">
            Metrics & Insights
          </span>
        </div>
        <h1 className="font-display font-black text-ivory text-3xl tracking-tight">
          Sales & Financial Analytics
        </h1>
      </div>

      {/* Content Block */}
      <div className="border border-white/[0.06] bg-surface p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
          <div className="w-3 h-[1px] bg-amber" />
          <h3 className="text-xs font-bold text-ivory tracking-[0.15em] uppercase">
            6-Month Ticket Revenue Trend
          </h3>
        </div>

        {monthlyRevenue.length > 0 ? (
          <div className="space-y-6">
            {monthlyRevenue.map(item => (
              <div key={item.month} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-ivory font-bold">{item.month}</span>
                  <span className="text-amber font-bold font-display">
                    {formatCurrency(item.revenue)} ({item.transactions} transactions)
                  </span>
                </div>
                <div className="h-2 bg-graphite border border-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-bronze to-amber"
                    style={{ width: `${Math.min(100, (item.revenue / 10000000) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-text-muted">
            No sales revenue recorded for the past 6 months.
          </div>
        )}
      </div>
    </div>
  );
}
