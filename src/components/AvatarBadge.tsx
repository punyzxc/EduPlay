import React from 'react';
import { getAvatarPreset, getInitials } from '../data/avatars';

interface AvatarBadgeProps {
  avatarId: string;
  username: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
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
      className={[
        'relative inline-flex items-center justify-center rounded-full font-bold text-white shadow-soft-card',
        'border border-white/20 ring-2 ring-black/20',
        sizeClasses[size],
        className,
      ].join(' ')}
      style={{ backgroundImage: `linear-gradient(145deg, ${preset.from}, ${preset.to})` }}
      title={preset.label}
      aria-label={`Avatar ${preset.label}`}
    >
      <span>{initials || preset.glyph}</span>
      <span className="pointer-events-none absolute inset-[3px] rounded-full border border-white/20 opacity-60" />
    </div>
  );
};
