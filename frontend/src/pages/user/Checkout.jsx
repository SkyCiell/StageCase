import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Calendar, MapPin, CreditCard, ShieldCheck, Ticket, ArrowRight } from 'lucide-react';
import { bookingService } from '../../services';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import { formatCurrency, formatDate } from '../../utils';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedConcert, selectedCategories, selectedSeats, setBookingSummary, totalAmount } = useBooking();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  if (!selectedConcert || !selectedCategories.length) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center container-premium text-center">
          <Ticket className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-text-primary mb-2">Booking Session Expired</h2>
          <p className="text-text-secondary text-xs mb-6">Please select a concert to restart the booking process.</p>
          <Link to="/concerts" className="btn-primary text-xs px-8 py-3 font-semibold">
            Explore Concerts
          </Link>
        </div>
      </Layout>
    );
  }

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const items = selectedCategories.map(cat => ({
        ticket_category_id: cat.category.id,
        quantity: cat.quantity,
        seat_ids: selectedSeats.map(s => s.id),
      }));

      const { data } = await bookingService.create({
        concert_id: selectedConcert.id,
        items,
        notes,
      });

      setBookingSummary(data.data);
      toast.success('Booking created! Please submit your payment proof.');
      navigate(`/booking/payment/${data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container-premium max-w-5xl">

          {/* ── Header ── */}
          <div className="border-b border-border pb-8 mb-10">
            <span className="badge-jade text-[10px] uppercase tracking-wider mb-2">Step 2 of 3 — Review & Checkout</span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mt-1">Order Confirmation</h1>
            <p className="text-text-secondary text-sm mt-1">Review your ticket pass details before completing payment.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── Left Details — 7 cols ── */}
            <div className="lg:col-span-7 space-y-6">

              {/* Ticket Holder Profile */}
              <div className="bg-card border border-border rounded-card p-6 sm:p-7 shadow-card space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <User className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-text-primary uppercase font-mono tracking-wider">
                    Ticket Holder Profile
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-surface p-3.5 rounded-md border border-border">
                    <p className="text-[10px] text-muted uppercase font-mono tracking-wider mb-1">Full Name</p>
                    <p className="font-semibold text-text-primary">{user?.name}</p>
                  </div>
                  <div className="bg-surface p-3.5 rounded-md border border-border">
                    <p className="text-[10px] text-muted uppercase font-mono tracking-wider mb-1">Email Address</p>
                    <p className="font-semibold text-text-primary truncate">{user?.email}</p>
                  </div>
                  <div className="bg-surface p-3.5 rounded-md border border-border sm:col-span-2">
                    <p className="text-[10px] text-muted uppercase font-mono tracking-wider mb-1">Phone Number</p>
                    <p className="font-semibold text-text-primary">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Performance Details */}
              <div className="bg-card border border-border rounded-card p-6 sm:p-7 shadow-card space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-text-primary uppercase font-mono tracking-wider">
                    Performance Details
                  </h3>
                </div>
                <h4 className="font-display font-bold text-text-primary text-xl leading-tight">
                  {selectedConcert.title}
                </h4>
                <p className="text-xs text-accent font-semibold uppercase tracking-wider">
                  {formatDate(selectedConcert.date)}
                </p>
                {selectedConcert.venue && (
                  <p className="text-xs text-muted flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-muted shrink-0" /> {selectedConcert.venue.name}, {selectedConcert.venue.city}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="bg-card border border-border rounded-card p-6 sm:p-7 shadow-card space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-text-primary uppercase font-mono tracking-wider">
                    Order Notes (Optional)
                  </h3>
                </div>
                <textarea
                  className="input-premium min-h-[90px] resize-none"
                  placeholder="Add any special instructions or request notes..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* ── Right Summary Sidebar — 5 cols ── */}
            <div className="lg:col-span-5">
              <div className="bg-card border border-border rounded-card p-6 sm:p-7 sticky top-28 space-y-6 shadow-card">

                <div className="pb-4 border-b border-border">
                  <p className="text-[10px] text-accent tracking-wider uppercase font-semibold font-mono mb-1">
                    Receipt Summary
                  </p>
                  <h3 className="font-display font-bold text-text-primary text-lg">
                    Order Items
                  </h3>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-3">
                  {selectedCategories.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs border-b border-border pb-3">
                      <div>
                        <p className="font-semibold text-text-primary">{item.category.name}</p>
                        <p className="text-muted mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-accent">
                        {formatCurrency(parseFloat(item.category.price) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pricing summary */}
                <div className="py-4 border-t border-border space-y-2 text-xs">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="text-text-primary font-mono">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Service & Processing Fee</span>
                    <span className="text-success font-mono font-bold uppercase">Free</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-text-primary pt-3 border-t border-border">
                    <span>Total Due</span>
                    <span className="text-accent text-2xl font-display">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-xs font-semibold justify-center disabled:opacity-50"
                >
                  {loading ? 'Processing Order...' : 'Confirm & Proceed to Payment'} <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  Encrypted & Direct Transfer Guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
