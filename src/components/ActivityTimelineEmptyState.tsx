import { cx } from "../lib/cx";

export interface ActivityTimelineEmptyStateProps {
  title: string;
  hint?: string;
  className?: string;
}

export function ActivityTimelineEmptyState({
  title,
  hint,
  className,
}: ActivityTimelineEmptyStateProps) {
  return (
    <div className={cx("py-4 text-center", className)}>
      <p className="text-sm text-muted-foreground">{title}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
