import type { CSSProperties } from "react";

export const fieldContainerStyle: CSSProperties = {
  display: "grid",
  gap: "var(--lt-space-2)",
};

export const fieldLabelStyle: CSSProperties = {
  color: "var(--lt-color-text)",
  fontSize: "var(--lt-font-size-sm)",
  fontWeight: 600,
};

export const fieldHintStyle: CSSProperties = {
  color: "var(--lt-color-text-muted)",
  fontSize: "var(--lt-font-size-sm)",
  lineHeight: 1.35,
};

export const fieldErrorStyle: CSSProperties = {
  color: "var(--lt-color-danger)",
  fontSize: "var(--lt-font-size-sm)",
  lineHeight: 1.35,
};

export function sizeToPadding(size: "sm" | "md" | "lg"): string {
  if (size === "sm") {
    return "8px 10px";
  }
  if (size === "lg") {
    return "12px 14px";
  }
  return "10px 12px";
}
