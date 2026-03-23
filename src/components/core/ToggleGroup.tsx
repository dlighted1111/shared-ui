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

function sizeClass(size: NonNullable<ToggleGroupContextValue["size"]>) {
  if (size === "sm") return "h-9 px-2.5";
  if (size === "lg") return "h-11 px-5";
  return "h-10 px-3";
}

function variantClass(variant: NonNullable<ToggleGroupContextValue["variant"]>) {
  if (variant === "outline") {
    return "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground";
  }
  return "bg-transparent";
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

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      data-state={checked ? "on" : "off"}
      disabled={isDisabled}
      className={cx(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        variantClass(context?.variant ?? "default"),
        sizeClass(context?.size ?? "default"),
        className,
      )}
      style={style}
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
