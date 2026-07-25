import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../../services';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from '../../utils';

export default function BookingSuccess() {
  const { id } = useParams();

  const { data: booking } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getById(id),
    select: d => d.data.data,
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-28 pb-20 flex flex-col justify-center">
        <div className="container-premium max-w-xl text-center">

          {/* Icon */}
          <div className="w-20 h-20 border border-bronze/40 bg-bronze/10 flex items-center justify-center mx-auto mb-8 relative">
            <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-bronze" />
            <span className="text-3xl">♩</span>
          </div>

          {/* Heading */}
          <p className="text-[10px] text-bronze uppercase tracking-[0.3em] font-semibold mb-3">
            Transaction Received
          </p>
          <h1
            className="font-display font-black text-ivory leading-tight tracking-tighter mb-4"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}
          >
            Proof Submitted
          </h1>
          <p className="text-text-secondary text-sm max-w-md mx-auto mb-10 leading-relaxed">
            Thank you. Your payment receipt is being processed and verified by our administrative team. Your tickets will be released upon confirmation.
          </p>

          {/* Summary Card */}
          {booking && (
            <div className="border border-white/[0.06] bg-graphite p-8 text-left space-y-4 mb-10">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
                <span className="text-xs text-text-muted uppercase tracking-wider">Booking Reference</span>
                <span className="font-mono font-bold text-bronze text-sm">{booking.booking_code}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
                <span className="text-xs text-text-muted uppercase tracking-wider">Verification Status</span>
                <Badge variant="warning">{booking.status}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-muted uppercase tracking-wider">Total Paid</span>
                <span className="font-display font-bold text-amber text-lg">{formatCurrency(booking.total_price)}</span>
              </div>
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-tickets" className="btn-primary px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase">
              View My Tickets
            </Link>
            <Link to="/concerts" className="px-8 py-4 border border-white/10 hover:border-white/30 text-ivory text-xs font-bold tracking-[0.2em] uppercase transition-colors">
              Explore More Shows
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
