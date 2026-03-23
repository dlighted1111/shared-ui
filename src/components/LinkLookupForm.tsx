import { useEffect, useState } from "react";
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./core";

export interface LinkLookupOption {
  id: string;
  primaryLabel: string;
  secondaryLabel?: string;
  searchValue?: string;
}

export interface LinkLookupRoleOption {
  value: string;
  label: string;
}

export interface LinkLookupFormProps {
  triggerLabel: string;
  searchPlaceholder: string;
  rolePlaceholder: string;
  roleMode: "text" | "select";
  roleOptions?: readonly LinkLookupRoleOption[];
  initialRole?: string;
  noResultsLabel?: string;
  submitLabel?: string;
  cancelLabel?: string;
  minSearchLength?: number;
  debounceMs?: number;
  onSubmit: (selectedId: string, role: string) => Promise<void>;
  onError?: (error: unknown) => void;
  onLinked?: () => void;
  loadOptions: (query: string) => Promise<LinkLookupOption[]>;
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

export function LinkLookupForm({
  triggerLabel,
  searchPlaceholder,
  rolePlaceholder,
  roleMode,
  roleOptions,
  initialRole = "",
  noResultsLabel = "No results found",
  submitLabel = "Add",
  cancelLabel = "Cancel",
  minSearchLength = 2,
  debounceMs = 300,
  onSubmit,
  onError,
  onLinked,
  loadOptions,
}: LinkLookupFormProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<LinkLookupOption[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [role, setRole] = useState(initialRole);
  const [saving, setSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setResults([]);
      setSelectedId("");
      setShowDropdown(false);
      setRole(initialRole);
    }
  }, [initialRole, open]);

  useEffect(() => {
    if (!open) return;
    if (search.length < minSearchLength) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      const next = await loadOptions(search);
      setResults(next);
      setShowDropdown(true);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [debounceMs, loadOptions, minSearchLength, open, search]);

  const pickOption = (option: LinkLookupOption) => {
    setSelectedId(option.id);
    setSearch(option.searchValue ?? option.primaryLabel);
    setShowDropdown(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedId) return;
    if (!role.trim()) return;
    setSaving(true);
    try {
      await onSubmit(selectedId, role);
      onLinked?.();
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
        {triggerLabel}
      </button>
    );
  }

  return (
    <div className="mt-3 p-3 rounded-md border border-border space-y-2.5 animate-in fade-in duration-150">
      <div className="relative">
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setSelectedId("");
            setShowDropdown(true);
          }}
          className="h-8 text-sm"
        />
        {showDropdown && results.length > 0 ? (
          <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-md shadow-sm max-h-[180px] overflow-y-auto">
            {results.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => pickOption(option)}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-secondary transition-colors duration-150"
              >
                <span className="text-foreground">{option.primaryLabel}</span>
                {option.secondaryLabel ? (
                  <span className="text-xs text-muted-foreground ml-2">
                    {option.secondaryLabel}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
        {showDropdown &&
        search.length >= minSearchLength &&
        results.length === 0 ? (
          <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-md p-3 text-xs text-muted-foreground text-center">
            {noResultsLabel}
          </div>
        ) : null}
      </div>

      {roleMode === "select" ? (
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder={rolePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {(roleOptions ?? []).map((roleOption) => (
              <SelectItem key={roleOption.value} value={roleOption.value}>
                {roleOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          placeholder={rolePlaceholder}
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="h-8 text-sm"
        />
      )}

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={saving || !selectedId || !role.trim()}
        >
          {submitLabel}
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel}>
          {cancelLabel}
        </Button>
      </div>
    </div>
  );
}
