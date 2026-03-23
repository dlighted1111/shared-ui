import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {}
export interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
export interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(className)}
      role="alert"
      style={{
        borderRadius: "var(--lt-radius-md)",
        border: "1px solid var(--lt-color-border)",
        background: "var(--lt-color-surface)",
        color: "var(--lt-color-text)",
        padding: "var(--lt-space-3) var(--lt-space-4)",
      }}
    />
  );
});

export const AlertTitle = forwardRef<HTMLHeadingElement, AlertTitleProps>(function AlertTitle(
  { className, ...props },
  ref,
) {
  return (
    <h5
      {...props}
      ref={ref}
      className={cx(className)}
      style={{ fontSize: "var(--lt-font-size-sm)", fontWeight: 600, lineHeight: 1.3, marginBottom: "var(--lt-space-1)" }}
    />
  );
});

export const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(function AlertDescription(
  { className, ...props },
  ref,
) {
  return (
    <p
      {...props}
      ref={ref}
      className={cx(className)}
      style={{ fontSize: "var(--lt-font-size-sm)", lineHeight: 1.4, color: "var(--lt-color-text-muted)" }}
    />
  );
});
