import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export interface BugReportModalProps {
  open: boolean;
  onClose: () => void;
  hidden?: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  closeLabel?: ReactNode;
  className?: string;
  panelClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  children: ReactNode;
}

export function BugReportModal({
  open,
  onClose,
  hidden = false,
  title,
  subtitle,
  closeLabel = "Close",
  className,
  panelClassName,
  headerClassName,
  contentClassName,
  children,
}: BugReportModalProps) {
  if (!open || hidden) return null;

  return (
    <div
      className={cx(
        "fixed inset-0 z-[120] flex items-center justify-center bg-black/55 p-2",
        className
      )}
      onClick={onClose}
    >
      <div
        className={cx(
          "flex h-[calc(100vh-16px)] w-[calc(100vw-16px)] max-w-[1760px] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-2xl",
          panelClassName
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {(title || subtitle) ? (
          <div
            className={cx(
              "flex items-center justify-between border-b border-border px-4 py-3",
              headerClassName
            )}
          >
            <div>
              {title ? (
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {title}
                </p>
              ) : null}
              {subtitle ? (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-3 py-1.5 rounded border border-border hover:bg-accent"
            >
              {closeLabel}
            </button>
          </div>
        ) : null}
        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
}
