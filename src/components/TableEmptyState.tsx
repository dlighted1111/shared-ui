import type { ReactNode } from "react";
import { cx } from "../lib/cx";

interface SearchIconProps {
  className?: string;
}

function SearchIcon({ className }: SearchIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("h-10 w-10", className)}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
      <path d="m8 8 6 6" />
    </svg>
  );
}

export interface TableEmptyStateProps {
  message?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
  iconClassName?: string;
  messageClassName?: string;
  descriptionClassName?: string;
}

export function TableEmptyState({
  message = "No records found",
  description = "Try adjusting your search or filters.",
  actionLabel,
  onAction,
  action,
  icon,
  className,
  iconClassName,
  messageClassName,
  descriptionClassName,
}: TableEmptyStateProps) {
  const fallbackAction =
    actionLabel && onAction ? (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex h-8 items-center rounded-md border border-input bg-background px-3 text-sm hover:bg-muted"
      >
        {actionLabel}
      </button>
    ) : undefined;

  return (
    <div className={cx("flex flex-col items-center justify-center px-4 py-16", className)}>
      <div className={cx("mb-3 text-muted-foreground/40", iconClassName)}>{icon ?? <SearchIcon />}</div>
      <p className={cx("mb-1 text-sm font-medium text-foreground", messageClassName)}>{message}</p>
      <p className={cx("mb-4 text-xs text-muted-foreground", descriptionClassName)}>{description}</p>
      {action ?? fallbackAction}
    </div>
  );
}
