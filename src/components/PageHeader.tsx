import type { ReactNode } from "react";
import { cx } from "../lib/cx";

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  actionsClassName?: string;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
  contentClassName,
  titleClassName,
  subtitleClassName,
  actionsClassName,
}: PageHeaderProps) {
  return (
    <div className={cx("flex items-start justify-between", className)}>
      <div className={contentClassName}>
        <h1 className={cx("text-[30px] font-bold leading-tight text-foreground", titleClassName)}>
          {title}
        </h1>
        {subtitle ? (
          <p className={cx("mt-0.5 text-sm text-muted-foreground", subtitleClassName)}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className={cx("shrink-0", actionsClassName)}>
          {actions}
        </div>
      ) : null}
    </div>
  );
}
