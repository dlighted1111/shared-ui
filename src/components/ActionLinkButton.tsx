import type { MouseEvent, ReactNode } from "react";
import { cx } from "../lib/cx";

export interface ActionLinkButtonProps {
  onActivate?: () => void;
  href?: string;
  children: ReactNode;
  className?: string;
  stopPropagation?: boolean;
}

export function ActionLinkButton({
  onActivate,
  href,
  children,
  className,
  stopPropagation = true,
}: ActionLinkButtonProps) {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    if (
      href &&
      (event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button === 1)
    ) {
      return;
    }
    if (onActivate) {
      event.preventDefault();
      onActivate();
    }
  };

  const baseClassName = cx(
    "text-sm text-foreground hover:underline transition-colors duration-150 text-left",
    className
  );

  if (href) {
    return (
      <a href={href} onClick={handleClick} className={baseClassName}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={baseClassName}
    >
      {children}
    </button>
  );
}
