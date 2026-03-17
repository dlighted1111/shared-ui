import type { ReactNode } from "react";
import { cx } from "../lib/cx";

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

type EmptyStateIcon = (props: IconProps) => ReactNode;

export interface EmptyStateProps {
  icon: EmptyStateIcon;
  title?: string;
  description?: string;
  message?: string;
  action?: ReactNode;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  message,
  action,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
}: EmptyStateProps) {
  const resolvedDescription = message ?? description;

  return (
    <div className={cx("flex flex-col items-center justify-center py-16", className)}>
      <Icon size={48} className={cx("text-muted-foreground/40", iconClassName)} />
      {title && <p className={cx("mt-4 text-base font-medium text-foreground", titleClassName)}>{title}</p>}
      {resolvedDescription && (
        <p className={cx("mt-1 text-sm text-muted-foreground", descriptionClassName)}>{resolvedDescription}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
