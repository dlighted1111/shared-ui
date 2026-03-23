import { forwardRef, useId, type CSSProperties, type TextareaHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import {
  fieldContainerStyle,
  fieldErrorStyle,
  fieldHintStyle,
  fieldLabelStyle,
  sizeToPadding,
} from "./controlStyles";

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  description?: string;
  error?: string;
  inputSize?: "sm" | "md" | "lg";
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id, label, description, error, inputSize = "md", containerClassName, className, disabled, rows = 4, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  const textareaStyle: CSSProperties = {
    appearance: "none",
    borderRadius: "var(--lt-radius-sm)",
    border: `1px solid ${error ? "var(--lt-color-danger)" : "var(--lt-color-border)"}`,
    background: "var(--lt-color-bg)",
    color: "var(--lt-color-text)",
    fontSize: "var(--lt-font-size-md)",
    lineHeight: 1.5,
    outline: "none",
    padding: sizeToPadding(inputSize),
    width: "100%",
    boxSizing: "border-box",
    opacity: disabled ? 0.6 : 1,
    resize: "vertical",
    minHeight: "96px",
  };

  return (
    <div style={fieldContainerStyle} className={containerClassName}>
      {label && (
        <label htmlFor={textareaId} style={fieldLabelStyle}>
          {label}
        </label>
      )}
      <textarea
        {...props}
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={cx(className)}
        style={textareaStyle}
      />
      {error ? <p style={fieldErrorStyle}>{error}</p> : description ? <p style={fieldHintStyle}>{description}</p> : null}
    </div>
  );
});
