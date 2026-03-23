import { cx } from "../lib/cx";
import type { QuickFilterItem } from "./QuickFilterBar";

export interface MultiQuickFilterBarProps {
  items: readonly QuickFilterItem[];
  activeKeys: readonly string[];
  onChange: (keys: string[]) => void;
  allowEmpty?: boolean;
  className?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  inactiveButtonClassName?: string;
}

export function MultiQuickFilterBar({
  items,
  activeKeys,
  onChange,
  allowEmpty = true,
  className,
  buttonClassName,
  activeButtonClassName,
  inactiveButtonClassName,
}: MultiQuickFilterBarProps) {
  const activeSet = new Set(activeKeys);

  const handleToggle = (key: string) => {
    if (activeSet.has(key)) {
      const next = activeKeys.filter((entry) => entry !== key);
      if (!allowEmpty && next.length === 0) return;
      onChange(next);
      return;
    }

    onChange([...activeKeys, key]);
  };

  return (
    <div className={cx("flex items-center gap-2", className)}>
      {items.map((item) => {
        const isActive = activeSet.has(item.key);
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => handleToggle(item.key)}
            className={cx(
              "inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-medium transition-colors",
              buttonClassName,
              isActive ? activeButtonClassName : inactiveButtonClassName
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
