import { ColorBadge } from "./ColorBadge";

export interface LeadSourceBadgeProps {
  label: string;
  backgroundColor: string;
  textColor: string;
  className?: string;
}

export function LeadSourceBadge({
  label,
  backgroundColor,
  textColor,
  className,
}: LeadSourceBadgeProps) {
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
