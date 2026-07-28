import { EventBadge } from '../ticket';

/**
 * Premium Error States
 */
export default function ErrorState({ 
  title = 'Something Went Wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry,
  accentColor = '#D65A5A'
}) {
  return (
    <div className="boarding-pass-card max-w-md mx-auto text-center py-16 px-8">
      {/* Error Icon */}
      <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">⚠️</span>
      </div>

      {/* Error Badge */}
      <EventBadge variant="filled" accentColor={accentColor} className="text-[8px] mb-4">
        ERROR • PLEASE RETRY
      </EventBadge>

      {/* Title */}
      <h3 className="font-display font-black text-2xl text-ivory mb-3">
        {title}
      </h3>

      {/* Message */}
      <p className="text-text-secondary text-sm leading-relaxed mb-8">
        {message}
      </p>

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-error/20 border border-error text-error font-mono font-bold text-xs tracking-[0.2em] uppercase hover:bg-error/30 transition-all"
        >
          Try Again
        </button>
      )}

      {/* Decorative Barcode */}
      <div className="flex justify-center gap-[2px] mt-8 opacity-20">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-[2px] bg-error" 
               style={{ height: `${[3,2,4,2,3,2,4,2,3][i] * 4}px` }} />
        ))}
      </div>
    </div>
  );
}

export function NetworkError({ onRetry }) {
  return (
    <ErrorState
      title="Connection Lost"
      message="Unable to reach the server. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  );
}

export function NotFoundError() {
  return (
    <ErrorState
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved. Return to homepage to continue browsing."
      onRetry={() => window.location.href = '/'}
      accentColor="#E7B567"
    />
  );
}
