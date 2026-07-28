/**
 * Ticket Stub Divider Component
 * Premium section separator with tear-line aesthetic
 */
export default function TicketStub({ label, accentColor = '#B89B5E' }) {
  return (
    <div className="relative py-8">
      {/* Main Tear Line */}
      <div className="relative h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent">
        {/* Perforated Pattern */}
        <div className="absolute inset-0"
             style={{
               backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 10px)',
             }}
        />
        
        {/* Center Label Badge */}
        {label && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-background border border-current"
               style={{ color: accentColor }}>
            <span className="text-[9px] font-mono font-bold tracking-[0.3em] uppercase">
              {label}
            </span>
          </div>
        )}

        {/* Side Circles (Ticket Punch Holes) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-white/20 bg-background -translate-x-1/2" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-white/20 bg-background translate-x-1/2" />
      </div>

      {/* Decorative Barcode Elements */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 flex gap-[2px] opacity-20">
        {[3, 2, 4, 2, 3, 2, 4].map((height, i) => (
          <div key={i} className="w-[1.5px] bg-current" style={{ height: `${height * 2}px`, color: accentColor }} />
        ))}
      </div>
    </div>
  );
}
