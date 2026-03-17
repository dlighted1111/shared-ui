import { cx } from "../lib/cx";

export interface PageSizeSelectorProps {
  value: number;
  onChange: (size: number) => void;
  sizes?: readonly number[];
  label?: string;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
}

const DEFAULT_SIZES = [25, 50, 100, 250, 500] as const;

export function PageSizeSelector({
  value,
  onChange,
  sizes = DEFAULT_SIZES,
  label = "Rows:",
  className,
  labelClassName,
  selectClassName,
}: PageSizeSelectorProps) {
  return (
    <div className={cx("flex items-center gap-2", className)}>
      <span className={cx("text-xs text-muted-foreground", labelClassName)}>{label}</span>
      <select
        value={String(value)}
        onChange={(event) => onChange(Number(event.target.value))}
        className={cx(
          "h-7 min-w-[70px] rounded-md border border-input bg-background px-2 text-xs text-foreground",
          selectClassName,
        )}
      >
        {sizes.map((size) => (
          <option key={size} value={String(size)}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
