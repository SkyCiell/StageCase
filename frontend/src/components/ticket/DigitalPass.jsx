/**
 * Premium Digital Concert Pass Component
 * Apple Wallet / Ticketmaster style e-ticket
 */
export default function DigitalPass({ ticket, booking, concert }) {
  const accentColor = concert?.accent_color || '#2D6F73';
  const concertDate = new Date(concert?.date || Date.now());

  return (
    <div className="max-w-md mx-auto">
      {/* Digital Pass Card */}
      <div className="boarding-pass-card bg-gradient-to-br from-graphite to-black overflow-hidden">
        
        {/* Pass Header */}
        <div className="relative px-6 py-5 border-b border-white/10">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5"
               style={{
                 backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 10px)',
                 color: accentColor
               }}
          />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[9px] font-mono font-bold tracking-[0.3em] uppercase text-text-muted">
                STAGECASE E-TICKET
              </div>
              <div className="px-2 py-1 bg-green-500/20 border border-green-500/50 text-green-400 text-[8px] font-black tracking-wider rounded">
                ✓ CONFIRMED
              </div>
            </div>
            
            <h2 className="font-display font-black text-2xl text-ivory mb-1 leading-tight">
              {concert?.artist_name || 'CONCERT'}
            </h2>
            <p className="text-sm text-text-secondary line-clamp-1">
              {concert?.title}
            </p>
          </div>
        </div>

        {/* Pass Body - Event Details Grid */}
        <div className="p-6 space-y-6">
          
          {/* Booking Code - Large Display */}
          <div className="text-center py-4 border-y border-white/10">
            <div className="text-[8px] font-mono text-text-muted uppercase tracking-[0.3em] mb-2">
              Booking Code
            </div>
            <div className="font-mono font-black text-3xl tracking-wider"
                 style={{ color: accentColor }}>
              {booking?.booking_code}
            </div>
          </div>

          {/* Event Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-text-muted mb-1">Date</div>
              <div className="font-bold text-ivory">
                {concertDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-text-muted mb-1">Time</div>
              <div className="font-bold text-ivory">
                {concert?.time?.substring(0, 5) || '19:00'} WIB
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-[9px] font-mono uppercase tracking-wider text-text-muted mb-1">Venue</div>
              <div className="font-bold text-ivory">
                {concert?.venue?.name || 'TBA'}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                {concert?.venue?.address || concert?.venue?.city}
              </div>
            </div>

            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-text-muted mb-1">Category</div>
              <div className="font-bold text-ivory">
                {ticket?.ticketCategory?.name || 'General Admission'}
              </div>
            </div>

            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-text-muted mb-1">Quantity</div>
              <div className="font-bold text-ivory">
                {ticket?.quantity || 1} Ticket(s)
              </div>
            </div>

            {ticket?.seat_id && (
              <div className="col-span-2">
                <div className="text-[9px] font-mono uppercase tracking-wider text-text-muted mb-1">Seat</div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 text-ivory text-sm font-mono font-bold">
                    Row {ticket.seat?.row || 'A'}
                  </span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 text-ivory text-sm font-mono font-bold">
                    Seat {ticket.seat?.number || '12'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* QR Code Section */}
          {ticket?.qr_code && (
            <div className="pt-6 border-t border-white/10">
              <div className="text-center mb-3">
                <div className="text-[8px] font-mono text-text-muted uppercase tracking-[0.3em]">
                  Scan at Entrance
                </div>
              </div>
              
              <div className="relative p-4 bg-white rounded-lg">
                <img 
                  src={ticket.qr_code} 
                  alt="QR Code" 
                  className="w-full h-auto"
                />
              </div>

              <div className="mt-3 text-center text-[10px] font-mono text-text-muted">
                {ticket.qr_code_data}
              </div>
            </div>
          )}

          {/* Terms & Barcode Footer */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-center gap-1 mb-3 opacity-30">
              {[4, 2, 3, 2, 4, 2, 3, 2, 4].map((h, i) => (
                <div key={i} className="w-[2px] bg-current" 
                     style={{ height: `${h * 4}px`, color: accentColor }} />
              ))}
            </div>
            
            <p className="text-[9px] text-text-muted text-center leading-relaxed">
              This e-ticket is valid for one-time entry only. Present QR code at venue entrance.
              Terms & conditions apply.
            </p>
          </div>
        </div>

        {/* Pass Footer - Accent Strip */}
        <div className="h-2" style={{ backgroundColor: accentColor }} />
      </div>
    </div>
  );
}
