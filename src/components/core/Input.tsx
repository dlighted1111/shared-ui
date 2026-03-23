import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  description?: string;
  error?: string;
  inputSize?: "sm" | "md" | "lg";
  containerClassName?: string;
}

function sizeClass(size: NonNullable<InputProps["inputSize"]>) {
  if (size === "sm") {
    return "h-8 px-2.5 py-1 text-sm";
  }
  if (size === "lg") {
    return "h-11 px-4 py-2 text-base";
  }
  return "h-10 px-3 py-2 text-sm";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, description, error, inputSize = "md", containerClassName, className, disabled, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cx("space-y-1.5", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium leading-none">
          {label}
        </label>
      )}
      <input
        {...props}
        ref={ref}
        id={inputId}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={cx(
          "flex w-full rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          sizeClass(inputSize),
          error && "border-destructive focus-visible:ring-destructive",
          className,
        )}
      />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
});
