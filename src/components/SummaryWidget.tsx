import type { RefObject } from "react";
import { cx } from "../lib/cx";

export interface MetricCardDef {
  label: string;
  value: number | string;
  filterKey?: string;
}

interface MetricCardProps extends MetricCardDef {
  active: boolean;
  onClick?: (filterKey: string) => void;
}

function MetricCard({ label, value, filterKey, active, onClick }: MetricCardProps) {
  const clickable = Boolean(filterKey && onClick);
  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => clickable && onClick?.(filterKey!)}
      className={cx(
        "flex flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-colors",
        clickable ? "cursor-pointer hover:bg-accent/40" : "cursor-default",
        active ? "border-foreground bg-accent/40" : "border-border bg-background",
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </span>
      <span className="text-2xl font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
    </button>
  );
}

export interface PhaseChipDef {
  label: string;
  value: string;
  count: number;
  color?: string;
}

interface PhaseChipProps extends PhaseChipDef {
  active: boolean;
  disabled: boolean;
  onClick: (value: string) => void;
}

function PhaseChip({ label, value, count, active, disabled, onClick }: PhaseChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onClick(value)}
      className={cx(
        "inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] border transition-colors",
        disabled && "opacity-40 cursor-default",
        !disabled && !active && "cursor-pointer hover:bg-accent/40",
        active
          ? "border-foreground bg-accent/40 text-foreground"
          : "border-border bg-background text-muted-foreground",
      )}
    >
      <span>{label}</span>
      <span
        className={cx(
          "inline-flex items-center justify-center rounded-full px-1.5 min-w-[18px] h-[18px] text-[10px] font-bold",
          active ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
        )}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {count}
      </span>
    </button>
  );
}

export interface SummaryWidgetProps {
  metrics: MetricCardDef[];
  chips?: PhaseChipDef[];
  activeMetricFilter: string | null;
  activeChipFilter: string | null;
  onMetricClick: (filterKey: string | null) => void;
  onChipClick: (value: string | null) => void;
  tableRef?: RefObject<HTMLDivElement>;
}

export function SummaryWidget({
  metrics,
  chips,
  activeMetricFilter,
  activeChipFilter,
  onMetricClick,
  onChipClick,
  tableRef,
}: SummaryWidgetProps) {
  const handleMetricClick = (filterKey: string) => {
    const next = activeMetricFilter === filterKey ? null : filterKey;
    onMetricClick(next);
    if (next && tableRef?.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleChipClick = (value: string) => {
    const next = activeChipFilter === value ? null : value;
    onChipClick(next);
    if (next && tableRef?.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            {...metric}
            active={Boolean(metric.filterKey) && activeMetricFilter === metric.filterKey}
            onClick={metric.filterKey ? handleMetricClick : undefined}
          />
        ))}
      </div>

      {chips && chips.length > 0 ? (
        <div className="flex items-center gap-2 flex-wrap">
          {chips.map((chip) => (
            <PhaseChip
              key={chip.value}
              {...chip}
              active={activeChipFilter === chip.value}
              disabled={chip.count === 0}
              onClick={handleChipClick}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
