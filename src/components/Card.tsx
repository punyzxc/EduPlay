import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animated?: boolean;
  variant?: 'default' | 'glass' | 'gradient' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'surface-card',
  glass: 'glass surface-glow',
  gradient:
    'surface-card bg-gradient-to-br from-sky-500/16 via-slate-900/72 to-teal-500/10 border-sky-400/25',
  subtle: 'surface-subtle',
};

const sizeStyles: Record<NonNullable<CardProps['size']>, string> = {
  sm: 'p-4 rounded-2xl',
  md: 'p-5 sm:p-6 rounded-3xl',
  lg: 'p-6 sm:p-7 rounded-[1.75rem]',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  animated = false,
  variant = 'default',
  size = 'md',
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
          onClick();
        }
      }}
      className={[
        'relative transition-all duration-300 ease-out',
        variantStyles[variant],
        sizeStyles[size],
        animated ? 'hover:-translate-y-0.5 hover:shadow-soft-card' : '',
        onClick ? 'cursor-pointer active:scale-[0.995]' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
};
