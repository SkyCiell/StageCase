import { Link } from 'react-router-dom';
import { MapPin, Ticket, ArrowRight, AlertCircle } from 'lucide-react';
import { formatDateShort, formatCurrency, getStatusLabel } from '../../utils';

const BAND_COLORS = {
  'Crayon Case':  { primary: '#2D6F73', accent: '#D6B46B' },
  'Reality Club': { primary: '#5D4E89', accent: '#D8C5A2' },
  'The Milo':     { primary: '#6E8B6B', accent: '#C9A46A' },
  'Wave to Earth':{ primary: '#4F6D8C', accent: '#BFCFD7' },
};

export default function BookingTicketCard({ booking }) {
  const artistName = booking.concert?.artist_name || 'Crayon Case';
  const bandColor = BAND_COLORS[artistName] || { primary: '#2D6F73', accent: '#B89B5E' };
  
  const isRejected = booking.status === 'rejected' || booking.status === 'cancelled' || booking.payment?.status === 'rejected';

  const statusBadge = {
    confirmed:       'badge-jade',
    pending:         'badge-gold',
    payment_review:  'badge-gold',
    waiting_payment: 'badge-gold',
    cancelled:       'bg-danger/20 text-danger border border-danger/30 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider',
    rejected:        'bg-danger/20 text-danger border border-danger/30 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider',
  }[booking.status] || (isRejected ? 'bg-danger/20 text-danger border border-danger/30 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider' : 'badge-gold');

  const concertDate = booking.concert?.date ? new Date(booking.concert.date) : new Date();
  const day   = concertDate.getDate();
  const month = concertDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <div className="bg-card border border-border rounded-card p-6 shadow-card hover:-translate-y-1 hover:border-gold transition-all duration-250 flex flex-col justify-between relative overflow-hidden">

      {/* Top band color stripe */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-card"
        style={{ backgroundColor: isRejected ? '#EF4444' : bandColor.primary }}
      />

      <div>
        {/* Header bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4 pt-1">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs font-bold text-text-primary">#{booking.booking_code}</span>
          </div>
          <span className={statusBadge}>
            {isRejected ? 'REJECTED' : getStatusLabel(booking.status)}
          </span>
        </div>

        {/* Concert Info */}
        <div className="flex gap-4 items-start mb-4">
          {/* Date Badge Box */}
          <div 
            className="flex flex-col items-center justify-center w-14 h-14 rounded-md shrink-0 text-white shadow-sm"
            style={{ backgroundColor: isRejected ? '#DC2626' : bandColor.primary }}
          >
            <span className="text-xl font-black font-display leading-none">{day}</span>
            <span className="text-[10px] font-mono font-bold tracking-wider">{month}</span>
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono font-bold uppercase" style={{ color: isRejected ? '#EF4444' : bandColor.accent }}>
              {artistName}
            </span>
            <h3 className="font-display font-bold text-lg text-text-primary truncate">
              {booking.concert?.title || 'Concert Event'}
            </h3>
            {booking.concert?.venue && (
              <p className="text-xs text-muted flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 shrink-0" /> {booking.concert.venue.name}, {booking.concert.city || booking.concert.venue.city}
              </p>
            )}
          </div>
        </div>

        {/* Rejection Alert Box */}
        {isRejected && (
          <div className="p-3 mb-4 bg-danger/10 border border-danger/30 rounded-md text-xs text-danger flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Pembayaran Ditolak Admin</p>
              <p className="text-[11px] text-text-primary mt-0.5">
                Alasan: "{booking.payment?.rejection_reason || 'Bukti pembayaran tidak sesuai / ditolak oleh admin.'}"
              </p>
            </div>
          </div>
        )}

        {/* Details row */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-surface rounded-md border border-border text-xs mb-4">
          <div>
            <p className="text-[10px] text-muted uppercase font-mono tracking-wider">Date</p>
            <p className="font-semibold text-text-primary">{formatDateShort(booking.concert?.date)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase font-mono tracking-wider">Quantity</p>
            <p className="font-semibold text-text-primary">{booking.booking_details?.length || 1} Ticket(s)</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
        <div>
          <p className="text-[10px] text-muted font-mono uppercase">Total Paid</p>
          <p className="font-display font-bold text-accent text-lg">{formatCurrency(booking.total_price)}</p>
        </div>

        {booking.status === 'waiting_payment' || booking.status === 'pending' ? (
          <Link
            to={`/booking/payment/${booking.id}`}
            className="btn-primary bg-gold text-background hover:bg-gold-light text-xs py-2.5 px-4 font-bold"
          >
            Pay Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <Link
            to={`/my-tickets/${booking.id}`}
            className="btn-primary text-xs py-2 px-4"
          >
            {booking.status === 'confirmed' ? 'View E-Ticket' : 'Booking Details'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
