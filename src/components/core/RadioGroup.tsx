import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { cx } from "../../lib/cx";

interface RadioGroupContextValue {
  value?: string;
  disabled?: boolean;
  setValue: (nextValue: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export interface RadioGroupItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
  value: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { value, defaultValue, onValueChange, disabled = false, className, ...props },
  ref,
) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const contextValue: RadioGroupContextValue = useMemo(
    () => ({
      value: currentValue,
      disabled,
      setValue: (nextValue) => {
        if (!isControlled) {
          setInternalValue(nextValue);
        }
        onValueChange?.(nextValue);
      },
    }),
    [currentValue, disabled, isControlled, onValueChange],
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div {...props} ref={ref} role="radiogroup" className={cx("grid gap-2", className)} />
    </RadioGroupContext.Provider>
  );
});

export const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(function RadioGroupItem(
  { value, disabled, className, style, onClick, ...props },
  ref,
) {
  const context = useContext(RadioGroupContext);
  const checked = context?.value === value;
  const isDisabled = Boolean(context?.disabled || disabled);

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={isDisabled}
      className={cx(className)}
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: "1px solid var(--lt-color-primary)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--lt-color-primary)",
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
        ...style,
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || isDisabled) {
          return;
        }
        context?.setValue(value);
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: checked ? "currentColor" : "transparent",
        }}
      />
    </button>
  );
});
