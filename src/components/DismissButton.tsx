import type { ButtonHTMLAttributes } from "react";

export interface DismissButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  glyph?: string;
  glyphClassName?: string;
}

const DEFAULT_BUTTON_CLASS =
  "inline-flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground";
const DEFAULT_GLYPH_CLASS = "text-[12px] leading-none";

export function DismissButton({
  label = "Dismiss",
  glyph = "×",
  className,
  glyphClassName,
  type,
  ...props
}: DismissButtonProps) {
  const resolvedButtonClass = className
    ? `${DEFAULT_BUTTON_CLASS} ${className}`
    : DEFAULT_BUTTON_CLASS;
  const resolvedGlyphClass = glyphClassName
    ? `${DEFAULT_GLYPH_CLASS} ${glyphClassName}`
    : DEFAULT_GLYPH_CLASS;

  return (
    <button type={type ?? "button"} aria-label={label} className={resolvedButtonClass} {...props}>
      <span aria-hidden className={resolvedGlyphClass}>
        {glyph}
      </span>
    </button>
  );
}
