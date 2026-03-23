import { useEffect, useRef, useState } from "react";

export interface SavedSearchRecord {
  id: string;
  name: string;
  filter_state: Record<string, unknown>;
}

export interface SavedSearchCreateInput {
  module: string;
  name: string;
  filter_state: Record<string, unknown>;
  userId?: string;
}

export interface SavedSearchesProps {
  module: string;
  userId?: string;
  currentFilters: Record<string, unknown>;
  defaultFilters: Record<string, unknown>;
  onApply: (filters: Record<string, unknown>) => void;
  fetchSearches: (module: string) => Promise<SavedSearchRecord[]>;
  createSearch: (input: SavedSearchCreateInput) => Promise<SavedSearchRecord>;
  deleteSearch: (id: string) => Promise<void>;
  isUnavailableError?: (error: unknown) => boolean;
}

function hasNonDefaultFilters(
  current: Record<string, unknown>,
  defaults: Record<string, unknown>
) {
  return Object.keys(defaults).some((key) => {
    const currentValue = current[key];
    const defaultValue = defaults[key];
    return JSON.stringify(currentValue) !== JSON.stringify(defaultValue);
  });
}

function BookmarkIcon() {
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
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function SavedSearches({
  module,
  userId,
  currentFilters,
  defaultFilters,
  onApply,
  fetchSearches,
  createSearch,
  deleteSearch,
  isUnavailableError,
}: SavedSearchesProps) {
  const [searches, setSearches] = useState<SavedSearchRecord[]>([]);
  const [showSave, setShowSave] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAvailable) return;
    (async () => {
      try {
        const rows = await fetchSearches(module);
        setSearches(rows ?? []);
      } catch (error) {
        if (isUnavailableError?.(error)) {
          setIsAvailable(false);
        }
      }
    })();
  }, [module, isAvailable, fetchSearches, isUnavailableError]);

  useEffect(() => {
    if (!showSave) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowSave(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSave]);

  const handleSave = async () => {
    const name = saveName.trim();
    if (!name) return;
    try {
      const created = await createSearch({
        module,
        name,
        filter_state: currentFilters,
        userId,
      });
      setSearches((prev) => [created, ...prev]);
      setSaveName("");
      setShowSave(false);
    } catch (error) {
      if (isUnavailableError?.(error)) {
        setIsAvailable(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSearch(id);
      setSearches((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      if (isUnavailableError?.(error)) {
        setIsAvailable(false);
      }
    }
  };

  if (!isAvailable) return null;

  const showSaveButton = hasNonDefaultFilters(currentFilters, defaultFilters);

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {searches.map((search) => (
        <button
          key={search.id}
          onClick={() => onApply(search.filter_state)}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium text-foreground hover:bg-muted group"
        >
          {search.name}
          <span
            onClick={(event) => {
              event.stopPropagation();
              void handleDelete(search.id);
            }}
            className="opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <CloseIcon />
          </span>
        </button>
      ))}

      {showSaveButton ? (
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setShowSave((previous) => !previous)}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-border bg-background px-2 py-1 text-[11px] text-foreground hover:bg-muted"
          >
            <BookmarkIcon />
            Save Search
          </button>
          {showSave ? (
            <div className="absolute left-0 top-[calc(100%+4px)] z-50 rounded border border-border bg-background p-3 w-[220px]">
              <input
                autoFocus
                value={saveName}
                onChange={(event) => setSaveName(event.target.value)}
                placeholder="Name this search"
                className="w-full border border-border rounded px-2 py-1 text-xs bg-background text-foreground outline-none mb-2"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void handleSave();
                  }
                }}
              />
              <button
                onClick={() => {
                  void handleSave();
                }}
                className="w-full rounded bg-foreground text-background text-xs py-1 font-medium"
              >
                Save
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
