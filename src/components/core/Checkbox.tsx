import { forwardRef, useId, type CSSProperties, type InputHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { fieldContainerStyle, fieldErrorStyle, fieldHintStyle, fieldLabelStyle } from "./controlStyles";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, label, description, error, containerClassName, className, disabled, ...props },
  ref,
) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  const boxStyle: CSSProperties = {
    accentColor: "var(--lt-color-primary)",
    width: 16,
    height: 16,
    margin: 0,
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <div style={fieldContainerStyle} className={containerClassName}>
      <label
        htmlFor={checkboxId}
        style={{
          ...fieldLabelStyle,
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--lt-space-2)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <input
          {...props}
          ref={ref}
          id={checkboxId}
          type="checkbox"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={cx(className)}
          style={boxStyle}
        />
        {label}
      </label>
      {error ? <p style={fieldErrorStyle}>{error}</p> : description ? <p style={fieldHintStyle}>{description}</p> : null}
    </div>
  );
});
