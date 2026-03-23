import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      className={cx(className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "9999px",
        border: "1px solid var(--lt-color-border)",
        background: "var(--lt-color-surface)",
        color: "var(--lt-color-text)",
        fontSize: "var(--lt-font-size-xs)",
        fontWeight: 600,
        lineHeight: 1,
        padding: "4px 8px",
      }}
    />
  );
});
