import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../lib/cx";

export interface CopyLinkButtonProps {
  idleContent?: ReactNode;
  copiedContent?: ReactNode;
  className?: string;
  title?: string;
  copiedDurationMs?: number;
}

export function CopyLinkButton({
  idleContent = "Copy",
  copiedContent = "Copied",
  className,
  title = "Copy link",
  copiedDurationMs = 1500,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      timeoutRef.current = null;
    }, copiedDurationMs);
  }, [copiedDurationMs]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button onClick={handleCopy} className={cx(className)} title={title}>
      {copied ? copiedContent : idleContent}
    </button>
  );
}
