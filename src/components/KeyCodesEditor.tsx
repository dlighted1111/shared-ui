import { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "./core";

export interface KeyCodeRecord {
  id: string;
  code_type: string;
  code_value: string;
  label: string | null;
}

export interface KeyCodeTypeOption {
  value: string;
  label: string;
}

interface PendingSave {
  type: string;
  value: string;
  label: string;
}

interface PendingDelete {
  id: string;
  type: string;
}

interface SavePayload {
  codeType: string;
  codeValue: string;
  label: string | null;
}

interface DeletePayload {
  id: string;
  codeType: string;
}

export interface KeyCodesEditorProps {
  keyCodes: KeyCodeRecord[];
  codeTypes: readonly KeyCodeTypeOption[];
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "section" | "compact";
  onSave: (payload: SavePayload) => void;
  onDelete: (payload: DeletePayload) => void;
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function codeTypeLabel(
  type: string,
  codeTypes: readonly KeyCodeTypeOption[]
): string {
  return codeTypes.find((entry) => entry.value === type)?.label ?? type;
}

export function KeyCodesEditor({
  keyCodes,
  codeTypes,
  isLoading = false,
  disabled = false,
  variant = "section",
  onSave,
  onDelete,
}: KeyCodesEditorProps) {
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editLabel, setEditLabel] = useState("");

  const [adding, setAdding] = useState(false);
  const [addType, setAddType] = useState("");
  const [addValue, setAddValue] = useState("");
  const [addLabel, setAddLabel] = useState("");

  const [confirmSave, setConfirmSave] = useState<PendingSave | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<PendingDelete | null>(null);

  const usedTypes = useMemo(
    () => new Set(keyCodes.map((code) => code.code_type)),
    [keyCodes]
  );
  const availableTypes = useMemo(
    () => codeTypes.filter((entry) => !usedTypes.has(entry.value)),
    [codeTypes, usedTypes]
  );

  const isCompact = variant === "compact";

  const startEdit = (code: KeyCodeRecord) => {
    if (disabled) return;
    setEditingType(code.code_type);
    setEditValue(code.code_value);
    setEditLabel(code.label ?? "");
  };

  const cancelEdit = () => {
    setEditingType(null);
    setEditValue("");
    setEditLabel("");
  };

  const handleSaveConfirm = () => {
    if (!confirmSave) return;
    onSave({
      codeType: confirmSave.type,
      codeValue: confirmSave.value,
      label: confirmSave.label || null,
    });
    setConfirmSave(null);
    setEditingType(null);
    setAdding(false);
    setAddType("");
    setAddValue("");
    setAddLabel("");
  };

  const handleDeleteConfirm = () => {
    if (!confirmDelete) return;
    onDelete({ id: confirmDelete.id, codeType: confirmDelete.type });
    setConfirmDelete(null);
  };

  return (
    <div>
      {!isCompact ? (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <KeyIcon className="h-3.5 w-3.5" /> Key Codes
          </h3>
          {!disabled && availableTypes.length > 0 && !adding ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setAdding(true)}
            >
              <PlusIcon className="h-3 w-3 mr-1" /> Add
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <KeyIcon className="h-3 w-3" /> Key Codes
          </span>
          {!disabled && availableTypes.length > 0 && !adding ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1.5 text-[10px]"
              onClick={() => setAdding(true)}
            >
              <PlusIcon className="h-3 w-3" />
            </Button>
          ) : null}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : null}

      {!isLoading && keyCodes.length === 0 && !adding ? (
        <p className="text-xs text-muted-foreground">No key codes on file.</p>
      ) : null}

      <div className="flex flex-col gap-1">
        {keyCodes.map((code) => {
          const isEditing = editingType === code.code_type;
          if (isEditing) {
            return (
              <div
                key={code.id}
                className="flex items-center gap-2 rounded-md border border-border p-2"
              >
                <span className="text-[11px] font-medium text-muted-foreground uppercase w-20 shrink-0">
                  {codeTypeLabel(code.code_type, codeTypes)}
                </span>
                <Input
                  className="h-7 text-xs font-mono flex-1"
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                  placeholder="Code"
                />
                <Input
                  className="h-7 text-xs flex-1"
                  value={editLabel}
                  onChange={(event) => setEditLabel(event.target.value)}
                  placeholder="Note (optional)"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={!editValue.trim()}
                  onClick={() =>
                    setConfirmSave({
                      type: code.code_type,
                      value: editValue.trim(),
                      label: editLabel.trim(),
                    })
                  }
                >
                  <SaveIcon className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={cancelEdit}
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          }

          return (
            <div
              key={code.id}
              className="group flex items-center justify-between rounded-md border border-border p-2 cursor-pointer hover:bg-muted/50"
              onClick={() => startEdit(code)}
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-muted-foreground uppercase w-20 shrink-0">
                  {codeTypeLabel(code.code_type, codeTypes)}
                </span>
                <span className="text-xs font-mono text-foreground">
                  {code.code_value}
                </span>
                {code.label ? (
                  <span className="text-[11px] text-muted-foreground">
                    {" "}
                    · {code.label}
                  </span>
                ) : null}
              </div>
              {!disabled ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(event) => {
                    event.stopPropagation();
                    setConfirmDelete({
                      id: code.id,
                      type: code.code_type,
                    });
                  }}
                >
                  <TrashIcon className="h-3.5 w-3.5 text-destructive" />
                </Button>
              ) : null}
            </div>
          );
        })}

        {adding ? (
          <div className="flex items-center gap-2 rounded-md border border-border p-2">
            <Select value={addType} onValueChange={setAddType}>
              <SelectTrigger className="h-7 w-28 text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map((entry) => (
                  <SelectItem key={entry.value} value={entry.value}>
                    {entry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="h-7 text-xs font-mono flex-1"
              value={addValue}
              onChange={(event) => setAddValue(event.target.value)}
              placeholder="Code"
            />
            <Input
              className="h-7 text-xs flex-1"
              value={addLabel}
              onChange={(event) => setAddLabel(event.target.value)}
              placeholder="Note (optional)"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={!addType || !addValue.trim()}
              onClick={() =>
                setConfirmSave({
                  type: addType,
                  value: addValue.trim(),
                  label: addLabel.trim(),
                })
              }
            >
              <SaveIcon className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => {
                setAdding(false);
                setAddType("");
                setAddValue("");
                setAddLabel("");
              }}
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : null}
      </div>

      <AlertDialog
        open={Boolean(confirmSave)}
        onOpenChange={(open) => {
          if (!open) setConfirmSave(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Key Code</AlertDialogTitle>
            <AlertDialogDescription>
              Save {codeTypeLabel(confirmSave?.type ?? "", codeTypes)} key code as
              {" "}
              "{confirmSave?.value}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveConfirm}>
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(confirmDelete)}
        onOpenChange={(open) => {
          if (!open) setConfirmDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Key Code</AlertDialogTitle>
            <AlertDialogDescription>
              Remove the {codeTypeLabel(confirmDelete?.type ?? "", codeTypes)} key
              code for this unit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
