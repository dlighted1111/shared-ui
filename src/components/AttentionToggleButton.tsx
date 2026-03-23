import type { CSSProperties, ReactNode } from "react";
import { cx } from "../lib/cx";
import { ValueBadge } from "./ValueBadge";

export interface AttentionToggleButtonProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  icon?: ReactNode;
  className?: string;
}

export function AttentionToggleButton({
  label,
  count,
  active,
  onClick,
  icon,
  className,
}: AttentionToggleButtonProps) {
  const style: CSSProperties = {
    backgroundColor: active ? "#FEF2F2" : "transparent",
    borderColor: active ? "#EF4444" : "hsl(var(--border))",
    color: active ? "#EF4444" : "hsl(var(--foreground))",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-[4px] border px-3 py-1.5 text-xs font-medium transition-colors",
        className
      )}
      style={style}
    >
      {icon}
      {label}
      {count > 0 ? (
        <ValueBadge
          label={String(count)}
          backgroundColor="#EF4444"
          textColor="#fff"
          className="ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
        />
      ) : null}
    </button>
  );
}
