import type { MouseEvent, ReactNode } from "react";
import { cx } from "../lib/cx";

export interface ActionLinkButtonProps {
  onActivate: () => void;
  children: ReactNode;
  className?: string;
  stopPropagation?: boolean;
}

export function ActionLinkButton({
  onActivate,
  children,
  className,
  stopPropagation = true,
}: ActionLinkButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    onActivate();
  };

  return (
    <button
      onClick={handleClick}
      className={cx(
        "text-sm text-foreground hover:underline transition-colors duration-150 text-left",
        className
      )}
    >
      {children}
    </button>
  );
}
