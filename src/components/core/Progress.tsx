import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
}

function clamp(value: number) {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = 0, className, style, ...props },
  ref,
) {
  const boundedValue = clamp(value);

  const rootStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "9999px",
    background: "var(--lt-color-surface)",
    width: "100%",
    height: "8px",
    ...style,
  };

  const indicatorStyle: CSSProperties = {
    height: "100%",
    width: `${boundedValue}%`,
    background: "var(--lt-color-primary)",
    transition: "width 180ms ease",
  };

  return (
    <div
      {...props}
      ref={ref}
      className={cx(className)}
      style={rootStyle}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={boundedValue}
    >
      <div style={indicatorStyle} />
    </div>
  );
});
