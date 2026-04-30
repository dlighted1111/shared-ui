import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export interface ActivityLogSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

export function ActivityLogSection({
  title = "Activity",
  children,
  className,
  titleClassName,
  contentClassName,
}: ActivityLogSectionProps) {
  return (
    <section className={cx("space-y-2", className)}>
      <h3 className={cx("text-sm font-semibold", titleClassName)}>{title}</h3>
      <div className={cx("rounded-md border border-border bg-card p-3", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
