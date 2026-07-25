import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  gold: 'btn-gold',
  ghost: 'btn-ghost',
  danger: 'inline-flex items-center justify-center gap-2 px-6 py-3 bg-error/10 text-error font-semibold rounded-2xl border border-error/30 transition-all duration-300 hover:bg-error hover:text-white active:scale-95',
};

const sizes = {
  sm: 'text-sm px-4 py-2.5 rounded-xl',
  md: 'text-sm px-6 py-3 rounded-2xl',
  lg: 'text-base px-8 py-4 rounded-2xl',
  xl: 'text-lg px-10 py-4 rounded-2xl',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      transition={{ duration: 0.15 }}
      className={clsx(
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        'relative overflow-hidden',
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
