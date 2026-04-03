import type { CSSProperties } from 'react';
import { cx } from '../lib/cx';

export interface ColorBadgeProps {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  shape?: 'rounded' | 'pill';
  size?: 'sm' | 'md';
}

export function ColorBadge({
  label,
  backgroundColor,
  textColor,
  className,
  shape = 'rounded',
  size = 'sm',
}: ColorBadgeProps) {
  const style: CSSProperties = {
    backgroundColor,
    color: textColor,
  };

  const roundedClass = shape === 'pill' ? 'rounded-full' : 'rounded';
  const textClass = size === 'md' ? 'text-[0.9rem]' : 'text-[0.9rem]';

  return (
    <span
      className={cx(
        'inline-flex items-center px-[0.625rem] py-[0.1875rem] font-medium whitespace-nowrap',
        roundedClass,
        textClass,
        className,
      )}
      style={style}
    >
      {label}
    </span>
  );
}
