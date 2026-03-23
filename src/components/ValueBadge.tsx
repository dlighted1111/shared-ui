import type { CSSProperties, ReactNode } from "react";
import { cx } from "../lib/cx";

export interface ValueBadgeProps {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  leadingIcon?: ReactNode;
  className?: string;
}

export function ValueBadge({
  label,
  backgroundColor,
  textColor,
  leadingIcon,
  className,
}: ValueBadgeProps) {
  const style: CSSProperties = {
    backgroundColor,
    color: textColor,
  };

  return (
    <span
      className={cx("inline-flex items-center rounded px-2 py-0.5 text-xs font-medium", className)}
      style={style}
    >
      {leadingIcon ? <span className="mr-1 inline-flex items-center">{leadingIcon}</span> : null}
      {label}
    </span>
  );
}
