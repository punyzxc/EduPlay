import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  animated = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl
        border border-gray-700 backdrop-blur-sm
        ${animated ? 'hover:shadow-2xl transition-all duration-300 hover:scale-105' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
