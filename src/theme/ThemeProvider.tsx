import { createContext, type CSSProperties, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { designTokens, type ResolvedTheme } from "./tokens";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
  storageKey?: string;
  disableStorage?: boolean;
  className?: string;
}

const DEFAULT_STORAGE_KEY = "lt-shared-ui-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === "system" ? getSystemTheme() : mode;
}

function toCssVariables(theme: ResolvedTheme): CSSProperties {
  const tokens = designTokens[theme];
  return Object.fromEntries(Object.entries(tokens)) as CSSProperties;
}

export function ThemeProvider({
  children,
  initialMode = "system",
  storageKey = DEFAULT_STORAGE_KEY,
  disableStorage = false,
  className,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  useEffect(() => {
    if (disableStorage || typeof window === "undefined") {
      return;
    }
    const storedMode = window.localStorage.getItem(storageKey) as ThemeMode | null;
    if (storedMode === "light" || storedMode === "dark" || storedMode === "system") {
      setMode(storedMode);
    }
  }, [disableStorage, storageKey]);

  useEffect(() => {
    if (disableStorage || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(storageKey, mode);
  }, [disableStorage, mode, storageKey]);

  const resolvedTheme = resolveTheme(mode);
  const style = useMemo(() => toCssVariables(resolvedTheme), [resolvedTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolvedTheme,
      setMode,
    }),
    [mode, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-lt-theme={resolvedTheme} className={className} style={style}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
}
