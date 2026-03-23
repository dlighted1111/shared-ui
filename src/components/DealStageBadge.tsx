import { ColorBadge } from "./ColorBadge";

export interface DealStageBadgeProps {
  label: string;
  backgroundColor: string;
  textColor: string;
  className?: string;
}

export function DealStageBadge({
  label,
  backgroundColor,
  textColor,
  className,
}: DealStageBadgeProps) {
  return (
    <ColorBadge
      label={label}
      backgroundColor={backgroundColor}
      textColor={textColor}
      className={className}
      shape="rounded"
      size="sm"
    />
  );
}
