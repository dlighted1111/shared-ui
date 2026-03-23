import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactElement } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cx } from "../../lib/cx";

export interface ToastProps extends ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: "default" | "destructive";
}

export type ToastActionElement = ReactElement<typeof ToastAction>;

function toastVariantClassName(variant: ToastProps["variant"]) {
  if (variant === "destructive") {
    return "destructive group border-destructive bg-destructive text-destructive-foreground";
  }
  return "border bg-background text-foreground";
}

export const Toast = forwardRef<ElementRef<typeof ToastPrimitive.Root>, ToastProps>(function Toast(
  { className, variant = "default", ...props },
  ref,
) {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cx(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
        toastVariantClassName(variant),
        className,
      )}
      {...props}
    />
  );
});

Toast.displayName = ToastPrimitive.Root.displayName;

export const ToastAction = forwardRef<ElementRef<typeof ToastPrimitive.Action>, ComponentPropsWithoutRef<typeof ToastPrimitive.Action>>(
  function ToastAction({ className, ...props }, ref) {
    return (
      <ToastPrimitive.Action
        ref={ref}
        className={cx(
          "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

ToastAction.displayName = ToastPrimitive.Action.displayName;

export const ToastClose = forwardRef<ElementRef<typeof ToastPrimitive.Close>, ComponentPropsWithoutRef<typeof ToastPrimitive.Close>>(
  function ToastClose({ className, ...props }, ref) {
    return (
      <ToastPrimitive.Close
        ref={ref}
        className={cx(
          "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
          className,
        )}
        toast-close=""
        {...props}
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </ToastPrimitive.Close>
    );
  },
);

ToastClose.displayName = ToastPrimitive.Close.displayName;

export const ToastTitle = forwardRef<ElementRef<typeof ToastPrimitive.Title>, ComponentPropsWithoutRef<typeof ToastPrimitive.Title>>(
  function ToastTitle({ className, ...props }, ref) {
    return <ToastPrimitive.Title ref={ref} className={cx("text-sm font-semibold", className)} {...props} />;
  },
);

ToastTitle.displayName = ToastPrimitive.Title.displayName;

export const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(function ToastDescription({ className, ...props }, ref) {
  return <ToastPrimitive.Description ref={ref} className={cx("text-sm opacity-90", className)} {...props} />;
});

ToastDescription.displayName = ToastPrimitive.Description.displayName;
