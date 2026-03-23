import { useMemo, useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "./core";

export interface LogActivityTypeOption {
  value: string;
  label: string;
}

export interface LogActivityOwnerOption {
  id: string;
  label: string;
}

export interface LogActivitySavePayload {
  activityType: string;
  description: string;
  details: string | null;
  ownerId: string | null;
}

export interface LogActivityFormProps {
  activityTypes: readonly LogActivityTypeOption[];
  owners?: readonly LogActivityOwnerOption[];
  onSubmit: (payload: LogActivitySavePayload) => Promise<void>;
  onLogged?: () => void;
  onError?: (error: unknown) => void;
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function LogActivityButton({
  activityTypes,
  owners = [],
  onSubmit,
  onLogged,
  onError,
}: LogActivityFormProps) {
  const [open, setOpen] = useState(false);
  const defaultType = useMemo(
    () => activityTypes[0]?.value ?? "note",
    [activityTypes]
  );
  const [activityType, setActivityType] = useState(defaultType);
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setActivityType(defaultType);
    setDescription("");
    setDetails("");
    setOwnerId("");
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  const handleSave = async () => {
    const trimmedDescription = description.trim();
    if (!trimmedDescription) return;

    setSaving(true);
    try {
      await onSubmit({
        activityType,
        description: trimmedDescription,
        details: details.trim() || null,
        ownerId: ownerId || null,
      });
      onLogged?.();
      reset();
      setOpen(false);
    } catch (error) {
      onError?.(error);
    }
    setSaving(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 mt-1"
      >
        <PlusIcon />
        Log Activity
      </button>
    );
  }

  return (
    <div className="mt-3 p-3 rounded-md border border-border space-y-2.5 animate-in fade-in duration-150">
      <Select value={activityType} onValueChange={setActivityType}>
        <SelectTrigger className="h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {activityTypes.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="Description *"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        className="h-8 text-sm"
      />

      <Textarea
        placeholder="Details (optional)"
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        className="min-h-[60px] text-sm"
      />

      <Select value={ownerId} onValueChange={setOwnerId}>
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder="Owner (optional)" />
        </SelectTrigger>
        <SelectContent>
          {owners.map((owner) => (
            <SelectItem key={owner.id} value={owner.id}>
              {owner.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving || !description.trim()}
        >
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
