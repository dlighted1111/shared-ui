import { useCallback, useState, type MouseEvent } from "react";
import { cx } from "../lib/cx";

export interface CopyTextProps {
  value: string;
  display?: string;
  className?: string;
  copiedDurationMs?: number;
}

const COPY_TEXT_ROOT_CLASS =
  "inline-flex w-full min-w-0 max-w-full cursor-pointer items-center gap-1 group";
const COPY_TEXT_VALUE_CLASS =
  "block min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap";
const COPY_TEXT_ICON_CLASS = "shrink-0 opacity-0 group-hover:opacity-100";

function CopyIcon({ copied }: { copied: boolean }) {
  if (copied) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[11px] w-[11px] text-green-600"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[11px] w-[11px] text-muted-foreground"
      aria-hidden="true"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export function CopyText({
  value,
  display,
  className,
  copiedDurationMs = 1500,
}: CopyTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(value).catch(() => {});
      setCopied(true);
      window.setTimeout(() => setCopied(false), copiedDurationMs);
    },
    [copiedDurationMs, value],
  );

  return (
    <span
      onClick={handleCopy}
      className={cx(COPY_TEXT_ROOT_CLASS, className)}
      title="Click to copy"
    >
      <span className={COPY_TEXT_VALUE_CLASS}>{display ?? value}</span>
      <span className={COPY_TEXT_ICON_CLASS}>
        <CopyIcon copied={copied} />
      </span>
    </span>
  );
}
