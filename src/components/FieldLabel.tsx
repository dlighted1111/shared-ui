import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./core";

export interface FieldLabelProps {
  label: ReactNode;
  icon?: ReactNode;
  tooltip?: ReactNode;
  className?: string;
}

export function FieldLabel({ label, icon, tooltip, className }: FieldLabelProps) {
  return (
    <span
      className={className || "text-xs text-muted-foreground"}
      style={{ display: "inline-flex", alignItems: "center", gap: 3 }}
    >
      {icon ? (
        tooltip ? (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={{ display: "inline-flex", cursor: "help" }}>
                  {icon}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span style={{ fontSize: 11 }}>{tooltip}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span style={{ display: "inline-flex" }}>{icon}</span>
        )
      ) : null}
      {label}
    </span>
  );
}
