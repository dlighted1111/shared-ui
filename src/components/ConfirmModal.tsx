import { useEffect } from "react";

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  message?: string;
  consequence?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

function WarningIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function ConfirmModal({
  open,
  title,
  message,
  consequence,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onCancel]);

  if (!open) return null;

  const displayText = consequence || message || "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      onClick={onCancel}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-background border border-border rounded-[4px] p-6"
        style={{
          width: 420,
          maxWidth: "90vw",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-foreground mb-3">
          CONFIRM ACTION
        </div>
        <div className="text-sm font-bold text-foreground">{title}</div>
        {displayText ? (
          <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">
            {displayText}
          </p>
        ) : null}
        {isDestructive ? (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-destructive">
            <WarningIcon />
            <span>This cannot be undone.</span>
          </div>
        ) : null}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            className="text-xs font-medium px-4 py-2 rounded-[4px] border border-border text-foreground hover:bg-accent/60"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-xs font-semibold px-4 py-2 rounded-[4px] border-none text-white"
            style={{
              backgroundColor: "#111111",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              cursor: "pointer",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
