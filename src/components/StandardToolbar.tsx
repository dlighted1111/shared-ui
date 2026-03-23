import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../lib/cx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./core/Select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./core/Tooltip";
import { SearchField } from "./SearchField";

export type Density = "comfortable" | "compact";

export interface ColumnOption {
  key: string;
  header: string;
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 text-muted-foreground"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 15V3" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ColumnsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M3 3h18v18H3z" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );
}

function ComfortableIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M3 7h18" />
      <path d="M3 12h18" />
      <path d="M3 17h18" />
    </svg>
  );
}

function CompactIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 8h14" />
      <path d="M5 12h14" />
      <path d="M5 16h14" />
    </svg>
  );
}

export interface StandardToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;

  podFilter: string;
  onPodChange: (val: string) => void;
  podFilterOptions: readonly string[];
  podDisabled?: boolean;
  podDisabledTooltip?: string;

  attentionCount: number;
  attentionActive: boolean;
  onAttentionToggle: () => void;
  onAttentionBadgeClick?: () => void;

  onExport: () => void;

  density: Density;
  onDensityChange: (d: Density) => void;

  allColumns: ColumnOption[];
  visibleColumns: string[];
  onVisibleColumnsChange: (cols: string[]) => void;

  viewToggle?: ReactNode;

  hasActiveFilters?: boolean;
  onClearAllFilters?: () => void;

  onSearchEnter?: (query: string) => void;
  onSearchCleared?: () => void;
  onPodFilterApplied?: (value: string) => void;
  onAttentionToggled?: (nextState: boolean) => void;
  onExportClick?: () => void;
  onClearAllFiltersClick?: () => void;

  searchIcon?: ReactNode;
  exportIcon?: ReactNode;
  attentionIcon?: ReactNode;
  columnsIcon?: ReactNode;
  densityComfortableIcon?: ReactNode;
  densityCompactIcon?: ReactNode;
}

