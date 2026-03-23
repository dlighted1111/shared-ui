import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./core";

export interface DensityToggleProps {
  compact: boolean;
  onChange: (compact: boolean) => void;
  compactLabel?: string;
  comfortableLabel?: string;
  compactIcon?: ReactNode;
  comfortableIcon?: ReactNode;
  className?: string;
  buttonClassName?: string;
}

function CompactIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 7h14" />
      <path d="M5 12h14" />
      <path d="M5 17h14" />
    </svg>
  );
}

function ComfortableIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7h18" />
      <path d="M3 12h18" />
      <path d="M3 17h18" />
    </svg>
  );
}

export function DensityToggle({
  compact,
  onChange,
  compactLabel = "Compact view",
  comfortableLabel = "Comfortable view",
  compactIcon,
  comfortableIcon,
  className,
  buttonClassName,
}: DensityToggleProps) {
  const nextCompact = !compact;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cx(
              "h-8 w-8 p-0 inline-flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted/50",
              buttonClassName
            )}
            onClick={() => onChange(nextCompact)}
          >
            {compact
              ? (comfortableIcon ?? <ComfortableIcon />)
              : (compactIcon ?? <CompactIcon />)}
          </button>
        </TooltipTrigger>
        <TooltipContent className={className}>
          <p>{nextCompact ? compactLabel : comfortableLabel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
