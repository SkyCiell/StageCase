import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { concertService } from '../../services';
import { useBooking } from '../../context/BookingContext';
import Layout from '../../components/layout/Layout';
import { formatCurrency } from '../../utils';

export default function SeatSelection() {
  const navigate = useNavigate();
  const { selectedConcert, selectedCategories, selectedSeats, toggleSeat, totalAmount } = useBooking();

  const concertId = selectedConcert?.id;

  const { data: seats = [], isLoading } = useQuery({
    queryKey: ['seats', concertId],
    queryFn: () => concertService.getSeats(concertId),
    enabled: !!concertId,
    select: d => d.data.data,
  });

  if (!selectedConcert || !selectedCategories.length) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center container-premium text-center">
          <div className="card-flat p-10 max-w-md w-full">
            <p className="text-4xl mb-3 opacity-30">🎟</p>
            <h2 className="font-display font-bold text-2xl text-ivory mb-2">No Active Booking Session</h2>
            <p className="text-text-secondary text-xs mb-6">Please select a concert and ticket tier first.</p>
            <Link to="/concerts" className="btn-primary text-xs w-full text-center">
              Explore Concerts
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Group seats by row
  const rowsMap = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const totalSelectedCount = selectedCategories.reduce((sum, item) => sum + item.quantity, 0);

  const handleSeatClick = (seat) => {
    if (seat.status !== 'available') return;
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (!isSelected && selectedSeats.length >= totalSelectedCount) {
      toast.error(`You can select maximum ${totalSelectedCount} seat(s).`);
      return;
    }
    toggleSeat(seat);
  };

  const handleProceed = () => {
    if (seats.length > 0 && selectedSeats.length < totalSelectedCount) {
      return toast.error(`Please select ${totalSelectedCount - selectedSeats.length} more seat(s).`);
    }
    navigate('/booking/checkout');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-28 pb-20">
        <div className="container-premium">

          {/* ── Page Header ── */}
          <div className="mb-10 border-b border-white/[0.06] pb-8">
            <span className="badge-jade text-[10px] uppercase tracking-wider mb-2">Step 1 of 3</span>
            <h1 className="page-title mt-1">Interactive Seat Selection</h1>
            <p className="section-subheading">
              Pick your preferred seats for <span className="text-ivory font-bold">{selectedConcert.title}</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── Seat Map Container (7 cols) ── */}
            <div className="lg:col-span-7 space-y-6">
              <div className="card-premium p-6 sm:p-10 flex flex-col items-center">

                {/* Stage Banner */}
                <div className="w-full py-3 bg-bg-secondary border border-jade/40 rounded-xl text-center mb-8 shadow-sm">
                  <span className="font-display font-bold text-xs uppercase tracking-widest text-jade-light">
                    STAGE / PERFORMANCE AREA
                  </span>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-6 mb-8 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md border border-white/20 bg-surface" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-jade text-white flex items-center justify-center font-bold text-[10px]">✓</div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-surface-light border border-white/[0.05] opacity-40" />
                    <span>Booked</span>
                  </div>
                </div>

                {/* Seat Matrix */}
                {isLoading ? (
                  <div className="py-16 text-center text-xs text-text-muted">Loading seat layout...</div>
                ) : Object.keys(rowsMap).length > 0 ? (
                  <div className="space-y-3 overflow-x-auto max-w-full pb-4">
                    {Object.entries(rowsMap).map(([rowLabel, rowSeats]) => (
                      <div key={rowLabel} className="flex items-center gap-3">
                        <span className="w-6 text-xs font-bold text-text-muted text-center font-mono">{rowLabel}</span>
                        <div className="flex gap-2">
                          {rowSeats.map(seat => {
                            const isSelected = selectedSeats.some(s => s.id === seat.id);
                            const isAvailable = seat.status === 'available';
                            return (
                              <button
                                key={seat.id}
                                onClick={() => handleSeatClick(seat)}
                                disabled={!isAvailable}
                                className={`w-9 h-9 rounded-lg text-xs font-mono font-medium transition-all duration-200 border ${
                                  isSelected
                                    ? 'bg-jade border-jade text-white font-bold shadow-jade-glow'
                                    : isAvailable
                                    ? 'bg-surface border-white/[0.1] text-ivory hover:border-jade-light hover:bg-jade/10'
                                    : 'bg-surface-light border-white/[0.04] text-text-muted opacity-40 cursor-not-allowed'
                                }`}
                                title={`${seat.label || seat.row + seat.number} (${seat.category?.name || 'Standard'})`}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center card-flat w-full">
                    <span className="text-3xl mb-2 block">🎟</span>
                    <p className="text-ivory font-bold text-sm">General Admission / Free Seating</p>
                    <p className="text-xs text-text-secondary mt-1">This tier does not require individual seat reservation.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Summary Sidebar (5 cols) ── */}
            <div className="lg:col-span-5">
              <div className="card-premium p-6 sm:p-8 sticky top-28 space-y-6">

                <div className="pb-4 border-b border-white/[0.08]">
                  <span className="badge-jade text-[9px] uppercase tracking-wider mb-1">Booking Overview</span>
                  <h3 className="font-display font-bold text-xl text-ivory">{selectedConcert.title}</h3>
                  {selectedConcert.venue && (
                    <p className="text-xs text-text-secondary mt-1">📍 {selectedConcert.venue.name}, {selectedConcert.venue.city}</p>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Selected Tiers</p>
                  {selectedCategories.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs border-b border-white/[0.06] pb-3">
                      <div>
                        <p className="font-bold text-ivory">{item.category.name} × {item.quantity}</p>
                        <p className="text-text-secondary mt-0.5">{formatCurrency(item.category.price)} each</p>
                      </div>
                      <p className="font-bold text-gold">{formatCurrency(parseFloat(item.category.price) * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Selected seats badges */}
                {selectedSeats.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Reserved Seats</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map(s => (
                        <span key={s.id} className="badge-jade text-xs font-mono font-bold">
                          {s.label || `${s.row}${s.number}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="py-4 border-t border-b border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs text-text-muted uppercase font-semibold">Total Price</span>
                  <span className="font-display font-bold text-gold text-2xl">{formatCurrency(totalAmount)}</span>
                </div>

                <button onClick={handleProceed} className="btn-primary w-full py-4 text-sm">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
