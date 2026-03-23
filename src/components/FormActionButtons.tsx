import { Button } from "./core/Button";

export interface FormActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  saving?: boolean;
  disabled?: boolean;
  submitVariant?: "primary" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FormActionButtons({
  onCancel,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  saving = false,
  disabled = false,
  submitVariant = "primary",
  size = "sm",
  className,
}: FormActionButtonsProps) {
  return (
    <div className={className ?? "flex items-center gap-2"}>
      <Button size={size} variant="secondary" onClick={onCancel} disabled={saving}>
        {cancelLabel}
      </Button>
      <Button size={size} variant={submitVariant} onClick={onSubmit} disabled={saving || disabled}>
        {submitLabel}
      </Button>
    </div>
  );
}
