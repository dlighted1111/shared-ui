import { useEffect, useState, type Key, type ReactNode } from "react";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Skeleton,
} from "./core";

export interface ChangelogTimelineProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: T[];
  renderItem: (item: T) => ReactNode;
  getItemKey?: (item: T, index: number) => Key;
  loading?: boolean;
  title?: ReactNode;
  totalCount?: number;
  visibleCount?: number;
  emptyLabel?: ReactNode;
  showAllLabel?: (total: number) => ReactNode;
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function ChangelogTimeline<T>({
  open,
  onOpenChange,
  items,
  renderItem,
  getItemKey,
  loading = false,
  title = "History",
  totalCount: totalCountProp,
  visibleCount = 5,
  emptyLabel = "No history recorded",
  showAllLabel,
}: ChangelogTimelineProps<T>) {
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowAll(false);
    }
  }, [open]);

  const totalCount = totalCountProp ?? items.length;
  const displayItems = showAll ? items : items.slice(0, visibleCount);

  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full group">
        {open ? (
          <span className="text-muted-foreground">
            <ChevronDownIcon />
          </span>
        ) : (
          <span className="text-muted-foreground">
            <ChevronRightIcon />
          </span>
        )}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {totalCount > 0 ? (
          <span className="text-xs text-muted-foreground">({totalCount})</span>
        ) : null}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3 space-y-2">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full rounded" />
              ))}
            </div>
          ) : displayItems.length === 0 ? (
            <p className="text-xs text-muted-foreground py-3 text-center">
              {emptyLabel}
            </p>
          ) : (
            <>
              {displayItems.map((item, index) => (
                <div key={getItemKey ? getItemKey(item, index) : index}>
                  {renderItem(item)}
                </div>
              ))}
              {!showAll && totalCount > visibleCount ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs h-7"
                  onClick={() => setShowAll(true)}
                >
                  {showAllLabel ? showAllLabel(totalCount) : `Show all (${totalCount})`}
                </Button>
              ) : null}
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
