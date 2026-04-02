import {
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
  type SVGProps,
} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./core/DropdownMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./core/Tooltip";
import { SearchField } from "./SearchField";

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="8" strokeWidth="2" />
      <path d="m21 21-4.3-4.3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z"
        strokeWidth="2"
      />
      <path
        d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.8 1.8 0 1 1-2.5 2.5l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1.8 1.8 0 1 1-3.6 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a1.8 1.8 0 1 1 0-3.6h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.8 1.8 0 1 1 2.5-2.5l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1.8 1.8 0 1 1 3.6 0v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.8 1.8 0 1 1 2.5 2.5l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a1.8 1.8 0 1 1 0 3.6h-.1a1 1 0 0 0-.9.6Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface ColumnVisibilityOption {
  key: string;
  label: string;
}

type PickerVariant = "tailwind" | "chrome";

export interface ColumnVisibilityPickerProps {
  columns: readonly ColumnVisibilityOption[];
  visibleColumns: string[];
  onVisibleColumnsChange: (nextColumns: string[]) => void;
  minVisibleColumns?: number;
  disabledKeys?: readonly string[];
  triggerVariant?: PickerVariant;
  triggerIcon?: ReactNode;
  showCountInTrigger?: boolean;
  chromeButtonStyle?: object;
  searchPlaceholder?: string;
}

export function ColumnVisibilityPicker({
  columns,
  visibleColumns,
  onVisibleColumnsChange,
  minVisibleColumns = 2,
  disabledKeys,
  triggerVariant = "tailwind",
  triggerIcon,
  showCountInTrigger = true,
  chromeButtonStyle,
  searchPlaceholder = "Search",
}: ColumnVisibilityPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const disabledKeySet = useMemo(
    () => new Set((disabledKeys ?? []).map((key) => String(key ?? "").trim())),
    [disabledKeys]
  );

  const filteredColumns = useMemo(() => {
    if (!normalizedSearch) return columns;
    return columns.filter((column) =>
      column.label.toLowerCase().includes(normalizedSearch)
    );
  }, [columns, normalizedSearch]);

  const isChromeVariant = triggerVariant === "chrome";
  const menuMaxHeight =
    "min(60vh, var(--radix-dropdown-menu-content-available-height))";
  const listMaxHeight =
    "max(0px, calc(min(60vh, var(--radix-dropdown-menu-content-available-height)) - 52px))";
  const triggerStyle = isChromeVariant
    ? ({ ...(chromeButtonStyle ?? {}), padding: "8px 10px" } as CSSProperties)
    : undefined;

  const trigger = (
    <button
      type="button"
      className={
        isChromeVariant
          ? undefined
          : showCountInTrigger
            ? "h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-border bg-background hover:bg-muted/50 flex-shrink-0"
            : "h-8 w-8 inline-flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted/50 flex-shrink-0"
      }
      style={triggerStyle}
    >
      {triggerIcon ?? <SettingsIcon className="h-4 w-4" />}
      {showCountInTrigger ? (
        <span
          style={
            isChromeVariant
              ? { fontSize: 10, color: "var(--muted-foreground)" }
              : undefined
          }
          className={
            isChromeVariant ? undefined : "text-[10px] text-muted-foreground"
          }
        >
          ({visibleColumns.length})
        </span>
      ) : null}
    </button>
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Columns</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent
        align="end"
        collisionPadding={8}
        className="w-[220px] p-0 overflow-hidden"
        style={{ maxHeight: menuMaxHeight }}
      >
        <div className="p-2 border-b border-border">
          <SearchField
            value={searchTerm}
            onValueChange={setSearchTerm}
            debounceMs={0}
            placeholder={searchPlaceholder}
            leading={<SearchIcon className="h-3.5 w-3.5 text-muted-foreground" />}
            containerClassName="w-full"
            inputClassName="h-[34px] text-[13px]"
          />
        </div>
        <div className="overflow-y-auto py-1" style={{ maxHeight: listMaxHeight }}>
          {filteredColumns.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              No columns found.
            </div>
          ) : (
            filteredColumns.map((column) => {
              const checked = visibleColumns.includes(column.key);
              const hardDisabled = disabledKeySet.has(column.key);
              const minimumDisabled =
                checked && visibleColumns.length <= minVisibleColumns;
              const disabled = hardDisabled || minimumDisabled;
              return (
                <label
                  key={column.key}
                  className={`flex items-center gap-2 text-xs py-[6px] px-3 ${
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => {
                      if (disabled) return;
                      onVisibleColumnsChange(
                        checked
                          ? visibleColumns.filter((key) => key !== column.key)
                          : [...visibleColumns, column.key]
                      );
                    }}
                    className="h-3.5 w-3.5 rounded border-border accent-foreground"
                  />
                  {column.label}
                </label>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
