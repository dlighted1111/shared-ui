import type { ComponentType } from "react";
import { cx } from "../lib/cx";

type KpiIcon = ComponentType<{ size?: number; className?: string }>;

export interface KpiCardTrend {
  direction: "up" | "down";
  value: string;
}

export interface KpiCardProps {
  label: string;
  value: string | number;
  icon: KpiIcon;
  trend?: KpiCardTrend;
  variant?: "default" | "warning" | "danger";
  loading?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<NonNullable<KpiCardProps["variant"]>, { bg: string; border: string }> = {
  default: { bg: "#F9F8F6", border: "#E8E8E4" },
  warning: { bg: "#FBF3DB", border: "#F2E6BF" },
  danger: { bg: "#FBE4E4", border: "#F2CACA" },
};

function TrendGlyph({ direction }: { direction: "up" | "down" }) {
  return <span aria-hidden>{direction === "up" ? "↑" : "↓"}</span>;
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  variant = "default",
  loading = false,
  className,
}: KpiCardProps) {
  const colors = VARIANT_STYLES[variant] ?? VARIANT_STYLES.default;

  return (
    <div
      className={cx("rounded-lg p-5", className)}
      style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
    >
      {loading ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-muted animate-pulse" />
            <div className="h-5 w-5 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-7 w-24 rounded bg-muted animate-pulse" />
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{label}</span>
            <Icon size={18} className="text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-foreground">{value}</span>
            {trend ? (
              <span
                className={cx(
                  "inline-flex items-center gap-1 text-xs font-medium",
                  trend.direction === "up" ? "text-[#0F7B6C]" : "text-[#E03E3E]",
                )}
              >
                <TrendGlyph direction={trend.direction} />
                {trend.value}
              </span>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
