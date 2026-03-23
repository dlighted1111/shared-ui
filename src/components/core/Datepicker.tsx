import { forwardRef, useId, type CSSProperties, type InputHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import {
  fieldContainerStyle,
  fieldErrorStyle,
  fieldHintStyle,
  fieldLabelStyle,
  sizeToPadding,
} from "./controlStyles";

export interface DatepickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  error?: string;
  inputSize?: "sm" | "md" | "lg";
  containerClassName?: string;
}

export const Datepicker = forwardRef<HTMLInputElement, DatepickerProps>(function Datepicker(
  { id, label, description, error, inputSize = "md", containerClassName, className, disabled, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const inputStyle: CSSProperties = {
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
      {label ? (
        <label htmlFor={inputId} style={fieldLabelStyle}>
          {label}
        </label>
      ) : null}
      <input
        {...props}
        ref={ref}
        id={inputId}
        type="date"
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={cx(className)}
        style={inputStyle}
      />
      {error ? <p style={fieldErrorStyle}>{error}</p> : description ? <p style={fieldHintStyle}>{description}</p> : null}
    </div>
  );
});
