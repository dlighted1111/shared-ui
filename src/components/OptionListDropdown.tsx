import { useMemo, useState, type CSSProperties } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./core/DropdownMenu";
import { SearchField } from "./SearchField";
import { STATUS_PILL_COLORS, type StatusColor } from "./StatusPill";

type TriggerVariant = "tailwind" | "chrome";
type ColorVariant = "default" | "soft";

export interface OptionListDropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: StatusColor;
  colorHex?: string;
}

export interface OptionListDropdownProps {
  value: string;
  options: readonly OptionListDropdownOption[];
  onValueChange: (value: string) => void;
  title?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  triggerVariant?: TriggerVariant;
  variant?: "default" | "no-search";
  size?: "default" | "compact";
  chromeButtonStyle?: object;
  disabled?: boolean;
  className?: string;
  textAlign?: "left" | "right";
  colorVariant?: ColorVariant;
}

function hexToRgba(hex: string, alpha: number): string | null {
  const normalized = hex.trim();
  const shortHexMatch = /^#([0-9a-fA-F]{3})$/;
  const fullHexMatch = /^#([0-9a-fA-F]{6})$/;

  const shortMatch = normalized.match(shortHexMatch);
  if (shortMatch) {
    const chars = shortMatch[1].split("");
    const expanded = chars.map((char) => `${char}${char}`).join("");
    const r = parseInt(expanded.slice(0, 2), 16);
    const g = parseInt(expanded.slice(2, 4), 16);
    const b = parseInt(expanded.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const fullMatch = normalized.match(fullHexMatch);
  if (fullMatch) {
    const value = fullMatch[1];
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return null;
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OptionListDropdown({
  value,
  options,
  onValueChange,
  title,
  placeholder = "Select option",
  searchPlaceholder = "Search",
  triggerVariant = "tailwind",
  variant = "default",
  size = "default",
  chromeButtonStyle,
  disabled = false,
  className,
  textAlign = "left",
  colorVariant = "default",
}: OptionListDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const isChromeVariant = triggerVariant === "chrome";
  const showSearch = variant !== "no-search";
  const isCompact = size === "compact";
  const hasTitle = Boolean(title && title.trim().length > 0);
  const isRightAligned = textAlign === "right";
  const isSoftColorVariant = colorVariant === "soft";

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    if (!showSearch || !normalizedSearch) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch, options, showSearch]);

  const selectedSoftStyle = useMemo<CSSProperties | undefined>(() => {
    if (!isSoftColorVariant || !selectedOption) return undefined;
    if (selectedOption.color) {
      const palette = STATUS_PILL_COLORS[selectedOption.color] ?? STATUS_PILL_COLORS.gray;
      return {
        borderColor: "transparent",
        backgroundColor: palette.bg,
        color: palette.text,
      };
    }
    if (!selectedOption.colorHex) return undefined;
    const borderColor = hexToRgba(selectedOption.colorHex, 0.2);
    const bgColor = hexToRgba(selectedOption.colorHex, 0.1);
    if (!borderColor || !bgColor) return undefined;
    return {
      borderColor,
      backgroundColor: bgColor,
      color: selectedOption.colorHex,
    };
  }, [isSoftColorVariant, selectedOption]);

  const triggerStyle = isChromeVariant
    ? ({
        ...(selectedSoftStyle ?? {}),
        ...(chromeButtonStyle ?? {}),
        padding: isCompact ? "6px 8px" : "8px 10px",
        minWidth: isCompact ? 180 : 220,
      } as CSSProperties)
    : selectedSoftStyle;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={
            isChromeVariant
              ? className
              : `inline-flex ${isCompact ? "h-7 min-w-[180px] px-2.5 text-[12px]" : "h-8 min-w-[220px] px-3 text-[13px]"} items-center justify-between gap-1.5 rounded-md border border-border bg-background hover:bg-muted/50 ${
                  isRightAligned ? "text-right" : ""
                } ${
                  className ?? ""
                }`
          }
          style={triggerStyle}
          disabled={disabled}
        >
          <span className={`truncate ${isRightAligned ? "text-right" : ""}`}>
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDownIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isRightAligned ? "end" : "start"}
        collisionPadding={8}
        className="flex max-w-[min(90vw,32rem)] min-w-[var(--radix-dropdown-menu-trigger-width)] flex-col overflow-hidden p-0"
        style={{ maxHeight: "min(60vh, var(--radix-dropdown-menu-content-available-height))" }}
      >
        {hasTitle ? (
          <div className="border-b border-border px-3 py-2">
            <div className={`${isCompact ? "text-[10px]" : "text-[11px]"} font-semibold uppercase tracking-wide text-muted-foreground`}>
              {title}
            </div>
          </div>
        ) : null}
        {showSearch ? (
          <div className="border-b border-border p-2">
            <SearchField
              value={searchTerm}
              onValueChange={setSearchTerm}
              debounceMs={0}
              placeholder={searchPlaceholder}
              containerClassName="w-full"
              inputClassName={isCompact ? "h-8 text-[12px]" : "h-[34px] text-[13px]"}
            />
          </div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              No options found.
            </div>
          ) : (
            <div className="space-y-0">
              {filteredOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  disabled={option.disabled}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                  className={`rounded-md ${isCompact ? "px-2 py-1 text-[12px]" : "px-2 py-1.5 text-[13px]"} ${
                    isRightAligned ? "justify-end text-right" : ""
                  } ${
                    isSoftColorVariant
                      ? "border border-transparent"
                      : option.value === value
                        ? "bg-accent text-accent-foreground"
                        : ""
                  }`}
                  style={
                    isSoftColorVariant
                      ? option.color
                        ? {
                            color:
                              (STATUS_PILL_COLORS[option.color] ?? STATUS_PILL_COLORS.gray)
                                .text,
                            backgroundColor:
                              (STATUS_PILL_COLORS[option.color] ?? STATUS_PILL_COLORS.gray)
                                .bg,
                            borderColor:
                              option.value === value
                                ? (
                                    hexToRgba(
                                      (STATUS_PILL_COLORS[option.color] ??
                                        STATUS_PILL_COLORS.gray).text,
                                      0.2
                                    ) ?? "transparent"
                                  )
                                : "transparent",
                          }
                        : option.colorHex
                          ? {
                              color: option.colorHex,
                              backgroundColor:
                                option.value === value
                                  ? (hexToRgba(option.colorHex, 0.12) ?? undefined)
                                  : (hexToRgba(option.colorHex, 0.08) ?? undefined),
                              borderColor:
                                option.value === value
                                  ? (hexToRgba(option.colorHex, 0.2) ?? undefined)
                                  : "transparent",
                            }
                          : undefined
                      : undefined
                  }
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
