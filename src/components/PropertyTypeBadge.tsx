import { ColorBadge } from "./ColorBadge";
import { cx } from "../lib/cx";

export interface PropertyTypeBadgeProps {
  label: string;
  backgroundColor: string;
  textColor: string;
  size?: "sm" | "md";
  className?: string;
}

export function PropertyTypeBadge({
  label,
  backgroundColor,
  textColor,
  size = "sm",
  className,
}: PropertyTypeBadgeProps) {
  return (
    <ColorBadge
      label={label}
      backgroundColor={backgroundColor}
      textColor={textColor}
      size={size}
      shape="pill"
      className={cx("capitalize", className)}
    />
  );
}
