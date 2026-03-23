import type { ReactNode } from "react";
import { ActionLinkButton } from "./ActionLinkButton";

export interface EntityLinkProps {
  onActivate: () => void;
  children: ReactNode;
  className?: string;
  stopPropagation?: boolean;
}

export function EntityLink({
  onActivate,
  children,
  className,
  stopPropagation = true,
}: EntityLinkProps) {
  return (
    <ActionLinkButton
      onActivate={onActivate}
      className={className}
      stopPropagation={stopPropagation}
    >
      {children}
    </ActionLinkButton>
  );
}
