import { cx } from '../lib/cx';

export const STATUS_PILL_COLORS = {
  gray: { text: '#9B9A97', bg: '#F1F1EF' },
  brown: { text: '#64473A', bg: '#E9E5E3' },
  orange: { text: '#D9730D', bg: '#FAEBDD' },
  yellow: { text: '#DFAB01', bg: '#FBF3DB' },
  green: { text: '#0F7B6C', bg: '#DDEDEA' },
  blue: { text: '#0B6E99', bg: '#DDEBF1' },
  purple: { text: '#6940A5', bg: '#EAE4F2' },
  pink: { text: '#AD1A72', bg: '#F4DFEB' },
  red: { text: '#E03E3E', bg: '#FBE4E4' },
  black: { text: '#FFFFFF', bg: '#1A1A1A' },
  mint: { text: '#15803D', bg: '#DCFCE7' },
} as const;

export type StatusColor = keyof typeof STATUS_PILL_COLORS;

export interface StatusPillProps {
  label: string;
  color?: StatusColor;
  className?: string;
}

export function StatusPill({
  label,
  color = 'gray',
  className,
}: StatusPillProps) {
  const colors = STATUS_PILL_COLORS[color] ?? STATUS_PILL_COLORS.gray;

  return (
    <span
      className={cx(
        'inline-flex items-center rounded-[4px] px-[0.625rem] py-[0.1875rem] text-[0.9rem] font-medium whitespace-nowrap',
        className,
      )}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {label}
    </span>
  );
}
