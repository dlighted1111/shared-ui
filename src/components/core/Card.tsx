import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(className)}
      style={{
        borderRadius: "var(--lt-radius-md)",
        border: "1px solid var(--lt-color-border)",
        background: "var(--lt-color-bg)",
        color: "var(--lt-color-text)",
      }}
    />
  );
});

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(className)}
      style={{ display: "grid", gap: "var(--lt-space-1)", padding: "var(--lt-space-4)" }}
    />
  );
});

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { className, ...props },
  ref,
) {
  return (
    <h3
      {...props}
      ref={ref}
      className={cx(className)}
      style={{ fontSize: "var(--lt-font-size-md)", fontWeight: 600, lineHeight: 1.3 }}
    />
  );
});

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(function CardDescription(
  { className, ...props },
  ref,
) {
  return (
    <p
      {...props}
      ref={ref}
      className={cx(className)}
      style={{ color: "var(--lt-color-text-muted)", fontSize: "var(--lt-font-size-sm)", lineHeight: 1.35 }}
    />
  );
});

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={cx(className)} style={{ padding: "var(--lt-space-4)" }} />;
});

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(className)}
      style={{ display: "flex", alignItems: "center", gap: "var(--lt-space-2)", padding: "var(--lt-space-4)" }}
    />
  );
});
