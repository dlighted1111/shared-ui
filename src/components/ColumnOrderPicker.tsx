import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type SVGProps,
} from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./core/DropdownMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./core/Tooltip";
import { SearchField } from "./SearchField";
import type { ColumnVisibilityOption } from "./ColumnVisibilityPicker";

function ArrowDownUpIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M7 3v14m0 0-3-3m3 3 3-3M17 21V7m0 0-3 3m3-3 3 3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GripVerticalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="8" strokeWidth="2" />
      <path d="m21 21-4.3-4.3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type PickerVariant = "tailwind" | "chrome";

export interface ColumnOrderPickerProps {
  columns: readonly ColumnVisibilityOption[];
  visibleColumns: string[];
  onVisibleColumnsChange: (nextColumns: string[]) => void;
  minVisibleColumns?: number;
  disabledKeys?: readonly string[];
  searchPlaceholder?: string;
  triggerVariant?: PickerVariant;
  triggerIcon?: ReactNode;
  chromeButtonStyle?: object;
}

interface SortableColumnRowProps {
  id: string;
  label: string;
  checked: boolean;
  toggleDisabled: boolean;
  dragDisabled: boolean;
  onToggle: () => void;
  isDragging: boolean;
}

function SortableColumnRow({
  id,
  label,
  checked,
  toggleDisabled,
  dragDisabled,
  onToggle,
  isDragging,
}: SortableColumnRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    disabled: dragDisabled,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform ? { ...transform, x: 0 } : null),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] ${
        isDragging ? "bg-muted ring-1 ring-border" : "hover:bg-muted/60"
      }`}
      onClick={() => {
        if (toggleDisabled) return;
        onToggle();
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={toggleDisabled}
        onChange={onToggle}
        onClick={(event) => event.stopPropagation()}
        className="h-3.5 w-3.5 rounded border-border accent-foreground"
      />
      <span
        className={`min-w-0 flex-1 truncate ${
          toggleDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      >
        {label}
      </span>
      <button
        type="button"
        aria-label={`Reorder ${label}`}
        className={`inline-flex h-6 w-6 items-center justify-center rounded ${
          dragDisabled
            ? "cursor-not-allowed opacity-40"
            : "cursor-grab active:cursor-grabbing"
        }`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        {...attributes}
        {...listeners}
        disabled={dragDisabled}
      >
        <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return false;
  }
  return true;
}

