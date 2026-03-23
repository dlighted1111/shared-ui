import type { ReactNode } from "react";
import { DismissButton } from "./DismissButton";

export interface FilterPillListItem {
  key: string;
  label: ReactNode;
  onRemove?: () => void;
}

export interface FilterPillListProps {
  pills: FilterPillListItem[];
  className?: string;
  pillClassName?: string;
  removeButtonClassName?: string;
  removeGlyphClassName?: string;
}

const DEFAULT_LIST_CLASS = "flex flex-wrap items-center gap-2";
const DEFAULT_PILL_CLASS =
  "inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground";
const DEFAULT_REMOVE_BUTTON_CLASS = "transition-colors hover:text-destructive";
const DEFAULT_REMOVE_GLYPH_CLASS = "text-[12px] leading-none";

export function FilterPillList({
  pills,
  className,
  pillClassName,
  removeButtonClassName,
  removeGlyphClassName,
}: FilterPillListProps) {
  if (pills.length === 0) return null;

  const listClassName = className ?? DEFAULT_LIST_CLASS;
  const itemClassName = pillClassName ?? DEFAULT_PILL_CLASS;
  const dismissClassName = removeButtonClassName ?? DEFAULT_REMOVE_BUTTON_CLASS;
  const glyphClassName = removeGlyphClassName ?? DEFAULT_REMOVE_GLYPH_CLASS;

  return (
    <div className={listClassName}>
      {pills.map((pill) => (
        <span key={pill.key} className={itemClassName}>
          {pill.label}
          {pill.onRemove && (
            <DismissButton
              onClick={pill.onRemove}
              className={dismissClassName}
              glyphClassName={glyphClassName}
              label="Remove filter"
            />
          )}
        </span>
      ))}
    </div>
  );
}
