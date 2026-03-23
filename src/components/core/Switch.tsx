import { forwardRef, useMemo, useState, type ButtonHTMLAttributes, type CSSProperties } from "react";
import { cx } from "../../lib/cx";

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, defaultChecked = false, onCheckedChange, disabled, className, style, onClick, ...props },
  ref,
) {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const currentChecked = isControlled ? checked : internalChecked;

  const rootStyle: CSSProperties = useMemo(
    () => ({
      width: 40,
      height: 22,
      borderRadius: 9999,
      border: "1px solid var(--lt-color-border)",
      background: currentChecked ? "var(--lt-color-primary)" : "var(--lt-color-surface)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: currentChecked ? "flex-end" : "flex-start",
      padding: 2,
      transition: "all 150ms ease",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      ...style,
    }),
    [currentChecked, disabled, style],
  );

  const thumbStyle: CSSProperties = {
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: "var(--lt-color-bg)",
    boxShadow: "var(--lt-shadow-sm)",
    transition: "transform 150ms ease",
  };

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      role="switch"
      aria-checked={currentChecked}
      disabled={disabled}
      className={cx(className)}
      style={rootStyle}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) {
          return;
        }
        const nextChecked = !currentChecked;
        if (!isControlled) {
          setInternalChecked(nextChecked);
        }
        onCheckedChange?.(nextChecked);
      }}
    >
      <span aria-hidden="true" style={thumbStyle} />
    </button>
  );
});
