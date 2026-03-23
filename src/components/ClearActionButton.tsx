import type { ButtonHTMLAttributes } from "react";

export interface ClearActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  leadingGlyph?: string;
  glyphClassName?: string;
}

const DEFAULT_BUTTON_CLASS =
  "inline-flex items-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap";
const DEFAULT_GLYPH_CLASS = "text-[12px] leading-none";

export function ClearActionButton({
  label = "Clear",
  leadingGlyph,
  className,
  glyphClassName,
  type,
  children,
  ...props
}: ClearActionButtonProps) {
  const resolvedClassName = className
    ? `${DEFAULT_BUTTON_CLASS} ${className}`
    : DEFAULT_BUTTON_CLASS;
  const resolvedGlyphClassName = glyphClassName
    ? `${DEFAULT_GLYPH_CLASS} ${glyphClassName}`
    : DEFAULT_GLYPH_CLASS;

  return (
    <button type={type ?? "button"} className={resolvedClassName} {...props}>
      {leadingGlyph && (
        <span aria-hidden className={resolvedGlyphClassName}>
          {leadingGlyph}
        </span>
      )}
      {children ?? label}
    </button>
  );
}
