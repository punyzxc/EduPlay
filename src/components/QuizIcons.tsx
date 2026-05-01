import React from 'react';
import { CategoryId, Difficulty } from '../types/quiz';

interface IconProps {
  className?: string;
}

interface CategoryIconProps extends IconProps {
  categoryId: CategoryId;
}

interface DifficultyIconProps extends IconProps {
  difficulty: Difficulty;
}

const baseClass = 'w-5 h-5';

export const CategoryIcon: React.FC<CategoryIconProps> = ({ categoryId, className = '' }) => {
  if (categoryId === 'history') {
    return (
      <svg viewBox="0 0 24 24" className={`${baseClass} ${className}`} fill="none" aria-hidden="true">
        <path d="M4 20h16M6 20V9m4 11V9m4 11V9m4 11V9M3 9h18L12 4 3 9Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (categoryId === 'english') {
    return (
      <svg viewBox="0 0 24 24" className={`${baseClass} ${className}`} fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 9h18M3 15h18M8 4v16M16 4v16" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={`${baseClass} ${className}`} fill="none" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="16" r="1.2" fill="currentColor" />
    </svg>
  );
};

export const DifficultyIcon: React.FC<DifficultyIconProps> = ({ difficulty, className = '' }) => {
  if (difficulty === 'easy') {
    return (
      <svg viewBox="0 0 24 24" className={`${baseClass} ${className}`} fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 12l2.3 2.3L15.5 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (difficulty === 'medium') {
    return (
      <svg viewBox="0 0 24 24" className={`${baseClass} ${className}`} fill="none" aria-hidden="true">
        <path d="M4 14h16M7 10h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={`${baseClass} ${className}`} fill="none" aria-hidden="true">
      <path d="m12 3 2.4 4.8 5.3.8-3.8 3.8.9 5.3-4.8-2.5-4.8 2.5.9-5.3L4.3 8.6l5.3-.8L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
};
