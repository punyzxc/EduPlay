import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'text-white border border-sky-400/30 bg-gradient-to-br from-sky-500 to-blue-600 shadow-soft-card hover:brightness-110',
  secondary:
    'text-slate-100 border border-slate-600/65 bg-gradient-to-br from-slate-700/90 to-slate-800/90 hover:border-slate-500 hover:bg-slate-700/90',
  success:
    'text-white border border-emerald-400/30 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-soft-card hover:brightness-110',
  danger:
    'text-white border border-rose-400/35 bg-gradient-to-br from-rose-500 to-red-600 shadow-soft-card hover:brightness-110',
  ghost:
    'text-slate-200 border border-transparent bg-transparent hover:bg-slate-800/65 hover:text-slate-100',
  outline:
    'text-sky-200 border border-sky-400/50 bg-sky-500/5 hover:bg-sky-500/14 hover:text-sky-100',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  xs: 'px-3 py-1.5 text-xs rounded-xl',
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-5 py-3 text-[0.96rem] rounded-2xl',
  lg: 'px-6 py-3.5 text-base rounded-2xl',
  xl: 'px-7 py-[1.125rem] text-lg rounded-2xl',
};

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false,
  icon,
  loading = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      className={[
        'btn-interactive inline-flex items-center justify-center gap-2 font-semibold tracking-[0.01em]',
        'transition-all duration-200 ease-out active:scale-[0.985]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        'disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4Zm2 5.3A8 8 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65Z"
          />
        </svg>
      )}
      {!loading && icon && <span className="text-[1.05em]">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
