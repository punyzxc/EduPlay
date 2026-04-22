import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animated?: boolean;
  variant?: 'default' | 'glass' | 'gradient' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  animated = false,
  variant = 'default',
  size = 'md',
}) => {
  const variantStyles = {
    default: 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700',
    glass: 'glass border border-slate-700/50',
    gradient: 'bg-gradient-to-br from-primary-600/20 to-cyan-600/20 border border-primary-500/30',
    subtle: 'bg-slate-900/50 border border-slate-800',
  };

  const sizeStyles = {
    sm: 'p-4 rounded-lg',
    md: 'p-6 rounded-2xl',
    lg: 'p-8 rounded-3xl',
  };

  const baseStyles = `
    transition-all duration-300 ease-out
    backdrop-blur-md
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${animated ? 'hover:shadow-xl hover:border-primary-500/50 transform hover:scale-105' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
};
