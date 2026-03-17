import { cx } from "../lib/cx";
import { PageSizeSelector } from "./PageSizeSelector";

export interface ListFooterPaginationProps {
  from: number;
  to: number;
  total: number;
  page: number;
  pageSize: number;
  onPageSizeChange: (nextSize: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious?: boolean;
  canNext?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  hidePageSizeSelector?: boolean;
  className?: string;
  labelClassName?: string;
  controlsClassName?: string;
  pageSizeClassName?: string;
  navClassName?: string;
  navButtonClassName?: string;
}

export function ListFooterPagination({
  from,
  to,
  total,
  page,
  pageSize,
  onPageSizeChange,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
  previousLabel = "Previous",
  nextLabel = "Next",
  hidePageSizeSelector = false,
  className,
  labelClassName,
  controlsClassName,
  pageSizeClassName,
  navClassName,
  navButtonClassName,
}: ListFooterPaginationProps) {
  const prevEnabled = canPrevious ?? page > 0;
  const nextEnabled = canNext ?? to < total;

  return (
    <div
      className={cx(
        "px-8 py-3 border-t border-border flex items-center justify-between",
        className,
      )}
    >
      <span className={cx("text-xs text-muted-foreground", labelClassName)}>
        Showing {from}-{to} of {total}
      </span>
      <div className={cx("flex items-center gap-4", controlsClassName)}>
        {!hidePageSizeSelector && (
          <PageSizeSelector
            value={pageSize}
            onChange={onPageSizeChange}
            className={pageSizeClassName}
          />
        )}
        <div className={cx("flex items-center gap-2", navClassName)}>
          <button
            type="button"
            disabled={!prevEnabled}
            onClick={onPrevious}
            className={cx(
              "h-7 px-2 rounded-md border border-input bg-background text-xs text-foreground disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1",
              navButtonClassName,
            )}
          >
            {previousLabel}
          </button>
          <button
            type="button"
            disabled={!nextEnabled}
            onClick={onNext}
            className={cx(
              "h-7 px-2 rounded-md border border-input bg-background text-xs text-foreground disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-1",
              navButtonClassName,
            )}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
