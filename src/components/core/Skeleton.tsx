import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(className)}
      style={{
        borderRadius: "var(--lt-radius-sm)",
        background: "var(--lt-color-surface)",
      }}
    />
  );
});
