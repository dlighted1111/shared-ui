import { cx } from "../lib/cx";

export interface QuickFilterItem {
  key: string;
  label: string;
}

export interface QuickFilterBarProps {
  items: readonly QuickFilterItem[];
  activeKey: string | null;
  onToggle: (key: string | null) => void;
  className?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  inactiveButtonClassName?: string;
}

export function QuickFilterBar({
  items,
  activeKey,
  onToggle,
  className,
  buttonClassName,
  activeButtonClassName,
  inactiveButtonClassName,
}: QuickFilterBarProps) {
  return (
    <div className={cx("flex items-center gap-2", className)}>
      {items.map((item) => {
        const isActive = activeKey === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onToggle(isActive ? null : item.key)}
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
