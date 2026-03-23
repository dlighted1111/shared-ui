import { createContext, useCallback, useContext, useMemo, useState, type CSSProperties, type ReactNode } from "react";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export interface ToastContextValue {
  messages: ToastMessage[];
  pushToast: (message: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export interface ToastProviderProps {
  children: ReactNode;
  autoDismissMs?: number;
}

export function ToastProvider({ children, autoDismissMs = 4000 }: ToastProviderProps) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setMessages((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: Omit<ToastMessage, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setMessages((prev) => [...prev, { id, ...message }]);
      window.setTimeout(() => {
        setMessages((prev) => prev.filter((item) => item.id !== id));
      }, autoDismissMs);
    },
    [autoDismissMs],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      messages,
      pushToast,
      dismissToast,
    }),
    [messages, pushToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport messages={messages} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export interface ToastViewportProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

function variantToAccent(variant: ToastVariant | undefined): string {
  if (variant === "success") {
    return "#16a34a";
  }
  if (variant === "warning") {
    return "#ca8a04";
  }
  if (variant === "error") {
    return "var(--lt-color-danger)";
  }
  return "var(--lt-color-primary)";
}

export function ToastViewport({ messages, onDismiss }: ToastViewportProps) {
  const viewportStyle: CSSProperties = {
    position: "fixed",
    right: "var(--lt-space-4)",
    bottom: "var(--lt-space-4)",
    display: "grid",
    gap: "var(--lt-space-2)",
    zIndex: 60,
    maxWidth: 360,
  };

  return (
    <div aria-live="polite" aria-atomic="true" style={viewportStyle}>
      {messages.map((message) => (
        <div
          key={message.id}
          role="status"
          style={{
            borderRadius: "var(--lt-radius-md)",
            border: "1px solid var(--lt-color-border)",
            borderLeft: `4px solid ${variantToAccent(message.variant)}`,
            boxShadow: "var(--lt-shadow-sm)",
            background: "var(--lt-color-bg)",
            color: "var(--lt-color-text)",
            padding: "var(--lt-space-3)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "var(--lt-space-2)" }}>
            <strong style={{ fontSize: "var(--lt-font-size-sm)" }}>{message.title}</strong>
            <button
              type="button"
              onClick={() => onDismiss(message.id)}
              aria-label="Dismiss notification"
              style={{
                border: "none",
                background: "transparent",
                color: "var(--lt-color-text-muted)",
                cursor: "pointer",
              }}
            >
              x
            </button>
          </div>
          {message.description ? (
            <p style={{ margin: "var(--lt-space-2) 0 0", color: "var(--lt-color-text-muted)" }}>{message.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
