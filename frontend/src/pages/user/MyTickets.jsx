import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../../services';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { formatDateShort, formatCurrency, getStatusColor, getStatusLabel } from '../../utils';

export default function MyTickets() {
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings', statusFilter],
    queryFn: () => bookingService.myBookings({ status: statusFilter }),
    select: d => d.data,
  });

  const bookings = data?.data || [];

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-28 pb-20">
        <div className="container-premium">

          {/* ── Header ── */}
          <div className="border-b border-white/[0.06] pb-8 mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-[1px] bg-bronze" />
              <span className="text-[10px] text-bronze tracking-[0.25em] uppercase font-semibold">
                Passes & Reservations
              </span>
            </div>
            <h1
              className="font-display font-black text-ivory leading-none tracking-tighter"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              My Tickets
            </h1>
          </div>

          {/* ── Status Filter Bar ── */}
          <div className="flex gap-0 border-b border-white/[0.06] mb-10 overflow-x-auto">
            {[
              { label: 'All Bookings',    value: '' },
              { label: 'Confirmed',       value: 'confirmed' },
              { label: 'Pending Review',  value: 'payment_review' },
              { label: 'Awaiting Payment',value: 'waiting_payment' },
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-6 py-3.5 text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300
                            border-b-2 -mb-px whitespace-nowrap ${
                  statusFilter === tab.value
                    ? 'text-ivory border-bronze'
                    : 'text-text-muted border-transparent hover:text-ivory/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Ticket Grid ── */}
          {isLoading ? (
            <TableSkeleton rows={4} />
          ) : bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map(b => (
                <div
                  key={b.id}
                  className="border border-white/[0.06] bg-surface p-6 sm:p-8 flex flex-col justify-between
                             hover:border-bronze/40 transition-all duration-500 relative group"
                >
                  <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-bronze/40 group-hover:bg-bronze transition-colors" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="font-mono text-xs text-bronze font-bold tracking-wider">
                          {b.booking_code}
                        </span>
                        <h3 className="font-display font-bold text-xl text-ivory tracking-tight mt-1">
                          {b.concert?.title || 'Concert Show'}
                        </h3>
                        <p className="text-xs text-text-muted mt-1">
                          {formatDateShort(b.concert?.date)}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(b.status)}>
                        {getStatusLabel(b.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/[0.06] flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider">Total</p>
                      <p className="font-bold text-amber text-lg font-display">{formatCurrency(b.total_price)}</p>
                    </div>
                    <Link
                      to={`/my-tickets/${b.id}`}
                      className="px-5 py-2.5 border border-white/10 hover:border-bronze text-ivory
                                 text-xs font-bold tracking-wider uppercase transition-colors"
                    >
                      {b.status === 'confirmed' ? 'View QR Pass →' : 'Details →'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-white/[0.06] p-8 max-w-xl mx-auto">
              <p className="text-4xl mb-4 opacity-20">🎟</p>
              <h3 className="font-display font-bold text-xl text-ivory mb-2">No Ticket Bookings Found</h3>
              <p className="text-text-secondary text-xs mb-8">You haven't purchased any tickets yet.</p>
              <Link to="/concerts" className="btn-primary px-8 py-3.5 text-xs tracking-wider">
                Explore Shows
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
