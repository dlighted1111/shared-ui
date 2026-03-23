import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type HTMLAttributes } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cx } from "../../lib/cx";

export type SheetProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Root>;
export type SheetTriggerProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger>;
export type SheetCloseProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Close>;
export type SheetPortalProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Portal>;
export type SheetOverlayProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>;
export type SheetTitleProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Title>;
export type SheetDescriptionProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Description>;

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

export const SheetOverlay = forwardRef<
  ElementRef<typeof SheetPrimitive.Overlay>,
  SheetOverlayProps
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Overlay
      ref={ref}
      className={cx(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
});

function sideClassName(side: "top" | "bottom" | "left" | "right") {
  if (side === "top") {
    return "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top";
  }
  if (side === "bottom") {
    return "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom";
  }
  if (side === "left") {
    return "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm";
  }
  return "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md";
}

export interface SheetContentProps extends ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  side?: "top" | "bottom" | "left" | "right";
}

export const SheetContent = forwardRef<
  ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(function SheetContent({ side = "right", className, children, ...props }, ref) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cx(
          "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          sideClassName(side),
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
});

export function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />;
}

export const SheetTitle = forwardRef<ElementRef<typeof SheetPrimitive.Title>, SheetTitleProps>(
  function SheetTitle({ className, ...props }, ref) {
    return <SheetPrimitive.Title ref={ref} className={cx("text-lg font-semibold text-foreground", className)} {...props} />;
  },
);

export const SheetDescription = forwardRef<
  ElementRef<typeof SheetPrimitive.Description>,
  SheetDescriptionProps
>(function SheetDescription({ className, ...props }, ref) {
  return <SheetPrimitive.Description ref={ref} className={cx("text-sm text-muted-foreground", className)} {...props} />;
});
