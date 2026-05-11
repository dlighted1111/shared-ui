import type { ReactNode } from "react";
import { ActionLinkButton } from "./ActionLinkButton";

export interface EntityLinkProps {
  onActivate?: () => void;
  href?: string;
  children: ReactNode;
  className?: string;
  stopPropagation?: boolean;
}

export function EntityLink({
  onActivate,
  href,
  children,
  className,
  stopPropagation = true,
}: EntityLinkProps) {
  return (
    <ActionLinkButton
      onActivate={onActivate}
      href={href}
      className={className}
      stopPropagation={stopPropagation}
    >
      {children}
    </ActionLinkButton>
  );
}
