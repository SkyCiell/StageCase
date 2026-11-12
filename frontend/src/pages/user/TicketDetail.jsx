import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Calendar, Clock, MapPin, ShieldCheck, AlertCircle, Download } from 'lucide-react';
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

  const handleDownloadQR = () => {
    const svgElement = document.getElementById('qr-code-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const padding = 32;
      const width = image.width + padding * 2;
      const height = image.height + padding * 2 + 50;
      
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background card (crisp white)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Draw outer border
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, width - 4, height - 4);

      // Draw Header Text / Title
      ctx.fillStyle = '#0D1117';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('STAGECASE DIGITAL E-TICKET', width / 2, 24);

      // Draw SVG QR onto canvas
      ctx.drawImage(image, padding, padding + 4);

      // Draw Booking Code at bottom
      ctx.fillStyle = '#2D6F73';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(`#${booking.booking_code}`, width / 2, height - padding + 10);

      // Subtitle
      ctx.fillStyle = '#64748B';
      ctx.font = '11px sans-serif';
      ctx.fillText(`${booking.concert?.title || 'Concert E-Ticket Pass'}`, width / 2, height - 12);

      const png = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = png;
      downloadLink.download = `StageCase_QR_${booking.booking_code}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

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
  const isRejected = booking.status === 'rejected' || booking.status === 'cancelled' || booking.payment?.status === 'rejected';
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
            <span className={
              isRejected 
                ? 'bg-danger/20 text-danger border border-danger/30 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider' 
                : booking.status === 'confirmed' ? 'badge-jade' : 'badge-gold'
            }>
              {isRejected ? 'REJECTED' : getStatusLabel(booking.status)}
            </span>
          </div>

          {/* ── E-Ticket Pass Card ── */}
          <div className="bg-card border border-border rounded-card relative overflow-hidden shadow-modal">
            {/* Top band color stripe */}
            <div 
              className="h-1 rounded-t-card"
              style={{ backgroundColor: isRejected ? '#EF4444' : bandColor.primary }}
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
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold block mb-1" style={{ color: isRejected ? '#EF4444' : bandColor.accent }}>
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

              {/* Rejection Warning Card */}
              {isRejected && (
                <div className="p-4 bg-danger/10 border border-danger/30 rounded-md space-y-2">
                  <div className="flex items-center gap-2 text-danger font-bold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Pembayaran / Pesanan Ditolak Admin</span>
                  </div>
                  <p className="text-xs text-text-primary leading-relaxed">
                    Alasan Penolakan: <strong className="text-danger">"{booking.payment?.rejection_reason || 'Bukti pembayaran tidak sesuai atau dibatalkan oleh admin.'}"</strong>
                  </p>
                  <p className="text-[11px] text-muted pt-1">
                    Silakan lakukan pemesanan ulang atau hubungi layanan pelanggan jika terdapat kekeliruan.
                  </p>
                </div>
              )}

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
              {booking.status === 'confirmed' && !isRejected ? (
                <div className="pt-6 border-t border-border text-center space-y-4">
                  <p className="text-xs font-mono uppercase tracking-wider font-semibold text-accent">Official Venue Gate Pass</p>
                  <div className="p-5 bg-white inline-block rounded-card border-2 border-border shadow-card">
                    <QRCodeSVG
                      id="qr-code-svg"
                      value={booking.details?.[0]?.qr_code_data || booking.booking_code}
                      size={180}
                      bgColor="#FFFFFF"
                      fgColor="#0D1117"
                    />
                  </div>
                  <p className="text-xs text-muted font-mono font-bold tracking-wider">#{booking.booking_code}</p>

                  {/* Download QR Button */}
                  <div>
                    <button
                      type="button"
                      onClick={handleDownloadQR}
                      className="btn-primary bg-accent hover:bg-gold text-background text-xs py-2.5 px-5 rounded-md inline-flex items-center gap-2 font-bold shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Download className="w-4 h-4" /> Download Pass QR Code (PNG)
                    </button>
                  </div>

                  <p className="text-xs text-text-secondary flex items-center justify-center gap-1.5 pt-1">
                    <ShieldCheck className="w-4 h-4 text-success" /> Scan this QR pass at the entrance gate for instant access
                  </p>
                </div>
              ) : (booking.status === 'waiting_payment' || booking.status === 'pending') ? (
                <div className="p-6 bg-gold/10 border border-gold/30 rounded-md text-center space-y-3">
                  <p className="text-xs text-text-primary font-bold">
                    Pembayaran Belum Selesai (Waiting Payment)
                  </p>
                  <p className="text-xs text-muted">
                    Silakan selesaikan pembayaran Anda untuk mengaktifkan E-Ticket resmi.
                  </p>
                  <Link
                    to={`/booking/payment/${booking.id}`}
                    className="btn-primary bg-gold text-background hover:bg-gold-light text-xs py-3 px-6 font-bold inline-flex items-center gap-2 justify-center"
                  >
                    Proceed to Payment Page <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              ) : (
                <div className="p-4 bg-surface rounded-md border border-border text-center">
                  <p className={`text-xs font-medium ${isRejected ? 'text-danger' : 'text-accent'}`}>
                    {isRejected 
                      ? 'Tiket ini tidak berlaku karena pembayaran telah ditolak.' 
                      : 'Digital QR Code pass will be issued automatically once your payment is verified.'}
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
