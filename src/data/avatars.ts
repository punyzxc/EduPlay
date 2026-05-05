export interface AvatarPreset {
  id: string;
  label: string;
  from: string;
  to: string;
  glyph: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'a1', label: 'Arctic', from: '#0ea5e9', to: '#2563eb', glyph: 'A' },
  { id: 'a2', label: 'Coral', from: '#f97316', to: '#ef4444', glyph: 'B' },
  { id: 'a3', label: 'Mint', from: '#10b981', to: '#06b6d4', glyph: 'C' },
  { id: 'a4', label: 'Grape', from: '#8b5cf6', to: '#6366f1', glyph: 'D' },
  { id: 'a5', label: 'Sunset', from: '#f59e0b', to: '#ec4899', glyph: 'E' },
  { id: 'a6', label: 'Lime', from: '#84cc16', to: '#16a34a', glyph: 'F' },
  { id: 'a7', label: 'Berry', from: '#f43f5e', to: '#be185d', glyph: 'G' },
  { id: 'a8', label: 'Storm', from: '#64748b', to: '#334155', glyph: 'H' },
  { id: 'a9', label: 'Sky', from: '#38bdf8', to: '#0f766e', glyph: 'I' },
  { id: 'a10', label: 'Royal', from: '#4338ca', to: '#0f172a', glyph: 'J' },
  { id: 'a11', label: 'Rose', from: '#fb7185', to: '#7c2d12', glyph: 'K' },
  { id: 'a12', label: 'Ocean', from: '#0ea5e9', to: '#0369a1', glyph: 'L' },
  { id: 'a13', label: 'Neon', from: '#14b8a6', to: '#22c55e', glyph: 'M' },
  { id: 'a14', label: 'Night', from: '#1f2937', to: '#111827', glyph: 'N' },
  { id: 'a15', label: 'Gold', from: '#f59e0b', to: '#b45309', glyph: 'P' },
  { id: 'a16', label: 'Aurora', from: '#06b6d4', to: '#a855f7', glyph: 'Q' },
];

export const getAvatarPreset = (avatarId: string): AvatarPreset =>
  AVATAR_PRESETS.find((avatar) => avatar.id === avatarId) ?? AVATAR_PRESETS[0];

export const getInitials = (username: string): string => {
  const chunks = username
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (chunks.length === 0) {
    return 'EP';
  }

  if (chunks.length === 1) {
    return chunks[0].slice(0, 2).toUpperCase();
  }

  return `${chunks[0][0]}${chunks[1][0]}`.toUpperCase();
};
