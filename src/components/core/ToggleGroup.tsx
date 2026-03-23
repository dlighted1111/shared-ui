import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";

type ToggleGroupType = "single" | "multiple";
type ToggleGroupValue = string | string[];

interface ToggleGroupContextValue {
  type: ToggleGroupType;
  value: ToggleGroupValue;
  disabled?: boolean;
  size: "default" | "sm" | "lg";
  variant: "default" | "outline";
  setValue: (itemValue: string) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export interface ToggleGroupProps extends HTMLAttributes<HTMLDivElement> {
  type: ToggleGroupType;
  value?: ToggleGroupValue;
  defaultValue?: ToggleGroupValue;
  onValueChange?: (value: ToggleGroupValue) => void;
  disabled?: boolean;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
  children?: ReactNode;
}

export interface ToggleGroupItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
  value: string;
}

function getDefaultValue(type: ToggleGroupType, defaultValue?: ToggleGroupValue): ToggleGroupValue {
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  return type === "single" ? "" : [];
}

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
  {
    type,
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    size = "default",
    variant = "default",
    className,
    children,
    ...props
  },
  ref,
) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<ToggleGroupValue>(getDefaultValue(type, defaultValue));
  const currentValue = isControlled ? value : internalValue;

  const setValue = (itemValue: string) => {
    if (type === "single") {
      const selected = typeof currentValue === "string" ? currentValue : "";
      const nextValue = selected === itemValue ? "" : itemValue;
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
      return;
    }

    const selectedValues = Array.isArray(currentValue) ? currentValue : [];
    const exists = selectedValues.includes(itemValue);
    const nextValue = exists ? selectedValues.filter((entry) => entry !== itemValue) : [...selectedValues, itemValue];
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  const contextValue: ToggleGroupContextValue = useMemo(
    () => ({
      type,
      value: currentValue,
      disabled,
      size,
      variant,
      setValue,
    }),
    [currentValue, disabled, size, type, variant],
  );

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <div {...props} ref={ref} className={cx("flex items-center justify-center gap-1", className)}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
});

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(function ToggleGroupItem(
  { value, disabled, className, style, onClick, ...props },
  ref,
) {
  const context = useContext(ToggleGroupContext);
  const checked = context
    ? context.type === "single"
      ? context.value === value
      : Array.isArray(context.value) && context.value.includes(value)
    : false;
  const isDisabled = Boolean(context?.disabled || disabled);

  const sizeStyles =
    context?.size === "sm"
      ? { height: 36, padding: "0 10px", fontSize: "var(--lt-font-size-sm)" }
      : context?.size === "lg"
        ? { height: 44, padding: "0 20px", fontSize: "var(--lt-font-size-md)" }
        : { height: 40, padding: "0 12px", fontSize: "var(--lt-font-size-sm)" };

  const baseBorder = context?.variant === "outline" ? "1px solid var(--lt-color-border)" : "1px solid transparent";

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      data-state={checked ? "on" : "off"}
      disabled={isDisabled}
      className={cx(className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        borderRadius: "var(--lt-radius-sm)",
        border: baseBorder,
        background: checked ? "var(--lt-color-surface)" : "transparent",
        color: "var(--lt-color-text)",
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
        transition: "background-color 120ms ease, color 120ms ease, border-color 120ms ease",
        ...sizeStyles,
        ...style,
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || isDisabled || !context) {
          return;
        }
        context.setValue(value);
      }}
    />
  );
});
