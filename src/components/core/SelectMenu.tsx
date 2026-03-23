import { forwardRef, useId, type CSSProperties, type SelectHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import {
  fieldContainerStyle,
  fieldErrorStyle,
  fieldHintStyle,
  fieldLabelStyle,
  sizeToPadding,
} from "./controlStyles";

export interface SelectMenuOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectMenuProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  description?: string;
  error?: string;
  inputSize?: "sm" | "md" | "lg";
  options: SelectMenuOption[];
  placeholder?: string;
  containerClassName?: string;
}

export const SelectMenu = forwardRef<HTMLSelectElement, SelectMenuProps>(function SelectMenu(
  {
    id,
    label,
    description,
    error,
    inputSize = "md",
    options,
    placeholder,
    containerClassName,
    className,
    disabled,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  const selectStyle: CSSProperties = {
    appearance: "none",
    borderRadius: "var(--lt-radius-sm)",
    border: `1px solid ${error ? "var(--lt-color-danger)" : "var(--lt-color-border)"}`,
    background: "var(--lt-color-bg)",
    color: "var(--lt-color-text)",
    fontSize: "var(--lt-font-size-md)",
    lineHeight: 1.35,
    outline: "none",
    padding: sizeToPadding(inputSize),
    width: "100%",
    boxSizing: "border-box",
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <div style={fieldContainerStyle} className={containerClassName}>
      {label && (
        <label htmlFor={selectId} style={fieldLabelStyle}>
          {label}
        </label>
      )}
      <select
        {...props}
        ref={ref}
        id={selectId}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={cx(className)}
        style={selectStyle}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p style={fieldErrorStyle}>{error}</p> : description ? <p style={fieldHintStyle}>{description}</p> : null}
    </div>
  );
});
