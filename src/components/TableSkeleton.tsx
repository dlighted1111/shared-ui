import { cx } from "../lib/cx";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  compact?: boolean;
  className?: string;
  rowClassName?: string;
  cellClassName?: string;
}

export function TableSkeleton({
  rows = 8,
  columns = 6,
  compact = false,
  className,
  rowClassName,
  cellClassName,
}: TableSkeletonProps) {
  const rowHeightClass = compact ? "h-8" : "h-10";

  return (
    <div className={cx("space-y-1", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={cx("flex items-center gap-4 px-4", rowHeightClass, rowClassName)}>
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <div
              key={columnIndex}
              className={cx("h-4 flex-1 animate-pulse rounded bg-muted/60", cellClassName)}
              aria-hidden="true"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
