import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type SVGProps,
} from "react";
import {
  Check as IconCheck,
  ChevronDown as IconChevronDown,
  Pencil as IconPencil,
  Save as IconSave,
  Trash2 as IconTrash2,
  X as IconX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./core/DropdownMenu";

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M20 6 9 17l-5-5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        d="m6 9 6 6 6-6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 20h9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SaveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M17 21v-8H7v8" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 3v5h8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 6h18" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m-1 0v14a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11v6M14 11v6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M18 6 6 18M6 6l12 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface SavedColumnViewRow {
  id: string;
  name: string;
  columns: unknown;
  updated_at?: string | null;
}

export type SaveViewStatus =
  | "success"
  | "empty"
  | "duplicate"
  | "unavailable"
  | "error";

export type RenameViewStatus =
  | "success"
  | "empty"
  | "duplicate"
  | "unavailable"
  | "not_found"
  | "error";

export type DeleteViewStatus =
  | "success"
  | "unavailable"
  | "not_found"
  | "error";

type TriggerVariant = "tailwind" | "chrome";

export interface ColumnViewsControlsProps {
  userId: string | null;
  savedViews: SavedColumnViewRow[];
  activeViewId: string | null;
  isViewsLoading: boolean;
  isSavingView: boolean;
  renamingViewId: string | null;
  deletingViewId: string | null;
  savedViewsUnavailable: boolean;
  onApplySavedView: (viewRow: SavedColumnViewRow) => void;
  onSaveCurrentView: (rawName: string) => Promise<SaveViewStatus>;
  onRenameSavedView: (
    viewId: string,
    rawName: string,
    columnsOverride?: string[]
  ) => Promise<RenameViewStatus>;
  onDeleteSavedView: (viewId: string) => Promise<DeleteViewStatus>;
  onResetToOriginalView: () => void;
  currentColumns?: string[];
  triggerVariant?: TriggerVariant;
  chromeButtonStyle?: object;
}