export function ColumnOrderPicker({
  columns,
  visibleColumns,
  onVisibleColumnsChange,
  minVisibleColumns = 2,
  disabledKeys,
  searchPlaceholder = "Search",
  triggerVariant = "tailwind",
  triggerIcon,
  chromeButtonStyle,
}: ColumnOrderPickerProps) {
  const [open, setOpen] = useState(false);
  const [draggingKey, setDraggingKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const selectAllRef = useRef<HTMLInputElement | null>(null);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const isSearchActive = normalizedSearch.length > 0;
  const isChromeVariant = triggerVariant === "chrome";
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    })
  );
  const disabledKeySet = useMemo(
    () => new Set((disabledKeys ?? []).map((key) => String(key ?? "").trim())),
    [disabledKeys]
  );
  const visibleKeySet = useMemo(() => new Set(visibleColumns), [visibleColumns]);

  const orderedColumns = useMemo(() => {
    const byKey = new Map(columns.map((column) => [column.key, column]));
    const seen = new Set<string>();
    const ordered: ColumnVisibilityOption[] = [];

    for (const key of visibleColumns) {
      const column = byKey.get(key);
      if (!column || seen.has(key)) continue;
      ordered.push(column);
      seen.add(key);
    }

    for (const column of columns) {
      if (seen.has(column.key)) continue;
      ordered.push(column);
      seen.add(column.key);
    }

    return ordered;
  }, [columns, visibleColumns]);

  const orderedKeys = useMemo(
    () => orderedColumns.map((column) => column.key),
    [orderedColumns]
  );
  const keyIndexMap = useMemo(
    () => new Map(orderedKeys.map((key, index) => [key, index])),
    [orderedKeys]
  );
  const filteredColumns = useMemo(() => {
    if (!normalizedSearch) return orderedColumns;
    return orderedColumns.filter((column) =>
      column.label.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch, orderedColumns]);

  const toggleColumn = useCallback(
    (key: string) => {
      const checked = visibleKeySet.has(key);
      if (checked) {
        onVisibleColumnsChange(
          visibleColumns.filter((columnKey) => columnKey !== key)
        );
        return;
      }

      const nextVisible = [...visibleColumns, key].sort(
        (a, b) => (keyIndexMap.get(a) ?? 0) - (keyIndexMap.get(b) ?? 0)
      );
      onVisibleColumnsChange(nextVisible);
    },
    [keyIndexMap, onVisibleColumnsChange, visibleColumns, visibleKeySet]
  );
  const toggleableKeys = useMemo(
    () => orderedKeys.filter((key) => !disabledKeySet.has(key)),
    [disabledKeySet, orderedKeys]
  );
  const allToggleableChecked =
    toggleableKeys.length > 0 &&
    toggleableKeys.every((key) => visibleKeySet.has(key));
  const someToggleableChecked = toggleableKeys.some((key) =>
    visibleKeySet.has(key)
  );
  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate =
      !allToggleableChecked && someToggleableChecked;
  }, [allToggleableChecked, someToggleableChecked]);
  const handleToggleAll = useCallback(
    (nextChecked: boolean) => {
      if (nextChecked) {
        onVisibleColumnsChange(orderedKeys);
        return;
      }

      const lockedVisible = visibleColumns.filter((key) => disabledKeySet.has(key));
      const fallbackVisible = [...lockedVisible];
      for (const key of orderedKeys) {
        if (fallbackVisible.length >= minVisibleColumns) break;
        if (fallbackVisible.includes(key)) continue;
        fallbackVisible.push(key);
      }
      onVisibleColumnsChange(fallbackVisible);
    },
    [
      disabledKeySet,
      minVisibleColumns,
      onVisibleColumnsChange,
      orderedKeys,
      visibleColumns,
    ]
  );

  const sortableIds = useMemo(
    () => filteredColumns.map((column) => column.key),
    [filteredColumns]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      if (isSearchActive) return;
      setDraggingKey(String(event.active.id));
    },
    [isSearchActive]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setDraggingKey(null);
      if (isSearchActive) return;
      if (!over) return;
      const activeId = String(active.id);
      const overId = String(over.id);
      if (!activeId || !overId || activeId === overId) return;

      const fromIndex = orderedKeys.indexOf(activeId);
      const toIndex = orderedKeys.indexOf(overId);
      if (fromIndex < 0 || toIndex < 0) return;

      const reordered = arrayMove(orderedKeys, fromIndex, toIndex);
      const nextVisible = reordered.filter((key) => visibleKeySet.has(key));
      if (arraysEqual(nextVisible, visibleColumns)) return;
      onVisibleColumnsChange(nextVisible);
    },
    [
      isSearchActive,
      onVisibleColumnsChange,
      orderedKeys,
      visibleColumns,
      visibleKeySet,
    ]
  );

  const triggerStyle = isChromeVariant
    ? ({ ...(chromeButtonStyle ?? {}), padding: "8px 10px" } as CSSProperties)
    : undefined;
  const menuMaxHeight =
    "min(60vh, var(--radix-dropdown-menu-content-available-height))";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={
                  isChromeVariant
                    ? undefined
                    : "inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-background hover:bg-muted/50 text-[13px]"
                }
                style={triggerStyle}
              >
                {triggerIcon ?? (
                  <ArrowDownUpIcon
                    className={isChromeVariant ? undefined : "h-3.5 w-3.5"}
                  />
                )}
                Columns
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Manage columns</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent
        align="end"
        collisionPadding={8}
        className="flex w-[260px] flex-col overflow-hidden p-0"
        style={{ maxHeight: menuMaxHeight }}
      >
        <div className="border-b border-border px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Columns
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            Check to show, uncheck to hide, drag to reorder
          </div>
        </div>
        <div className="border-b border-border p-2">
          <div className="flex items-center gap-2">
            <label className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-[12px] text-foreground">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allToggleableChecked}
                disabled={toggleableKeys.length === 0}
                onChange={(event) => handleToggleAll(event.target.checked)}
                className="h-3.5 w-3.5 rounded border-border accent-foreground"
              />
              All
            </label>
            <SearchField
              value={searchTerm}
              onValueChange={setSearchTerm}
              debounceMs={0}
              placeholder={searchPlaceholder}
              leading={<SearchIcon className="h-3.5 w-3.5 text-muted-foreground" />}
              containerClassName="w-full"
              inputClassName="h-[34px] text-[13px]"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto py-1">
          {filteredColumns.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              No columns found.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setDraggingKey(null)}
            >
              <SortableContext
                items={sortableIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-0.5 px-1.5">
                  {filteredColumns.map((column) => {
                    const checked = visibleKeySet.has(column.key);
                    const hardDisabled = disabledKeySet.has(column.key);
                    const minimumDisabled =
                      checked && visibleColumns.length <= minVisibleColumns;
                    const toggleDisabled = hardDisabled || minimumDisabled;
                    return (
                      <SortableColumnRow
                        key={column.key}
                        id={column.key}
                        label={column.label}
                        checked={checked}
                        toggleDisabled={toggleDisabled}
                        dragDisabled={isSearchActive}
                        onToggle={() => {
                          if (toggleDisabled) return;
                          toggleColumn(column.key);
                        }}
                        isDragging={draggingKey === column.key}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
