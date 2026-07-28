/**
 * Premium Skeleton Loaders with Ticket Aesthetic
 */

export function TicketCardSkeleton() {
  return (
    <div className="boarding-pass-card h-full animate-pulse">
      <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="w-20 h-4 bg-white/10 rounded" />
        <div className="flex gap-[2px]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[1.5px] h-3 bg-white/10" />
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Left Stub */}
        <div className="w-20 flex-shrink-0 bg-black/20 flex flex-col items-center justify-center py-6 border-r border-white/[0.06]">
          <div className="w-12 h-12 rounded-full bg-white/10 mb-2" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Poster */}
          <div className="aspect-[16/9] bg-white/10" />

          {/* Info */}
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <div className="w-24 h-3 bg-white/10 rounded" />
              <div className="w-full h-5 bg-white/10 rounded" />
              <div className="w-3/4 h-4 bg-white/10 rounded" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <div className="space-y-2">
                <div className="w-12 h-3 bg-white/10 rounded" />
                <div className="w-20 h-5 bg-white/10 rounded" />
              </div>
              <div className="w-16 h-8 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConcertGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <TicketCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TicketDetailSkeleton() {
  return (
    <div className="boarding-pass-card max-w-md mx-auto animate-pulse">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-32 h-4 bg-white/10 rounded" />
          <div className="w-20 h-6 bg-white/10 rounded" />
        </div>
        <div className="w-48 h-8 bg-white/10 rounded mb-2" />
        <div className="w-64 h-4 bg-white/10 rounded" />
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center py-4 border-y border-white/10">
          <div className="w-24 h-3 bg-white/10 rounded mx-auto mb-2" />
          <div className="w-40 h-10 bg-white/10 rounded mx-auto" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="w-16 h-3 bg-white/10 rounded" />
              <div className="w-full h-4 bg-white/10 rounded" />
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/10">
          <div className="w-full aspect-square bg-white/10 rounded-lg mb-3" />
          <div className="w-48 h-3 bg-white/10 rounded mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function BookingHistorySkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="boarding-pass-card p-6 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 space-y-2">
              <div className="w-32 h-4 bg-white/10 rounded" />
              <div className="w-48 h-6 bg-white/10 rounded" />
              <div className="w-40 h-4 bg-white/10 rounded" />
            </div>
            <div className="w-24 h-6 bg-white/10 rounded" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="space-y-2">
                <div className="w-16 h-3 bg-white/10 rounded" />
                <div className="w-full h-4 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
