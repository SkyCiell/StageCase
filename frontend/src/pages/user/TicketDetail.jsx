import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Ticket, Calendar, Clock, MapPin, QrCode, ShieldCheck } from 'lucide-react';
import { bookingService } from '../../services';
import Layout from '../../components/layout/Layout';
import SCLogo from '../../components/SCLogo';
import { formatDate, formatTime, formatCurrency, getStatusLabel } from '../../utils';

const BAND_COLORS = {
  'Crayon Case':  { primary: '#2D6F73', accent: '#D6B46B' },
  'Reality Club': { primary: '#5D4E89', accent: '#D8C5A2' },
  'The Milo':     { primary: '#6E8B6B', accent: '#C9A46A' },
  'Wave to Earth':{ primary: '#4F6D8C', accent: '#BFCFD7' },
};

export default function TicketDetail() {
  const { id } = useParams();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getById(id),
    select: d => d.data.data,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center container-premium text-center">
          <p className="text-xs text-muted font-mono tracking-widest uppercase">Loading Digital Ticket Pass...</p>
        </div>
      </Layout>
    );
  }

  if (!booking) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center container-premium text-center">
          <h2 className="font-display font-bold text-2xl text-text-primary mb-2">Ticket Pass Not Found</h2>
        </div>
      </Layout>
    );
  }

  const artistName = booking.concert?.artist_name || 'Crayon Case';
  const bandColor = BAND_COLORS[artistName] || { primary: '#2D6F73', accent: '#B89B5E' };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container-premium max-w-2xl">

          {/* Back link */}
          <div className="mb-6 flex justify-between items-center">
            <Link
              to="/my-tickets"
              className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to My Tickets
            </Link>
            <span className={booking.status === 'confirmed' ? 'badge-jade' : 'badge-gold'}>
              {getStatusLabel(booking.status)}
            </span>
          </div>

          {/* ── E-Ticket Pass Card ── */}
          <div className="bg-card border border-border rounded-card relative overflow-hidden shadow-modal">
            {/* Top band color stripe */}
            <div 
              className="h-1 rounded-t-card"
              style={{ backgroundColor: bandColor.primary }}
            />

            {/* Ticket Header Banner */}
            <div className="p-6 sm:p-7 border-b border-border flex justify-between items-center bg-bg-secondary">
              <div className="flex items-center gap-3">
                <SCLogo size={32} />
                <div>
                  <span className="font-display font-bold text-text-primary text-sm tracking-wide">StageCase</span>
                  <p className="text-[10px] uppercase font-mono tracking-wider font-semibold text-accent">OFFICIAL E-TICKET PASS</p>
                </div>
              </div>
              <span className="font-mono text-xs bg-surface border border-border px-3 py-1.5 rounded-md font-bold text-accent">
                #{booking.booking_code}
              </span>
            </div>

            {/* Ticket Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold block mb-1" style={{ color: bandColor.accent }}>
                  {artistName}
                </span>
                <h2 className="font-display font-bold text-text-primary text-2xl sm:text-3xl leading-tight mb-3">
                  {booking.concert?.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted" /> {formatDate(booking.concert?.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted" /> {formatTime(booking.concert?.time)} WIB
                  </span>
                </div>
                {booking.concert?.venue && (
                  <p className="text-xs text-muted flex items-center gap-1.5 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-muted shrink-0" /> {booking.concert.venue.name}, {booking.concert.venue.city}
                  </p>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Ticket Category & Seats</p>
                {booking.details?.map(detail => (
                  <div key={detail.id} className="p-4 bg-surface rounded-md border border-border flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-text-primary text-sm">{detail.ticketCategory?.name}</p>
                      {detail.seat && (
                        <p className="text-xs font-mono mt-0.5 font-bold text-accent">
                          SEAT: {detail.seat.label || `${detail.seat.row}${detail.seat.number}`}
                        </p>
                      )}
                      <p className="text-[11px] text-muted">Quantity: {detail.quantity}</p>
                    </div>
                    <p className="font-bold text-accent text-sm font-mono">{formatCurrency(detail.subtotal)}</p>
                  </div>
                ))}
              </div>

              {/* QR Code Pass */}
              {booking.status === 'confirmed' ? (
                <div className="pt-6 border-t border-border text-center space-y-4">
                  <p className="text-xs font-mono uppercase tracking-wider font-semibold text-accent">Official Venue Gate Pass</p>
                  <div className="p-5 bg-white inline-block rounded-card border-2 border-border shadow-card">
                    <QRCodeSVG
                      value={booking.details?.[0]?.qr_code_data || booking.booking_code}
                      size={180}
                      bgColor="#FFFFFF"
                      fgColor="#0D1117"
                    />
                  </div>
                  <p className="text-xs text-muted font-mono font-bold tracking-wider">#{booking.booking_code}</p>
                  <p className="text-xs text-text-secondary flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-success" /> Scan this QR pass at the entrance gate for instant access
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-surface rounded-md border border-border text-center">
                  <p className="text-xs text-accent font-medium">
                    Digital QR Code pass will be issued automatically once your payment is verified.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
