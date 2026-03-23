import { forwardRef, useMemo, useState, type CSSProperties, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value,
    defaultValue = [0],
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    className,
    style,
    ...props
  },
  ref,
) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue[0] ?? 0);
  const currentRaw = isControlled ? value?.[0] ?? 0 : internalValue;
  const current = clamp(currentRaw, min, max);
  const range = Math.max(max - min, 1);
  const percent = ((current - min) / range) * 100;

  const inputStyle: CSSProperties = useMemo(
    () => ({
      width: "100%",
      height: 8,
      borderRadius: 9999,
      outline: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      background: `linear-gradient(to right, var(--lt-color-primary) 0%, var(--lt-color-primary) ${percent}%, var(--lt-color-surface) ${percent}%, var(--lt-color-surface) 100%)`,
      ...style,
    }),
    [disabled, percent, style],
  );

  return (
    <div {...props} className={cx("relative flex w-full select-none items-center", className)}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        onChange={(event) => {
          const nextValue = clamp(Number(event.target.value), min, max);
          if (!isControlled) {
            setInternalValue(nextValue);
          }
          onValueChange?.([nextValue]);
        }}
        style={inputStyle}
      />
    </div>
  );
});
