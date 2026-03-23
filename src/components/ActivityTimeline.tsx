import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { ActivityTimelineEmptyState } from "./ActivityTimelineEmptyState";

export interface ActivityTimelineProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  loading?: boolean;
  loadingState?: ReactNode;
  emptyState?: ReactNode;
  emptyTitle?: string;
  emptyHint?: string;
  className?: string;
  listClassName?: string;
  belowListAction?: ReactNode;
  footer?: ReactNode;
}

export function ActivityTimeline<T>({
  items,
  renderItem,
  loading = false,
  loadingState,
  emptyState,
  emptyTitle = "No activity yet",
  emptyHint,
  className,
  listClassName,
  belowListAction,
  footer,
}: ActivityTimelineProps<T>) {
  if (loading) {
    return (
      <div className={className}>
        {loadingState ?? (
          <p className="text-sm text-muted-foreground py-3 text-center">Loading...</p>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={className}>
        {emptyState ?? <ActivityTimelineEmptyState title={emptyTitle} hint={emptyHint} />}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={cx(listClassName)}>{items.map((item) => renderItem(item))}</div>
      {belowListAction}
      {footer}
    </div>
  );
}
