/**
 * Seat Number Chip Component
 * Concert ticket seat/section indicator
 */
export default function SeatChip({ section, row, number, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {section && (
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-text-muted font-mono uppercase tracking-wider">Sec</span>
          <span className="text-xs font-black text-ivory font-mono">{section}</span>
        </div>
      )}
      {row && (
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-text-muted font-mono uppercase tracking-wider">Row</span>
          <span className="text-xs font-black text-ivory font-mono">{row}</span>
        </div>
      )}
      {number && (
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-text-muted font-mono uppercase tracking-wider">Seat</span>
          <span className="text-xs font-black text-ivory font-mono">{number}</span>
        </div>
      )}
    </div>
  );
}
