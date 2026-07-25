import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { bookingService } from '../../services';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import SCLogo from '../../components/SCLogo';
import { formatDate, formatTime, formatCurrency, getStatusColor, getStatusLabel } from '../../utils';

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
          <p className="text-xs text-text-muted uppercase tracking-widest">Loading Digital Ticket Pass...</p>
        </div>
      </Layout>
    );
  }

  if (!booking) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center container-premium text-center">
          <h2 className="font-display font-bold text-2xl text-ivory mb-2">Ticket Pass Not Found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-28 pb-20">
        <div className="container-premium max-w-2xl">

          {/* Back link */}
          <div className="mb-6 flex justify-between items-center">
            <Link
              to="/my-tickets"
              className="text-xs text-bronze hover:text-amber font-semibold tracking-wider uppercase transition-colors"
            >
              ← Back to My Tickets
            </Link>
            <Badge variant={getStatusColor(booking.status)}>{getStatusLabel(booking.status)}</Badge>
          </div>

          {/* ── E-Ticket Pass Card ── */}
          <div className="border border-white/[0.08] bg-graphite relative overflow-hidden">
            {/* Left bronze accent edge */}
            <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-secondary" />

            {/* Ticket Header Banner */}
            <div className="bg-surface p-6 sm:p-8 border-b border-white/[0.06] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <SCLogo size={32} />
                <div>
                  <span className="font-display font-black text-ivory tracking-[0.2em] text-sm uppercase">StageCase</span>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-bronze font-bold mt-0.5">OFFICIAL E-TICKET PASS</p>
                </div>
              </div>
              <span className="font-mono text-xs bg-white/[0.05] border border-white/10 px-3 py-1.5 font-bold text-bronze">
                {booking.booking_code}
              </span>
            </div>

            {/* Ticket Body */}
            <div className="p-6 sm:p-8 space-y-8">
              <div>
                <p className="text-[10px] text-bronze uppercase tracking-[0.2em] font-semibold mb-2">Show Information</p>
                <h2 className="font-display font-black text-ivory text-3xl tracking-tight mb-2">
                  {booking.concert?.title}
                </h2>
                <p className="text-xs text-text-secondary">
                  {formatDate(booking.concert?.date)} • {formatTime(booking.concert?.time)} WIB
                </p>
                {booking.concert?.venue && (
                  <p className="text-xs text-text-muted mt-1">
                    {booking.concert.venue.name}, {booking.concert.venue.city}
                  </p>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-semibold">Seat & Category Pass</p>
                {booking.details?.map(detail => (
                  <div key={detail.id} className="p-4 border border-white/[0.06] bg-background flex justify-between items-center">
                    <div>
                      <p className="font-bold text-ivory text-sm">{detail.ticketCategory?.name}</p>
                      {detail.seat && (
                        <p className="text-xs text-bronze font-mono mt-0.5 font-bold">
                          SEAT: {detail.seat.label || `${detail.seat.row}${detail.seat.number}`}
                        </p>
                      )}
                      <p className="text-[11px] text-text-muted">Quantity: {detail.quantity}</p>
                    </div>
                    <p className="font-bold text-amber text-sm font-display">{formatCurrency(detail.subtotal)}</p>
                  </div>
                ))}
              </div>

              {/* QR Code Pass */}
              {booking.status === 'confirmed' ? (
                <div className="pt-6 border-t border-white/[0.06] text-center space-y-4">
                  <p className="text-[10px] text-bronze uppercase tracking-[0.25em] font-bold">Venue Entrance Gate Pass</p>
                  <div className="p-6 bg-ivory inline-block border-2 border-bronze shadow-2xl">
                    <QRCodeSVG
                      value={booking.details?.[0]?.qr_code_data || booking.booking_code}
                      size={180}
                      bgColor="#F2EEE8"
                      fgColor="#161616"
                    />
                  </div>
                  <p className="text-xs text-text-muted font-mono tracking-wider">{booking.booking_code}</p>
                  <p className="text-[11px] text-text-secondary">Present this QR code at the concert venue gate for instant check-in.</p>
                </div>
              ) : (
                <div className="p-5 border border-white/[0.08] bg-white/[0.02] text-center">
                  <p className="text-xs text-amber font-semibold">
                    Digital QR Code will be issued once your payment receipt is confirmed by the admin team.
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
