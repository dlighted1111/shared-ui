export type ResolvedTheme = "light" | "dark";

export type ThemeTokenMap = Record<`--${string}`, string>;

const baseTokens: ThemeTokenMap = {
  "--lt-radius-sm": "6px",
  "--lt-radius-md": "10px",
  "--lt-radius-lg": "14px",
  "--lt-space-1": "4px",
  "--lt-space-2": "8px",
  "--lt-space-3": "12px",
  "--lt-space-4": "16px",
  "--lt-space-5": "20px",
  "--lt-space-6": "24px",
  "--lt-font-size-sm": "14px",
  "--lt-font-size-md": "16px",
  "--lt-font-size-lg": "20px",
  "--lt-shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.06)",
  "--lt-shadow-md": "0 6px 20px rgba(0, 0, 0, 0.12)",
};

const lightTokens: ThemeTokenMap = {
  "--lt-color-bg": "#ffffff",
  "--lt-color-surface": "#f8fafc",
  "--lt-color-border": "#e2e8f0",
  "--lt-color-text": "#0f172a",
  "--lt-color-text-muted": "#475569",
  "--lt-color-primary": "#2563eb",
  "--lt-color-primary-contrast": "#ffffff",
  "--lt-color-danger": "#dc2626",
  "--lt-color-focus": "#3b82f6",
};

const darkTokens: ThemeTokenMap = {
  "--lt-color-bg": "#0f172a",
  "--lt-color-surface": "#1e293b",
  "--lt-color-border": "#334155",
  "--lt-color-text": "#f8fafc",
  "--lt-color-text-muted": "#cbd5e1",
  "--lt-color-primary": "#60a5fa",
  "--lt-color-primary-contrast": "#0f172a",
  "--lt-color-danger": "#f87171",
  "--lt-color-focus": "#93c5fd",
};

export const designTokens: Record<ResolvedTheme, ThemeTokenMap> = {
  light: {
    ...baseTokens,
    ...lightTokens,
  },
  dark: {
    ...baseTokens,
    ...darkTokens,
  },
};
