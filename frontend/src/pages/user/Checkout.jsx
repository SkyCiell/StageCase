import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { bookingService } from '../../services';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Input from '../../components/ui/Input';
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
          <p className="text-6xl mb-6 opacity-20">♩</p>
          <h2 className="font-display font-bold text-2xl text-ivory mb-2">Booking Session Expired</h2>
          <p className="text-text-secondary text-sm mb-8">Please select a concert to restart the booking process.</p>
          <Link to="/concerts" className="btn-primary px-8 py-3.5 text-xs tracking-wider">
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
      <div className="min-h-screen bg-background pt-28 pb-20">
        <div className="container-premium max-w-5xl">

          {/* ── Header ── */}
          <div className="border-b border-white/[0.06] pb-8 mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-[1px] bg-bronze" />
              <span className="text-[10px] text-bronze tracking-[0.25em] uppercase font-mono font-semibold">
                STEP 02 / 03 — REVIEW & CHECKOUT
              </span>
            </div>
            <h1
              className="font-display font-black text-ivory leading-none tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Order Confirmation
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

            {/* ── Left Details — 7 cols ── */}
            <div className="lg:col-span-7 space-y-6">

              {/* Ticket Holder */}
              <div className="border border-white/[0.06] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-3 h-[1px] bg-bronze" />
                  <h3 className="text-xs font-bold text-ivory tracking-[0.15em] uppercase">
                    Ticket Holder Profile
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="border-l border-bronze/30 pl-4 py-1">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Full Name</p>
                    <p className="font-bold text-ivory text-sm">{user?.name}</p>
                  </div>
                  <div className="border-l border-white/10 pl-4 py-1">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Email Address</p>
                    <p className="font-semibold text-ivory text-sm">{user?.email}</p>
                  </div>
                  <div className="border-l border-white/10 pl-4 py-1 sm:col-span-2">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="font-semibold text-ivory text-sm">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="border border-white/[0.06] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-3 h-[1px] bg-bronze" />
                  <h3 className="text-xs font-bold text-ivory tracking-[0.15em] uppercase">
                    Performance Details
                  </h3>
                </div>
                <h4 className="font-display font-bold text-ivory text-2xl tracking-tight mb-2">
                  {selectedConcert.title}
                </h4>
                <p className="text-xs text-bronze font-semibold uppercase tracking-wider mb-1">
                  {formatDate(selectedConcert.date)}
                </p>
                {selectedConcert.venue && (
                  <p className="text-xs text-text-muted">
                    {selectedConcert.venue.name}, {selectedConcert.venue.city}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="border border-white/[0.06] p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-[1px] bg-bronze" />
                  <h3 className="text-xs font-bold text-ivory tracking-[0.15em] uppercase">
                    Order Notes (Optional)
                  </h3>
                </div>
                <Input
                  placeholder="Add any special instructions or request notes..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* ── Right Summary Sidebar — 5 cols ── */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 border border-white/[0.06] p-6 sm:p-8 space-y-6">

                <div className="pb-4 border-b border-white/[0.06]">
                  <p className="text-[10px] text-bronze tracking-[0.2em] uppercase font-semibold mb-1">
                    Receipt Summary
                  </p>
                  <h3 className="font-display font-bold text-ivory text-xl tracking-tight">
                    Order Items
                  </h3>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-3">
                  {selectedCategories.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs border-b border-white/[0.04] pb-3">
                      <div>
                        <p className="font-bold text-ivory">{item.category.name}</p>
                        <p className="text-text-muted mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-amber">
                        {formatCurrency(parseFloat(item.category.price) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pricing summary */}
                <div className="py-4 border-t border-white/[0.06] space-y-2 text-xs">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
                    <span className="text-ivory font-mono">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Service & Processing Fee</span>
                    <span className="text-forest-light font-mono uppercase font-bold">Free</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-ivory pt-3 border-t border-white/[0.06]">
                    <span>Total Due</span>
                    <span className="text-amber text-xl font-display">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="w-full btn-primary py-4 text-xs font-bold tracking-[0.2em] uppercase disabled:opacity-50"
                >
                  {loading ? 'Processing Order...' : 'Confirm & Proceed to Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
