/**
 * Event Badge Component
 * Premium label for ticket categories, sections, and event types
 */
export default function EventBadge({ 
  children, 
  variant = 'default', 
  accentColor,
  className = '' 
}) {
  const variants = {
    default: 'border-white/10 text-text-secondary',
    primary: `border-current text-current`,
    filled: `bg-current/10 border-current text-current`,
    vip: 'bg-bronze/10 border-bronze text-bronze',
    featured: 'bg-amber/10 border-amber text-amber',
  };

  const variantClass = variants[variant] || variants.default;

  const style = variant === 'primary' || variant === 'filled' 
    ? { color: accentColor } 
    : {};

  return (
    <span 
      className={`inline-flex items-center px-2 py-1 border text-[9px] font-mono font-bold tracking-[0.2em] uppercase ${variantClass} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
