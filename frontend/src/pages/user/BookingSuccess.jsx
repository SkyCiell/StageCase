import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Ticket, ArrowRight, Compass } from 'lucide-react';
import { bookingService } from '../../services';
import Layout from '../../components/layout/Layout';
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
      <div className="min-h-screen bg-background py-16 flex flex-col justify-center">
        <div className="container-premium max-w-lg text-center">

          {/* Success Badge Icon */}
          <div className="w-20 h-20 bg-success/15 border border-success/30 rounded-full flex items-center justify-center mx-auto mb-6 text-success shadow-card">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="badge-jade text-[10px] uppercase tracking-wider mb-2">
            Transaction Received
          </span>
          
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-3">
            Payment Submitted
          </h1>
          
          <p className="text-text-secondary text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Thank you. Your transaction is being processed. Your digital e-tickets will be issued instantly once verified.
          </p>

          {/* Summary Card */}
          {booking && (
            <div className="bg-card border border-border rounded-card p-6 text-left space-y-4 mb-8 shadow-card">
              <div className="flex justify-between items-center pb-3 border-b border-border text-xs">
                <span className="text-muted font-mono uppercase">Booking Reference</span>
                <span className="font-mono font-bold text-accent">{booking.booking_code}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border text-xs">
                <span className="text-muted font-mono uppercase">Status</span>
                <span className="badge-gold uppercase">{booking.status}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted font-mono uppercase">Total Paid</span>
                <span className="font-display font-bold text-accent text-lg">{formatCurrency(booking.total_price)}</span>
              </div>
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {booking && (booking.status === 'waiting_payment' || booking.status === 'pending') ? (
              <Link to={`/booking/payment/${booking.id}`} className="btn-primary bg-gold text-background hover:bg-gold-light text-xs py-3 px-6 justify-center font-bold">
                <Ticket className="w-4 h-4" /> Pay Now / Complete Payment
              </Link>
            ) : (
              <Link to="/my-tickets" className="btn-primary text-xs py-3 px-6 justify-center">
                <Ticket className="w-4 h-4" /> View My Digital Tickets
              </Link>
            )}
            <Link to="/concerts" className="btn-secondary text-xs py-3 px-6 justify-center">
              <Compass className="w-4 h-4" /> Explore More Concerts
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}
