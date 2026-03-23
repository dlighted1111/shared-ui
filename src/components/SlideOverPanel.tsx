import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./core";

export interface SlideOverPanelProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  contentClassName?: string;
  bodyClassName?: string;
}

export function SlideOverPanel({
  open,
  onClose,
  title,
  children,
  contentClassName,
  bodyClassName,
}: SlideOverPanelProps) {
  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <SheetContent
        className={contentClassName ?? "w-full sm:w-[45%] sm:max-w-none"}
        side="right"
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div
          className={bodyClassName ?? "mt-4 overflow-y-auto"}
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
