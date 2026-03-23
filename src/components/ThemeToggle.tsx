import { useEffect, useState } from "react";
import { cx } from "../lib/cx";

export interface ThemeToggleProps {
  className?: string;
  iconSize?: number;
  iconStrokeWidth?: number;
  darkModeTitle?: string;
  lightModeTitle?: string;
}

function getInitialDarkMode() {
  try {
    return localStorage.getItem("fo_theme") === "dark";
  } catch {
    return false;
  }
}

function SunIcon({ size, strokeWidth }: { size: number; strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ size, strokeWidth }: { size: number; strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z" />
    </svg>
  );
}

export function ThemeToggle({
  className,
  iconSize = 16,
  iconStrokeWidth,
  darkModeTitle = "Switch to dark mode",
  lightModeTitle = "Switch to light mode",
}: ThemeToggleProps) {
  const [dark, setDark] = useState(getInitialDarkMode);

  useEffect(() => {
    const nextTheme = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("fo_theme", nextTheme);
    } catch {
      return;
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((current) => !current)}
      className={cx("p-1.5 rounded-md text-muted-foreground hover:bg-secondary transition-colors duration-150", className)}
      aria-label={dark ? lightModeTitle : darkModeTitle}
      title={dark ? lightModeTitle : darkModeTitle}
      type="button"
    >
      {dark ? (
        <SunIcon size={iconSize} strokeWidth={iconStrokeWidth} />
      ) : (
        <MoonIcon size={iconSize} strokeWidth={iconStrokeWidth} />
      )}
    </button>
  );
}
