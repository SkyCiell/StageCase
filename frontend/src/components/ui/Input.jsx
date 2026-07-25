import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(({
  label,
  error,
  hint,
  className = '',
  containerClassName = '',
  prefix,
  suffix,
  ...props
}, ref) => {
  return (
    <div className={clsx('flex flex-col gap-2', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-ivory/80 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-4 text-text-secondary">{prefix}</div>
        )}
        <input
          ref={ref}
          className={clsx(
            'input-field',
            prefix && 'pl-11',
            suffix && 'pr-11',
            error && 'border-error/50 focus:border-error focus:ring-error/20',
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-4 text-text-secondary">{suffix}</div>
        )}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
      {hint && !error && <p className="text-xs text-text-secondary">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
