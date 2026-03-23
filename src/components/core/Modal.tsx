import { useEffect, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
}

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  closeOnOverlayClick = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(2, 6, 23, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    zIndex: 50,
  };

  const contentStyle: CSSProperties = {
    width: "100%",
    maxWidth: 560,
    borderRadius: "var(--lt-radius-md)",
    border: "1px solid var(--lt-color-border)",
    background: "var(--lt-color-bg)",
    color: "var(--lt-color-text)",
    boxShadow: "var(--lt-shadow-md)",
    padding: "var(--lt-space-6)",
  };

  return createPortal(
    <div
      role="presentation"
      style={overlayStyle}
      onClick={() => {
        if (closeOnOverlayClick) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={contentStyle}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? <h3 style={{ margin: 0, fontSize: "var(--lt-font-size-lg)" }}>{title}</h3> : null}
        {description ? (
          <p style={{ marginTop: "var(--lt-space-2)", color: "var(--lt-color-text-muted)" }}>{description}</p>
        ) : null}
        <div style={{ marginTop: "var(--lt-space-4)" }}>{children}</div>
        {footer ? <div style={{ marginTop: "var(--lt-space-5)" }}>{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
