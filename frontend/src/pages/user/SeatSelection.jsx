import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Armchair, Check, Ticket, MapPin, ArrowRight } from 'lucide-react';
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
        <div className="min-h-[70vh] flex items-center justify-center container-premium text-center">
          <div className="bg-card border border-border rounded-card p-10 max-w-md w-full shadow-card">
            <Ticket className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-text-primary mb-2">No Active Booking Session</h2>
            <p className="text-text-secondary text-xs mb-6">Please select a concert and ticket tier first.</p>
            <Link to="/concerts" className="btn-primary text-xs w-full justify-center">
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
      <div className="min-h-screen bg-background py-12">
        <div className="container-premium">

          {/* ── Page Header & Stepper ── */}
          <div className="mb-10 border-b border-border pb-8">
            <span className="badge-jade text-[10px] uppercase tracking-wider mb-2">Step 1 of 3</span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mt-1">Interactive Seat Selection</h1>
            <p className="text-text-secondary text-sm mt-1">
              Pick your preferred seats for <strong className="text-text-primary font-semibold">{selectedConcert.title}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── Seat Map Container (7 cols) ── */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-card border border-border rounded-card p-6 sm:p-8 shadow-card flex flex-col items-center">

                {/* Stage Banner */}
                <div className="w-full py-3 bg-surface border border-border rounded-md text-center mb-8 shadow-sm">
                  <span className="font-display font-bold text-xs uppercase tracking-widest text-primary">
                    STAGE / PERFORMANCE AREA
                  </span>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-6 mb-8 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md border border-border bg-surface" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-primary text-text-primary flex items-center justify-center font-bold text-[10px]">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-surface border border-border opacity-40" />
                    <span>Booked</span>
                  </div>
                </div>

                {/* Seat Matrix */}
                {isLoading ? (
                  <div className="py-16 text-center text-xs text-muted">Loading seat layout...</div>
                ) : Object.keys(rowsMap).length > 0 ? (
                  <div className="space-y-3 overflow-x-auto max-w-full pb-4">
                    {Object.entries(rowsMap).map(([rowLabel, rowSeats]) => (
                      <div key={rowLabel} className="flex items-center gap-3">
                        <span className="w-6 text-xs font-bold text-muted text-center font-mono">{rowLabel}</span>
                        <div className="flex gap-2">
                          {rowSeats.map(seat => {
                            const isSelected = selectedSeats.some(s => s.id === seat.id);
                            const isAvailable = seat.status === 'available';
                            return (
                              <button
                                key={seat.id}
                                onClick={() => handleSeatClick(seat)}
                                disabled={!isAvailable}
                                className={`w-9 h-9 rounded-md text-xs font-mono font-medium transition-all duration-200 border cursor-pointer ${
                                  isSelected
                                    ? 'bg-primary border-primary text-text-primary font-bold shadow-sm'
                                    : isAvailable
                                    ? 'bg-surface border-border text-text-primary hover:border-primary hover:bg-primary/10'
                                    : 'bg-surface border-border text-muted opacity-40 cursor-not-allowed'
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
                  <div className="py-12 text-center bg-surface border border-border rounded-md w-full p-6">
                    <Armchair className="w-8 h-8 text-muted mx-auto mb-2" />
                    <p className="text-text-primary font-bold text-sm">General Admission / Free Seating</p>
                    <p className="text-xs text-text-secondary mt-1">This tier does not require individual seat reservation.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Summary Sidebar (5 cols) ── */}
            <div className="lg:col-span-5">
              <div className="bg-card border border-border rounded-card p-6 sm:p-7 sticky top-28 space-y-6 shadow-card">

                <div className="pb-4 border-b border-border">
                  <span className="badge-jade text-[9px] uppercase tracking-wider mb-1">Booking Overview</span>
                  <h3 className="font-display font-bold text-lg text-text-primary">{selectedConcert.title}</h3>
                  {selectedConcert.venue && (
                    <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-muted" /> {selectedConcert.venue.name}, {selectedConcert.venue.city}
                    </p>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">Selected Tiers</p>
                  {selectedCategories.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs border-b border-border pb-3">
                      <div>
                        <p className="font-semibold text-text-primary">{item.category.name} × {item.quantity}</p>
                        <p className="text-text-secondary mt-0.5">{formatCurrency(item.category.price)} each</p>
                      </div>
                      <p className="font-bold text-accent">{formatCurrency(parseFloat(item.category.price) * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Selected seats badges */}
                {selectedSeats.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">Reserved Seats</p>
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
                <div className="py-4 border-t border-b border-border flex items-center justify-between">
                  <span className="text-xs text-muted uppercase font-mono tracking-wider">Total Amount</span>
                  <span className="font-display font-black text-accent text-2xl">{formatCurrency(totalAmount)}</span>
                </div>

                <button onClick={handleProceed} className="btn-primary w-full py-3.5 text-sm justify-center">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