export function ColumnViewsControls({
  userId,
  savedViews,
  activeViewId,
  isViewsLoading,
  isSavingView,
  renamingViewId,
  deletingViewId,
  savedViewsUnavailable,
  onApplySavedView,
  onSaveCurrentView,
  onRenameSavedView,
  onDeleteSavedView,
  onResetToOriginalView,
  currentColumns,
  triggerVariant = "tailwind",
  chromeButtonStyle,
}: ColumnViewsControlsProps) {
  const isChromeVariant = triggerVariant === "chrome";
  const hasColumnEditSupport = Array.isArray(currentColumns);
  const [isViewsMenuOpen, setIsViewsMenuOpen] = useState(false);
  const [isSaveViewPopoverOpen, setIsSaveViewPopoverOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [saveViewError, setSaveViewError] = useState<string | null>(null);
  const [editingViewId, setEditingViewId] = useState<string | null>(null);
  const [editingViewName, setEditingViewName] = useState("");
  const [pendingDeleteViewId, setPendingDeleteViewId] = useState<string | null>(
    null
  );
  const [viewActionError, setViewActionError] = useState<string | null>(null);

  const activeSelectedView = useMemo(
    () =>
      activeViewId
        ? savedViews.find((viewRow) => viewRow.id === activeViewId) ?? null
        : null,
    [activeViewId, savedViews]
  );
  const canUpdateActiveView = hasColumnEditSupport && Boolean(activeSelectedView);
  const isUpdatingActiveView = Boolean(
    activeSelectedView && renamingViewId === activeSelectedView.id
  );

  const activeViewLabel = useMemo(() => {
    if (savedViews.length === 0) return "New View";
    const activeView = activeViewId
      ? savedViews.find((viewRow) => viewRow.id === activeViewId)
      : null;
    const name = String(activeView?.name ?? "").trim();
    return name || "New View";
  }, [activeViewId, savedViews]);

  const submitSaveView = useCallback(async () => {
    const status = await onSaveCurrentView(newViewName);
    if (status === "success") {
      setSaveViewError(null);
      setNewViewName("");
      setIsSaveViewPopoverOpen(false);
      return;
    }
    if (status === "empty") {
      setSaveViewError("Enter a view name.");
      return;
    }
    if (status === "duplicate") {
      setSaveViewError("A view with this name already exists.");
      return;
    }
    if (status === "unavailable") {
      setSaveViewError("Saved views are unavailable.");
      return;
    }
    setSaveViewError("Failed to save view.");
  }, [newViewName, onSaveCurrentView]);

  const startRenameView = useCallback((viewId: string, currentName: string) => {
    setEditingViewId(viewId);
    setEditingViewName(currentName);
    setPendingDeleteViewId(null);
    setViewActionError(null);
  }, []);

  const cancelRenameView = useCallback(() => {
    setEditingViewId(null);
    setEditingViewName("");
    setViewActionError(null);
  }, []);

  const submitRenameView = useCallback(async () => {
    if (!editingViewId) return;
    const status = await onRenameSavedView(editingViewId, editingViewName);
    if (status === "success") {
      setEditingViewId(null);
      setEditingViewName("");
      setViewActionError(null);
      return;
    }
    if (status === "empty") {
      setViewActionError("Enter a view name.");
      return;
    }
    if (status === "duplicate") {
      setViewActionError("A view with this name already exists.");
      return;
    }
    if (status === "not_found") {
      setViewActionError("Saved view no longer exists.");
      setEditingViewId(null);
      return;
    }
    if (status === "unavailable") {
      setViewActionError("Saved views are unavailable.");
      return;
    }
    setViewActionError("Failed to rename view.");
  }, [editingViewId, editingViewName, onRenameSavedView]);

  const updateActiveViewFromButton = useCallback(async () => {
    if (!activeSelectedView || !currentColumns) return;
    const status = await onRenameSavedView(
      activeSelectedView.id,
      activeSelectedView.name,
      currentColumns
    );
    if (status === "success") {
      setSaveViewError(null);
      setViewActionError(null);
      return;
    }
    if (status === "not_found") {
      setViewActionError("Saved view no longer exists.");
      setIsViewsMenuOpen(true);
      return;
    }
    if (status === "unavailable") {
      setViewActionError("Saved views are unavailable.");
      setIsViewsMenuOpen(true);
      return;
    }
    setViewActionError("Failed to update view.");
    setIsViewsMenuOpen(true);
  }, [activeSelectedView, currentColumns, onRenameSavedView]);

  const startDeleteView = useCallback((viewId: string) => {
    setPendingDeleteViewId(viewId);
    setEditingViewId(null);
    setEditingViewName("");
    setViewActionError(null);
  }, []);

  const cancelDeleteView = useCallback(() => {
    setPendingDeleteViewId(null);
    setViewActionError(null);
  }, []);

  const confirmDeleteView = useCallback(
    async (viewId: string) => {
      const status = await onDeleteSavedView(viewId);
      if (status === "success") {
        setPendingDeleteViewId(null);
        if (editingViewId === viewId) {
          setEditingViewId(null);
          setEditingViewName("");
        }
        setViewActionError(null);
        return;
      }
      if (status === "not_found") {
        setViewActionError("Saved view no longer exists.");
        return;
      }
      if (status === "unavailable") {
        setViewActionError("Saved views are unavailable.");
        return;
      }
      setViewActionError("Failed to delete view.");
    },
    [editingViewId, onDeleteSavedView]
  );

  const chromeTriggerStyle = isChromeVariant
    ? ({ ...(chromeButtonStyle ?? {}), padding: "8px 10px" } as CSSProperties)
    : undefined;
  const chromeActionButtonStyle = isChromeVariant
    ? ({
        ...(chromeButtonStyle ?? {}),
        padding: "6px 10px",
        height: 30,
        fontSize: 12,
      } as CSSProperties)
    : undefined;

  return (
    <div className="flex items-center gap-2">
      {canUpdateActiveView ? (
        <button
          className={
            isChromeVariant
              ? undefined
              : "inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-background hover:bg-muted/50 text-[13px] disabled:opacity-60"
          }
          style={chromeTriggerStyle}
          disabled={isUpdatingActiveView || isViewsLoading || !userId}
          type="button"
          onClick={() => {
            void updateActiveViewFromButton();
          }}
        >
          <IconSave className={isChromeVariant ? undefined : "h-3.5 w-3.5"} size={14} />
          {isUpdatingActiveView ? "Updating..." : "Update View"}
        </button>
      ) : (
        <DropdownMenu
          open={isSaveViewPopoverOpen}
          onOpenChange={(open) => {
            setIsSaveViewPopoverOpen(open);
            if (!open) setSaveViewError(null);
          }}
        >
          <DropdownMenuTrigger asChild>
            <button
              className={
                isChromeVariant
                  ? undefined
                  : "inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-background hover:bg-muted/50 text-[13px]"
              }
              style={chromeTriggerStyle}
              disabled={isSavingView || isViewsLoading || !userId}
              type="button"
            >
              <IconSave className={isChromeVariant ? undefined : "h-3.5 w-3.5"} size={14} />
              Save View
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[260px] p-3">
            <div
              className="flex flex-col gap-2"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void submitSaveView();
                }
              }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                View Name
              </span>
              <input
                value={newViewName}
                onChange={(event) => {
                  setNewViewName(event.target.value);
                  if (saveViewError) setSaveViewError(null);
                }}
                placeholder="My view"
                autoFocus
                className="text-[13px] h-8 px-2.5 rounded-md border border-border bg-background"
              />
              {saveViewError ? (
                <span className="text-[11px] text-destructive">{saveViewError}</span>
              ) : null}
              <div className="mt-0.5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSaveViewPopoverOpen(false);
                    setSaveViewError(null);
                  }}
                  className={
                    isChromeVariant
                      ? undefined
                      : "inline-flex items-center h-7 px-2.5 rounded-md border border-border bg-background hover:bg-muted/50 text-xs"
                  }
                  style={chromeActionButtonStyle}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void submitSaveView();
                  }}
                  disabled={isSavingView}
                  className={
                    isChromeVariant
                      ? undefined
                      : "inline-flex items-center h-7 px-2.5 rounded-md border border-border bg-background hover:bg-muted/50 text-xs disabled:opacity-60"
                  }
                  style={chromeActionButtonStyle}
                >
                  {isSavingView ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu
        open={isViewsMenuOpen}
        onOpenChange={(open) => {
          setIsViewsMenuOpen(open);
          if (!open) {
            setEditingViewId(null);
            setEditingViewName("");
            setPendingDeleteViewId(null);
            setViewActionError(null);
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <button
            className={
              isChromeVariant
                ? undefined
                : "inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-background hover:bg-muted/50 text-[13px]"
            }
            style={chromeTriggerStyle}
            type="button"
            title={activeViewLabel}
          >
            <span className="inline-block max-w-[140px] truncate align-bottom">
              {activeViewLabel}
            </span>
            <IconChevronDown
              className={isChromeVariant ? undefined : "h-3 w-3"}
              size={12}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[130px]">
          {savedViewsUnavailable ? (
            <div className="px-2.5 py-2 text-[13px] text-muted-foreground">
              Saved views unavailable.
            </div>
          ) : isViewsLoading ? (
            <div className="px-2.5 py-2 text-[13px] text-muted-foreground">
              Loading views...
            </div>
          ) : savedViews.length === 0 ? (
            <div className="px-2.5 py-2 text-[13px] text-muted-foreground">
              No saved views
            </div>
          ) : (
            savedViews.map((viewRow) => (
              <DropdownMenuItem
                key={viewRow.id}
                onSelect={(event) => {
                  if (
                    editingViewId === viewRow.id ||
                    pendingDeleteViewId === viewRow.id
                  ) {
                    event.preventDefault();
                    return;
                  }
                  setViewActionError(null);
                  onApplySavedView(viewRow);
                }}
                className="py-2 text-[14px]"
              >
                {editingViewId === viewRow.id ? (
                  <div
                    className="flex w-full items-center gap-2"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  >
                    <input
                      value={editingViewName}
                      onChange={(event) => {
                        setEditingViewName(event.target.value);
                        if (viewActionError) setViewActionError(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          void submitRenameView();
                        }
                        if (event.key === "Escape") {
                          event.preventDefault();
                          cancelRenameView();
                        }
                      }}
                      autoFocus
                      className="h-8 w-full rounded border border-border bg-background px-2.5 text-[13px]"
                    />
                    <button
                      type="button"
                      className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-background hover:bg-muted/50 disabled:opacity-60"
                      disabled={renamingViewId === viewRow.id}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        void submitRenameView();
                      }}
                    >
                      <IconCheck className="h-4 w-4" size={16} />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-background hover:bg-muted/50"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        cancelRenameView();
                      }}
                    >
                      <IconX className="h-4 w-4" size={16} />
                    </button>
                  </div>
                ) : pendingDeleteViewId === viewRow.id ? (
                  <div
                    className="flex w-full items-center justify-between gap-2"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  >
                    <span className="truncate text-[13px] text-destructive">
                      Delete this view?
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-background hover:bg-muted/50 disabled:opacity-60"
                        disabled={deletingViewId === viewRow.id}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          void confirmDeleteView(viewRow.id);
                        }}
                      >
                        <IconCheck className="h-4 w-4" size={16} />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-background hover:bg-muted/50"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          cancelDeleteView();
                        }}
                      >
                        <IconX className="h-4 w-4" size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full items-center gap-2">
                    <span className="min-w-0 flex-1 truncate pr-1 text-[15px] font-medium">
                      {viewRow.name}
                    </span>
                    <div className="ml-auto flex items-center gap-1 pl-1">
                      <button
                        type="button"
                        aria-label={`Edit ${viewRow.name}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-transparent hover:border-border hover:bg-muted/60"
                        disabled={Boolean(renamingViewId || deletingViewId)}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          startRenameView(viewRow.id, viewRow.name);
                        }}
                      >
                        <IconPencil className="h-4 w-4" size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${viewRow.name}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-transparent hover:border-border hover:bg-muted/60"
                        disabled={Boolean(renamingViewId || deletingViewId)}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          startDeleteView(viewRow.id);
                        }}
                      >
                        <IconTrash2 className="h-4 w-4" size={16} />
                      </button>
                      {activeViewId === viewRow.id ? (
                        <IconCheck className="h-4 w-4 text-muted-foreground" size={16} />
                      ) : null}
                    </div>
                  </div>
                )}
              </DropdownMenuItem>
            ))
          )}
          {viewActionError ? (
            <div className="px-2.5 py-2 text-[12px] text-destructive">
              {viewActionError}
            </div>
          ) : null}
          {savedViews.length > 0 ? (
            <DropdownMenuItem
              onSelect={onResetToOriginalView}
              className="py-2 text-[13px]"
              disabled={isViewsLoading}
            >
              Create New View
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
