// remotion/constants/theme.ts
export const COLORS = {
  bg: '#0a0f1a',
  bgCard: '#111827',
  bgCardHover: '#1f2937',
  bgCardBorder: '#1f2937',
  accent: '#3b82f6',
  accentGlow: 'rgba(59,130,246,0.15)',
  accentBorder: 'rgba(59,130,246,0.3)',
  green: '#10b981',
  greenLight: '#34d399',
  greenGlow: 'rgba(16,185,129,0.2)',
  amber: '#f59e0b',
  amberLight: '#fbbf24',
  red: '#ef4444',
  purple: '#8b5cf6',
  textPrimary: '#f9fafb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  border: '#1f2937',
} as const

export const FONTS = {
  display: '"Plus Jakarta Sans", sans-serif',
  body: '"Inter", sans-serif',
  mono: '"JetBrains Mono", monospace',
} as const

export const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const
