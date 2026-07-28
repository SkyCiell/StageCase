import { formatCurrency } from '../../utils';
import { EventBadge, SeatChip } from '../ticket';

/**
 * Premium Booking Summary Card
 * Ticket receipt style
 */
export default function BookingSummary({ concert, items, total, accentColor = '#2D6F73' }) {
  return (
    <div className="boarding-pass-card sticky top-24">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <EventBadge variant="filled" accentColor={accentColor} className="text-[8px] mb-3">
          BOOKING SUMMARY
        </EventBadge>
        <h3 className="font-display font-black text-xl text-ivory mb-1">
          {concert?.title}
        </h3>
        <p className="text-xs text-text-muted">
          {concert?.venue?.name} • {new Date(concert?.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Items */}
      <div className="p-6 space-y-4 border-b border-white/10">
        {items?.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-bold text-ivory text-sm mb-1">
                  {item.category_name}
                </div>
                {item.seat_id && (
                  <SeatChip 
                    section={item.section} 
                    row={item.row} 
                    number={item.number}
                    className="text-[10px]"
                  />
                )}
                <div className="text-xs text-text-muted mt-1">
                  Qty: {item.quantity}
                </div>
              </div>
              <div className="font-mono font-bold text-sm text-ivory">
                {formatCurrency(item.subtotal)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="p-6 bg-black/20">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
            Total Amount
          </span>
          <span className="font-display font-black text-2xl text-amber">
            {formatCurrency(total)}
          </span>
        </div>

        {/* Info Notice */}
        <div className="text-[10px] text-text-muted leading-relaxed pt-4 border-t border-white/10">
          <p>• Tickets are non-refundable</p>
          <p>• Complete payment within 2 hours</p>
          <p>• E-ticket will be sent via email</p>
        </div>
      </div>

      {/* Bottom Barcode */}
      <div className="flex justify-center gap-[2px] py-3 bg-black/10">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="w-[2px] bg-current opacity-30" 
               style={{ height: `${[2,3,2,4,2,3,2,4,2,3,2,4,2,3,2][i] * 3}px`, color: accentColor }} />
        ))}
      </div>
    </div>
  );
}
