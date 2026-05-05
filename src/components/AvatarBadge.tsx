import React from 'react';
import { getAvatarPreset, getInitials } from '../data/avatars';

interface AvatarBadgeProps {
  avatarId: string;
  username: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
} as const;

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  avatarId,
  username,
  size = 'md',
  className = '',
}) => {
  const preset = getAvatarPreset(avatarId);
  const initials = getInitials(username);

  return (
    <div
      className={`rounded-full font-bold text-white flex items-center justify-center shadow-lg border border-white/20 ${sizeClasses[size]} ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${preset.from}, ${preset.to})` }}
      title={preset.label}
      aria-label={`Avatar ${preset.label}`}
    >
      {initials || preset.glyph}
    </div>
  );
};
