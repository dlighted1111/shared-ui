import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from "react";
import { cx } from "../../lib/cx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

function sizeToButtonPadding(size: "sm" | "md" | "lg") {
  if (size === "sm") {
    return "8px 12px";
  }
  if (size === "lg") {
    return "12px 18px";
  }
  return "10px 14px";
}

function variantStyles(variant: ButtonProps["variant"]): Pick<CSSProperties, "background" | "color" | "border"> {
  if (variant === "secondary") {
    return {
      background: "var(--lt-color-surface)",
      color: "var(--lt-color-text)",
      border: "1px solid var(--lt-color-border)",
    };
  }
  if (variant === "ghost") {
    return {
      background: "transparent",
      color: "var(--lt-color-text)",
      border: "1px solid transparent",
    };
  }
  if (variant === "danger") {
    return {
      background: "var(--lt-color-danger)",
      color: "var(--lt-color-primary-contrast)",
      border: "1px solid transparent",
    };
  }
  return {
    background: "var(--lt-color-primary)",
    color: "var(--lt-color-primary-contrast)",
    border: "1px solid transparent",
  };
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", fullWidth = false, className, disabled, style, ...props },
  ref,
) {
  const visual = variantStyles(variant);
  const buttonStyle: CSSProperties = {
    ...visual,
    width: fullWidth ? "100%" : undefined,
    borderRadius: "var(--lt-radius-sm)",
    padding: sizeToButtonPadding(size),
    fontSize: "var(--lt-font-size-sm)",
    fontWeight: 600,
    lineHeight: 1.2,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "opacity 120ms ease",
    ...style,
  };

  return <button {...props} ref={ref} disabled={disabled} className={cx(className)} style={buttonStyle} />;
});
