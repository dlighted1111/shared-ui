import type { ReactNode } from "react";
import { Button } from "./core/Button";
import { Modal } from "./core/Modal";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
  destructive?: boolean;
  warningText?: string;
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  loading = false,
  destructive = false,
  warningText,
  children,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title={title}
      description={description}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? "danger" : "primary"} onClick={onConfirm} disabled={loading}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      {warningText ? <div className="text-xs text-[#E03E3E]">{warningText}</div> : null}
      {children}
    </Modal>
  );
}
