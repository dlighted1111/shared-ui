import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
} from "react";
import { cx } from "../../lib/cx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "destructive"
    | "outline"
    | "link";
  size?: "default" | "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
  asChild?: boolean;
}

function sizeClass(size: NonNullable<ButtonProps["size"]>) {
  if (size === "sm") {
    return "h-9 rounded-md px-3";
  }
  if (size === "icon") return "h-10 w-10";
  if (size === "lg") {
    return "h-11 rounded-md px-8";
  }
  return "h-10 px-4 py-2";
}

function variantClass(variant: NonNullable<ButtonProps["variant"]>) {
  if (variant === "default" || variant === "primary") {
    return "bg-primary text-primary-foreground hover:bg-primary/90";
  }
  if (variant === "destructive" || variant === "danger") {
    return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
  }
  if (variant === "outline") {
    return "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  }
  if (variant === "secondary") {
    return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
  }
  if (variant === "ghost") {
    return "hover:bg-accent hover:text-accent-foreground";
  }
  if (variant === "link") {
    return "text-primary underline-offset-4 hover:underline";
  }
  return "bg-primary text-primary-foreground hover:bg-primary/90";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "default",
    size = "default",
    fullWidth = false,
    asChild = false,
    className,
    children,
    type,
    ...props
  },
  ref,
) {
  const normalizedVariant = variant === "primary" ? "default" : variant;
  const normalizedSize = size === "md" ? "default" : size;
  const classes = cx(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    variantClass(normalizedVariant),
    sizeClass(normalizedSize),
    fullWidth && "w-full",
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cx(classes, child.props.className),
    });
  }

  return (
    <button {...props} ref={ref} type={type ?? "button"} className={classes}>
      {children}
    </button>
  );
});
