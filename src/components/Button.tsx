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
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    uppercase tracking-wide text-sm
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-primary-600 to-primary-700
      text-white shadow-lg
      hover:shadow-xl hover:from-primary-700 hover:to-primary-800
      focus:ring-primary-500
      active:from-primary-800 active:to-primary-900
    `,
    secondary: `
      bg-slate-700/80 text-slate-100
      hover:bg-slate-600 hover:shadow-lg
      focus:ring-slate-500
      border border-slate-600/50
    `,
    success: `
      bg-gradient-to-r from-success-500 to-success-600
      text-white shadow-lg
      hover:shadow-xl hover:from-success-600 hover:to-success-700
      focus:ring-success-500
    `,
    danger: `
      bg-gradient-to-r from-danger-500 to-danger-600
      text-white shadow-lg
      hover:shadow-xl hover:from-danger-600 hover:to-danger-700
      focus:ring-danger-500
    `,
    ghost: `
      bg-transparent text-primary-400
      hover:bg-primary-500/10 hover:text-primary-300
      focus:ring-primary-500
    `,
    outline: `
      bg-transparent border-2 border-primary-500 text-primary-400
      hover:bg-primary-500/10 hover:text-primary-300 hover:border-primary-400
      focus:ring-primary-500
    `,
  };

  const sizeStyles = {
    xs: 'px-3 py-1.5 text-xs font-medium rounded-md',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      aria-busy={loading}
      aria-disabled={disabled || loading}
    >
      {loading && (
        <svg
          className="w-4 h-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && <span className="text-lg">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