function DensityToggle({
  density,
  onDensityChange,
  comfortableIcon,
  compactIcon,
}: {
  density: Density;
  onDensityChange: (d: Density) => void;
  comfortableIcon?: ReactNode;
  compactIcon?: ReactNode;
}) {
  const next = density === "comfortable" ? "compact" : "comfortable";
  const label =
    density === "comfortable"
      ? "Switch to Compact"
      : "Switch to Comfortable";
  const icon =
    density === "comfortable"
      ? comfortableIcon ?? <ComfortableIcon />
      : compactIcon ?? <CompactIcon />;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onDensityChange(next)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted/50 flex-shrink-0"
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ColumnSelector({
  columns,
  visibleColumns,
  onVisibleColumnsChange,
  icon,
}: {
  columns: ColumnOption[];
  visibleColumns: string[];
  onVisibleColumnsChange: (cols: string[]) => void;
  icon?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted/50"
            >
              {icon ?? <ColumnsIcon />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Columns</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] w-[200px] max-h-[320px] overflow-y-auto rounded border border-border bg-background p-3 z-50">
          <p className="text-xs font-medium mb-2">Visible Columns</p>
          <div className="space-y-1.5">
            {columns.map((col) => {
              const checked = visibleColumns.includes(col.key);
              const disabled = checked && visibleColumns.length <= 2;
              return (
                <label
                  key={col.key}
                  className={cx(
                    "flex items-center gap-2 text-xs cursor-pointer py-[3px]",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => {
                      if (disabled) return;
                      onVisibleColumnsChange(
                        checked
                          ? visibleColumns.filter((k) => k !== col.key)
                          : [...visibleColumns, col.key]
                      );
                    }}
                    className="h-3.5 w-3.5 rounded border-border accent-foreground"
                  />
                  {col.header}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function StandardToolbar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  podFilter,
  onPodChange,
  podFilterOptions,
  podDisabled,
  podDisabledTooltip,
  attentionCount,
  attentionActive,
  onAttentionToggle,
  onAttentionBadgeClick,
  onExport,
  density,
  onDensityChange,
  allColumns,
  visibleColumns,
  onVisibleColumnsChange,
  viewToggle,
  hasActiveFilters,
  onClearAllFilters,
  onSearchEnter,
  onSearchCleared,
  onPodFilterApplied,
  onAttentionToggled,
  onExportClick,
  onClearAllFiltersClick,
  searchIcon,
  exportIcon,
  attentionIcon,
  columnsIcon,
  densityComfortableIcon,
  densityCompactIcon,
}: StandardToolbarProps) {
  const handleSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return;
      const query = searchTerm.trim();
      if (!query) return;
      onSearchEnter?.(query);
    },
    [onSearchEnter, searchTerm]
  );

  const handleClearSearch = useCallback(() => {
    onSearchChange("");
    onSearchCleared?.();
  }, [onSearchChange, onSearchCleared]);

  const handlePodChange = useCallback(
    (value: string) => {
      onPodChange(value);
      onPodFilterApplied?.(value);
    },
    [onPodChange, onPodFilterApplied]
  );

  const handleAttentionToggle = useCallback(() => {
    const nextState = !attentionActive;
    onAttentionToggle();
    onAttentionToggled?.(nextState);
  }, [attentionActive, onAttentionToggle, onAttentionToggled]);

  const handleExportClick = useCallback(() => {
    onExport();
    onExportClick?.();
  }, [onExport, onExportClick]);

  const handleClearAllFilters = useCallback(() => {
    onClearAllFilters?.();
    onClearAllFiltersClick?.();
  }, [onClearAllFilters, onClearAllFiltersClick]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <SearchField
          value={searchTerm}
          onValueChange={onSearchChange}
          onClear={handleClearSearch}
          onKeyDown={handleSearchKeyDown}
          placeholder={searchPlaceholder}
          leading={searchIcon ?? <SearchIcon />}
          containerClassName="flex-1 min-w-[160px] max-w-[400px]"
          inputClassName="h-9 text-[13px] pl-9 pr-9"
          clearButtonClassName="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          clearGlyphClassName="text-[14px] leading-none"
        />

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select
                  value={podFilter}
                  onValueChange={handlePodChange}
                  disabled={podDisabled}
                >
                  <SelectTrigger className="h-9 w-[140px] gap-1.5 text-[13px] flex-shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {podFilterOptions.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {podDisabled
                ? podDisabledTooltip || "Pod data not available"
                : "Filter by Pod"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <button
          type="button"
          onClick={handleAttentionToggle}
          className={cx(
            "inline-flex items-center gap-1.5 h-9 px-3 rounded-md border text-[13px] font-medium flex-shrink-0 whitespace-nowrap",
            attentionActive
              ? "border-[#DC2626] bg-[#FEF2F2] text-[#DC2626]"
              : "border-border bg-background text-foreground hover:bg-muted/50"
          )}
        >
          {attentionIcon ?? <AlertIcon />}
          {attentionCount > 0 ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onAttentionBadgeClick?.();
              }}
              className={cx(
                "inline-flex items-center justify-center rounded-full min-w-[20px] h-5 px-1 text-[11px] font-bold cursor-pointer",
                attentionActive
                  ? "bg-[#DC2626] text-white"
                  : "bg-muted-foreground text-background"
              )}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {attentionCount}
            </span>
          ) : null}
        </button>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted/50 flex-shrink-0"
                onClick={handleExportClick}
              >
                {exportIcon ?? <DownloadIcon />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Export</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-2">
        <DensityToggle
          density={density}
          onDensityChange={onDensityChange}
          comfortableIcon={densityComfortableIcon}
          compactIcon={densityCompactIcon}
        />

        {viewToggle}
        <div className="flex-1" />

        {hasActiveFilters && onClearAllFilters ? (
          <button
            onClick={handleClearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            Clear all filters
          </button>
        ) : null}

        <ColumnSelector
          columns={allColumns}
          visibleColumns={visibleColumns}
          onVisibleColumnsChange={onVisibleColumnsChange}
          icon={columnsIcon}
        />
      </div>
    </div>
  );
}
