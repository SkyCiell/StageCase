import { EventBadge } from '../ticket';

/**
 * Premium Empty States with Ticket Aesthetic
 */
export default function EmptyState({ 
  icon = '🎫', 
  title, 
  description, 
  action, 
  accentColor = '#2D6F73' 
}) {
  return (
    <div className="boarding-pass-card max-w-md mx-auto text-center py-16 px-8">
      {/* Decorative Top */}
      <div className="flex justify-center gap-[2px] mb-6 opacity-20">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-[2px] bg-current" 
               style={{ height: `${[3,2,4,2,3,2,4,2,3][i] * 4}px`, color: accentColor }} />
        ))}
      </div>

      {/* Icon */}
      <div className="text-6xl mb-6 opacity-50">{icon}</div>

      {/* Event Badge */}
      <EventBadge variant="primary" accentColor={accentColor} className="text-[8px] mb-4">
        NO EVENTS FOUND
      </EventBadge>

      {/* Title */}
      <h3 className="font-display font-black text-2xl text-ivory mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-sm mx-auto">
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 border-2 font-mono font-bold text-xs tracking-[0.2em] uppercase hover:bg-white/5 transition-all"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          {action.label}
        </button>
      )}

      {/* Decorative Bottom */}
      <div className="flex justify-center gap-[2px] mt-8 opacity-20">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-[2px] bg-current" 
               style={{ height: `${[3,2,4,2,3,2,4,2,3][i] * 4}px`, color: accentColor }} />
        ))}
      </div>
    </div>
  );
}

export function NoConcertsFound({ onReset }) {
  return (
    <EmptyState
      icon="🎵"
      title="No Concerts Found"
      description="We couldn't find any concerts matching your search. Try adjusting your filters or explore all upcoming events."
      action={{
        label: 'View All Concerts',
        onClick: onReset
      }}
    />
  );
}

export function NoBookingsYet() {
  return (
    <EmptyState
      icon="🎫"
      title="No Bookings Yet"
      description="You haven't booked any concert tickets. Start your journey by exploring our upcoming events and secure your spot today."
      action={{
        label: 'Explore Concerts',
        onClick: () => window.location.href = '/concerts'
      }}
    />
  );
}

export function NoFavoritesYet() {
  return (
    <EmptyState
      icon="⭐"
      title="No Favorites Yet"
      description="Save your favorite concerts to quickly access them later. Simply click the heart icon on any concert card."
      accentColor="#B89B5E"
    />
  );
}
