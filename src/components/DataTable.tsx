import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cx } from "../lib/cx";
import { EmptyState } from "./EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./core/Select";
import { Skeleton } from "./core/Skeleton";

export interface DataTableColumnDef<T extends Record<string, unknown>> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  frozen?: boolean;
  minWidth?: number;
  render?: (row: T) => ReactNode;
}

export interface DataTableFilterDef {
  key: string;
  label: string;
  value: string;
}

export type DataTableDensity = "comfortable" | "compact";
export type DataTableSortDirection = "asc" | "desc";

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumnDef<T>[];
  data: T[];
  filters?: DataTableFilterDef[];
  onRemoveFilter?: (key: string) => void;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  frozenColumns?: number;
  density?: DataTableDensity;
  sortKey?: string | null;
  sortDir?: DataTableSortDirection;
  onSortChange?: (
    sortKey: string | null,
    sortDir: DataTableSortDirection
  ) => void;
  renderColumnMeta?: (column: DataTableColumnDef<T>) => ReactNode;
  getRowKey?: (row: T, index: number) => string | number;
}

const ROW_HEIGHTS: Record<DataTableDensity, string> = {
  comfortable: "h-[48px]",
  compact: "h-[36px]",
};

const CELL_PADDING: Record<DataTableDensity, string> = {
  comfortable: "px-3 py-2",
  compact: "px-3 py-1",
};

const CELL_FONT: Record<DataTableDensity, string> = {
  comfortable: "text-[13px]",
  compact: "text-xs",
};

const HEADER_HEIGHT: Record<DataTableDensity, string> = {
  comfortable: "h-10",
  compact: "h-8",
};

function inferColumnMinWidth(column: DataTableColumnDef<Record<string, unknown>>): number {
  const label = `${column.header} ${column.key}`.toLowerCase();

  if (label.includes("property") || label.includes("unit address") || label.includes("address")) return 180;
  if (label.includes("unit") || label.includes("name") || label.includes("tenant")) return 130;
  if (label.includes("type") || label.includes("status") || label.includes("phase")) return 120;
  if (label.includes("street")) return 160;
  if (label.includes("city") || label.includes("state")) return 100;
  if (label.includes("beds") || label.includes("baths") || label === "bed" || label === "bath") return 70;
  if (label.includes("sq ft") || label.includes("sqft")) return 80;
  if (label.includes("rent") || label.includes("market") || label.includes("advertised")) return 120;
  if (
    label.includes("listed") ||
    label.includes("certified") ||
    label.includes("collections") ||
    label.includes("boolean") ||
    label.includes("active") ||
    label.includes("hidden")
  ) {
    return 80;
  }
  return 100;
}

function SortUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function SortDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="m5 12 7 7 7-7" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SortNeutralIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-30 shrink-0"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="m8 7 4-4 4 4" />
      <path d="M12 3v18" />
      <path d="m8 17 4 4 4-4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="12"
      height="12"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function FileTextIcon({
  size = 48,
  className,
  strokeWidth = 2,
}: {
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  filters,
  onRemoveFilter,
  onRowClick,
  rowClassName,
  loading = false,
  emptyMessage = "No data found.",
  pageSize: initialPageSize = 25,
  pageSizeOptions = [25, 50, 100],
  frozenColumns,
  density: externalDensity,
  sortKey,
  sortDir,
  onSortChange,
  renderColumnMeta,
  getRowKey,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [internalDensity] = useState<DataTableDensity>("comfortable");
  const [internalSortKey, setInternalSortKey] = useState<string | null>(null);
  const [internalSortDir, setInternalSortDir] =
    useState<DataTableSortDirection>("asc");

  const density = externalDensity ?? internalDensity;
  const resolvedSortKey =
    sortKey === undefined ? internalSortKey : sortKey ?? null;
  const resolvedSortDir = sortDir ?? internalSortDir;

  const setSortState = useCallback(
    (key: string | null, dir: DataTableSortDirection) => {
      if (onSortChange) {
        onSortChange(key, dir);
        return;
      }
      setInternalSortKey(key);
      setInternalSortDir(dir);
    },
    [onSortChange]
  );

  const handleSort = useCallback(
    (key: string) => {
      if (resolvedSortKey === key) {
        if (resolvedSortDir === "asc") {
          setSortState(key, "desc");
        } else {
          setSortState(null, "asc");
        }
      } else {
        setSortState(key, "asc");
      }
      setPage(0);
    },
    [resolvedSortDir, resolvedSortKey, setSortState]
  );

  const resolvedColumns = useMemo(() => {
    if (frozenColumns != null) {
      return columns.map((column, index) => ({
        ...column,
        frozen: index < frozenColumns,
      }));
    }
    return columns;
  }, [columns, frozenColumns]);

  const columnMinWidths = useMemo(
    () =>
      resolvedColumns.map(
        (column) =>
          column.minWidth ??
          inferColumnMinWidth(column as DataTableColumnDef<Record<string, unknown>>)
      ),
    [resolvedColumns]
  );

  const frozenOffsets = useMemo(() => {
    const offsets: number[] = [];
    let total = 0;
    resolvedColumns.forEach((column, index) => {
      offsets.push(total);
      if (column.frozen) {
        total += columnMinWidths[index];
      }
    });
    return offsets;
  }, [columnMinWidths, resolvedColumns]);

  const lastFrozenIndex = useMemo(() => {
    let last = -1;
    resolvedColumns.forEach((column, index) => {
      if (column.frozen) last = index;
    });
    return last;
  }, [resolvedColumns]);

  const sorted = useMemo(() => {
    if (!resolvedSortKey) return data;
    return [...data].sort((a, b) => {
      const aValue = a[resolvedSortKey];
      const bValue = b[resolvedSortKey];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      const cmp = String(aValue).localeCompare(String(bValue), undefined, {
        numeric: true,
      });
      return resolvedSortDir === "asc" ? cmp : -cmp;
    });
  }, [data, resolvedSortDir, resolvedSortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const showFrom = sorted.length === 0 ? 0 : page * pageSize + 1;
  const showTo = Math.min((page + 1) * pageSize, sorted.length);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  const frozenCellStyle = (index: number): CSSProperties => ({
    ...(resolvedColumns[index]?.frozen
      ? {
          position: "sticky",
          left: frozenOffsets[index],
          zIndex: 1,
        }
      : {}),
    minWidth: columnMinWidths[index],
    width: resolvedColumns[index]?.width,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  });

  const frozenHeaderStyle = (index: number): CSSProperties => ({
    ...(resolvedColumns[index]?.frozen
      ? {
          position: "sticky",
          left: frozenOffsets[index],
          zIndex: 11,
        }
      : {}),
    minWidth: columnMinWidths[index],
    width: resolvedColumns[index]?.width,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  });

  const frozenCellClass = (index: number) =>
    resolvedColumns[index]?.frozen
      ? cx(
          "bg-background",
          index === lastFrozenIndex && "border-r border-border"
        )
      : "";

  const frozenHeaderCellClass = (index: number) =>
    resolvedColumns[index]?.frozen
      ? cx(
          "bg-muted",
          index === lastFrozenIndex && "border-r border-border"
        )
      : "";

  if (loading) {
    const skeletonRows = density === "compact" ? 12 : 8;
    return (
      <div className="w-full overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm" style={{ width: "100%", tableLayout: "auto" }}>
          <thead className="sticky top-0 z-10 bg-muted">
            <tr className="border-b border-border">
              {resolvedColumns.map((column, index) => (
                <th
                  key={column.key}
                  className={cx(
                    HEADER_HEIGHT[density],
                    CELL_PADDING[density],
                    "text-left text-xs font-medium text-muted-foreground",
                    frozenHeaderCellClass(index)
                  )}
                  style={frozenHeaderStyle(index)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={cx(
                  ROW_HEIGHTS[density],
                  "border-b border-border last:border-0"
                )}
              >
                {resolvedColumns.map((column, colIndex) => (
                  <td
                    key={column.key}
                    className={cx(
                      CELL_PADDING[density],
                      frozenCellClass(colIndex),
                      "bg-background"
                    )}
                    style={frozenCellStyle(colIndex)}
                  >
                    <Skeleton
                      className="h-3.5 rounded"
                      style={{
                        width:
                          colIndex === 0
                            ? "70%"
                            : colIndex === resolvedColumns.length - 1
                            ? "40%"
                            : "55%",
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      {filters && filters.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-xs text-foreground"
            >
              <span className="text-muted-foreground">{filter.label}:</span>{" "}
              {filter.value}
              {onRemoveFilter ? (
                <button
                  onClick={() => onRemoveFilter(filter.key)}
                  className="ml-0.5 hover:text-destructive"
                >
                  <CloseIcon />
                </button>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}

      {paged.length === 0 ? (
        <EmptyState
          icon={FileTextIcon}
          message={
            filters && filters.length > 0
              ? "No items match your filters"
              : emptyMessage
          }
          action={
            filters && filters.length > 0 && onRemoveFilter ? (
              <button
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                onClick={() => filters.forEach((filter) => onRemoveFilter(filter.key))}
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="w-full overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm border-collapse" style={{ width: "100%", tableLayout: "auto" }}>
            <thead className="sticky top-0 z-10 bg-muted">
              <tr className="border-b border-border">
                {resolvedColumns.map((column, colIndex) => (
                  <th
                    key={column.key}
                    className={cx(
                      HEADER_HEIGHT[density],
                      CELL_PADDING[density],
                      "text-left text-xs font-medium text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis",
                      column.sortable && "cursor-pointer select-none",
                      frozenHeaderCellClass(colIndex)
                    )}
                    style={frozenHeaderStyle(colIndex)}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <span className="inline-flex items-center gap-1 max-w-full overflow-hidden">
                      <span className="truncate">{column.header}</span>
                      {renderColumnMeta?.(column)}
                      {column.sortable ? (
                        resolvedSortKey === column.key ? (
                          resolvedSortDir === "asc" ? (
                            <SortUpIcon />
                          ) : (
                            <SortDownIcon />
                          )
                        ) : (
                          <SortNeutralIcon />
                        )
                      ) : null}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((row, rowIndex) => (
                <tr
                  key={getRowKey ? getRowKey(row, rowIndex) : rowIndex}
                  className={cx(
                    ROW_HEIGHTS[density],
                    "border-0 transition-colors duration-150 hover:bg-muted/50",
                    onRowClick && "cursor-pointer",
                    rowClassName?.(row)
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {resolvedColumns.map((column, colIndex) => (
                    <td
                      key={column.key}
                      className={cx(
                        CELL_PADDING[density],
                        CELL_FONT[density],
                        "align-middle whitespace-nowrap overflow-hidden text-ellipsis",
                        frozenCellClass(colIndex)
                      )}
                      style={frozenCellStyle(colIndex)}
                    >
                      <span className="block truncate">
                        {column.render
                          ? column.render(row)
                          : (row[column.key] as ReactNode)}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sorted.length > 0 ? (
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {showFrom}-{showTo} of {sorted.length}
          </span>
          <div className="flex items-center gap-2">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(0);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              className="h-8 px-3 rounded-md border border-border bg-background text-xs text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
              className="h-8 px-3 rounded-md border border-border bg-background text-xs text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
