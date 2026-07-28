import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils';

/**
 * Premium Boarding Pass Inspired Concert Card
 * Apple Wallet / Ticketmaster aesthetic
 */
export default function TicketCard({ concert, variant = 'default' }) {
  const defaultColor = '#2D6F73';
  const accentColor = concert.accent_color || defaultColor;

  return (
    <Link
      to={`/concerts/${concert.slug}`}
      className="group block relative overflow-hidden bg-graphite border border-white/[0.08] hover:border-white/20 transition-all duration-500"
    >
      {/* Perforated Edge Top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" 
           style={{ 
             backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 10px)',
             height: '2px'
           }} 
      />

      {/* Ticket Stub Tear Line */}
      <div className="absolute top-0 left-16 w-[1px] h-full opacity-20"
           style={{
             backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, currentColor 4px, currentColor 6px)',
             color: accentColor
           }}
      />

      <div className="flex">
        {/* Left Stub - Boarding Pass Style */}
        <div className="w-16 flex-shrink-0 bg-black/20 flex flex-col items-center justify-center py-6 relative">
          {/* Event Badge */}
          <div className="absolute top-4 left-0 right-0 text-center">
            <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-black"
                 style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
              {new Date(concert.date).getDate()}
            </div>
          </div>

          {/* Month Label - Rotated */}
          <div className="writing-mode-vertical text-[10px] font-mono font-bold tracking-[0.3em] uppercase opacity-60"
               style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            {new Date(concert.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
          </div>

          {/* Barcode Accent */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-[2px] opacity-30">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-[2px] h-3 bg-current" style={{ color: accentColor }} />
            ))}
          </div>
        </div>

        {/* Main Ticket Content */}
        <div className="flex-1 p-5 relative">
          {/* Venue Location Badge */}
          <div className="flex items-center gap-2 mb-3">
            <div className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase px-2 py-1 border border-current/30 rounded"
                 style={{ color: accentColor }}>
              {concert.venue?.city || 'Jakarta'}
            </div>
            {concert.is_featured && (
              <div className="text-[8px] font-black tracking-wider uppercase px-2 py-1 bg-bronze/20 text-bronze rounded">
                Featured
              </div>
            )}
          </div>

          {/* Artist Name */}
          <h3 className="font-display font-black text-ivory text-lg leading-tight mb-1 group-hover:text-amber transition-colors">
            {concert.artist_name || 'Crayon Case'}
          </h3>

          {/* Concert Title */}
          <p className="text-xs text-text-secondary font-medium mb-4 line-clamp-1">
            {concert.title}
          </p>

          {/* Event Details Grid - Ticket Info Style */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-[10px]">
            <div>
              <div className="text-text-muted font-mono uppercase tracking-wider mb-1">Date</div>
              <div className="font-bold text-ivory">
                {new Date(concert.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
              </div>
            </div>
            <div>
              <div className="text-text-muted font-mono uppercase tracking-wider mb-1">Time</div>
              <div className="font-bold text-ivory">
                {concert.time?.substring(0, 5) || '19:00'}
              </div>
            </div>
            <div>
              <div className="text-text-muted font-mono uppercase tracking-wider mb-1">Venue</div>
              <div className="font-bold text-ivory truncate">
                {concert.venue?.name || 'TBA'}
              </div>
            </div>
          </div>

          {/* Price Tag - Ticket Pricing Style */}
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-text-muted font-mono">FROM</div>
            <div className="font-display font-black text-amber text-lg tracking-tight">
              {formatCurrency(concert.min_price || 350000)}
            </div>
          </div>

          {/* Bottom Barcode Decoration */}
          <div className="absolute bottom-0 right-0 w-24 h-[1px] opacity-10"
               style={{
                 backgroundImage: 'repeating-linear-gradient(90deg, currentColor, currentColor 2px, transparent 2px, transparent 4px)',
                 color: accentColor
               }}
          />
        </div>
      </div>

      {/* Perforated Edge Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" 
           style={{ 
             backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 10px)',
             height: '2px'
           }} 
      />

      {/* Hover Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
           style={{ color: accentColor }}
      />
    </Link>
  );
}
