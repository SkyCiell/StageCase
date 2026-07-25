import { clsx } from 'clsx';

const variantClasses = {
  jade: 'badge-jade',
  gold: 'badge-gold',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  secondary: 'badge bg-white/5 text-text-secondary border border-white/10',
};

const Badge = ({ children, variant = 'jade', className = '', dot = false }) => (
  <span className={clsx(variantClasses[variant], className)}>
    {dot && (
      <span className={clsx('w-1.5 h-1.5 rounded-full', {
        'bg-jade': variant === 'jade',
        'bg-gold': variant === 'gold',
        'bg-success': variant === 'success',
        'bg-warning': variant === 'warning',
        'bg-error': variant === 'error',
        'bg-text-secondary': variant === 'secondary',
      })} />
    )}
    {children}
  </span>
);

export default Badge;
