import type { CSSProperties } from "react";
import { cx } from "../lib/cx";

export interface ColorBadgeProps {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  shape?: "rounded" | "pill";
  size?: "sm" | "md";
}

export function ColorBadge({
  label,
  backgroundColor,
  textColor,
  className,
  shape = "rounded",
  size = "sm",
}: ColorBadgeProps) {
  const style: CSSProperties = {
    backgroundColor,
    color: textColor,
  };

  const roundedClass = shape === "pill" ? "rounded-full" : "rounded";
  const textClass = size === "md" ? "text-[11px]" : "text-xs";

  return (
    <span
      className={cx(
        "inline-flex items-center px-2 py-0.5 font-medium whitespace-nowrap",
        roundedClass,
        textClass,
        className
      )}
      style={style}
    >
      {label}
    </span>
  );
}
