import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", decorative = true, className, style, ...props },
  ref,
) {
  const separatorStyle: CSSProperties = {
    flexShrink: 0,
    background: "var(--lt-color-border)",
    width: orientation === "horizontal" ? "100%" : "1px",
    height: orientation === "horizontal" ? "1px" : "100%",
    ...style,
  };

  return (
    <div
      {...props}
      ref={ref}
      className={cx(className)}
      style={separatorStyle}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
    />
  );
});
