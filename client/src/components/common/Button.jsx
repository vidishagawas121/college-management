import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white focus:ring-[var(--color-accent-light)] shadow-md',
    academic: 'bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-white focus:ring-[var(--color-accent-light)] shadow-md',
    secondary: 'bg-white hover:bg-[var(--color-surface-soft)] text-[var(--color-primary)] focus:ring-[var(--color-accent-light)] border border-[var(--color-border)]',
    outline: 'bg-transparent hover:bg-[var(--color-surface-soft)] text-[var(--color-primary)] border border-[var(--color-primary)] focus:ring-[var(--color-accent-light)]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm',
    ghost: 'bg-transparent hover:bg-[var(--color-surface-soft)] text-[var(--color-text)] focus:ring-[var(--color-border)]',
    gold: 'bg-[var(--color-accent)] hover:bg-[#bf8d2e] text-[var(--color-primary)] font-semibold focus:ring-[var(--color-accent-light)] shadow',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
    xl: 'text-lg px-8 py-3.5 gap-3',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
