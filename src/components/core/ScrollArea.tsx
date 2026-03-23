import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {}

export interface ScrollBarProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { className, children, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={cx("relative overflow-hidden", className)}>
      <div className="h-full w-full rounded-[inherit] overflow-auto">{children}</div>
    </div>
  );
});

export const ScrollBar = forwardRef<HTMLDivElement, ScrollBarProps>(function ScrollBar(
  { className, orientation = "vertical", ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      data-orientation={orientation}
      className={cx(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className,
      )}
    >
      <div className="relative flex-1 rounded-full bg-border" />
    </div>
  );
});
