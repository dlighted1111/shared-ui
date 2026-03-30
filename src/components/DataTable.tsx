import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../lib/cx';
import { EmptyState } from './EmptyState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './core/Select';
import { Skeleton } from './core/Skeleton';

export type DataTableRowKey = string | number;
export type DataTableMobileMode = 'auto' | 'table' | 'cards';
export type DataTableExpandMode = 'single' | 'multiple';
export type DataTableSelectionVariant = 'inline' | 'column';
export type DataTableHeaderVariant = 'default' | 'contrast';

type DataTableComparable = string | number | boolean | Date | null | undefined;

export interface DataTableColumnDef<T extends Record<string, unknown>> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  maxWidth?: number;
  frozen?: boolean;
  minWidth?: number;
  render?: (row: T) => ReactNode;
  sortValue?: (row: T) => DataTableComparable;
  sortComparator?: (a: T, b: T) => number;
}

export interface DataTableFilterDef {
  key: string;
  label: string;
  value: string;
}

export type DataTableDensity = 'comfortable' | 'compact';
export type DataTableSortDirection = 'asc' | 'desc';

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumnDef<T>[];
  data: T[];
  filters?: DataTableFilterDef[];
  onRemoveFilter?: (key: string) => void;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  frozenColumns?: number;
  density?: DataTableDensity;
  sortKey?: string | null;
  sortDir?: DataTableSortDirection;
  onSortChange?: (
    sortKey: string | null,
    sortDir: DataTableSortDirection,
  ) => void;
  renderColumnMeta?: (column: DataTableColumnDef<T>) => ReactNode;
  getRowKey?: (row: T, index: number) => DataTableRowKey;
  rowAccentColor?: (row: T) => string | null | undefined;
  enableRowSelection?: boolean;
  selectionVariant?: DataTableSelectionVariant;
  isRowSelectable?: (row: T) => boolean;
  selectedRowKeys?: Iterable<DataTableRowKey>;
  defaultSelectedRowKeys?: Iterable<DataTableRowKey>;
  onSelectedRowKeysChange?: (selectedRowKeys: DataTableRowKey[]) => void;
  renderExpandedRow?: (row: T) => ReactNode;
  expandedRowKeys?: Iterable<DataTableRowKey>;
  defaultExpandedRowKeys?: Iterable<DataTableRowKey>;
  onExpandedRowKeysChange?: (expandedRowKeys: DataTableRowKey[]) => void;
  expandMode?: DataTableExpandMode;
  mobileMode?: DataTableMobileMode;
  mobileBreakpoint?: number;
  renderMobileCard?: (row: T) => ReactNode;
  mobilePrimaryColumnKey?: string;
  mobileSecondaryColumnKeys?: string[];
  scrollMaxHeight?: number | string;
  headerVariant?: DataTableHeaderVariant;
}

const ROW_HEIGHTS: Record<DataTableDensity, string> = {
  comfortable: 'h-[48px]',
  compact: 'h-[36px]',
};

const CELL_PADDING: Record<DataTableDensity, string> = {
  comfortable: 'px-4 py-2.5',
  compact: 'px-4 py-2',
};

const CELL_FONT: Record<DataTableDensity, string> = {
  comfortable: 'text-[15px]',
  compact: 'text-sm',
};

const HEADER_HEIGHT: Record<DataTableDensity, string> = {
  comfortable: 'h-10',
  compact: 'h-8',
};

const HEADER_FONT: Record<DataTableDensity, string> = {
  comfortable: 'text-[15px]',
  compact: 'text-sm',
};

const CARD_PRIMARY_FONT: Record<DataTableDensity, string> = {
  comfortable: 'text-[17px]',
  compact: 'text-base',
};

const CARD_SECONDARY_FONT: Record<DataTableDensity, string> = {
  comfortable: 'text-[15px]',
  compact: 'text-sm',
};

const DEFAULT_FIXED_TABLE_BREAKPOINT = 1300;
const SELECTION_COLUMN_WIDTH = 64;
const DEFAULT_CELL_MAX_WIDTH = 320;
const DEFAULT_PAGE_SIZE = 25;
const LARGE_DATASET_PAGE_THRESHOLD = 1000;
const LARGE_DATASET_DEFAULT_PAGE_SIZE = 500;
const SELECTION_CHECKBOX_STYLE: CSSProperties = {
  accentColor: 'var(--lt-color-primary)',
  width: 16,
  height: 16,
  margin: 0,
};

function inferColumnMinWidth(
  column: DataTableColumnDef<Record<string, unknown>>,
): number {
  const label = `${column.header} ${column.key}`.toLowerCase();

  if (
    label.includes('property') ||
    label.includes('unit address') ||
    label.includes('address')
  )
    return 180;
  if (
    label.includes('unit') ||
    label.includes('name') ||
    label.includes('tenant')
  )
    return 130;
  if (
    label.includes('type') ||
    label.includes('status') ||
    label.includes('phase')
  )
    return 120;
  if (label.includes('street')) return 160;
  if (label.includes('city') || label.includes('state')) return 100;
  if (
    label.includes('beds') ||
    label.includes('baths') ||
    label === 'bed' ||
    label === 'bath'
  )
    return 70;
  if (label.includes('sq ft') || label.includes('sqft')) return 80;
  if (
    label.includes('rent') ||
    label.includes('market') ||
    label.includes('advertised')
  )
    return 120;
  if (
    label.includes('listed') ||
    label.includes('certified') ||
    label.includes('collections') ||
    label.includes('boolean') ||
    label.includes('active') ||
    label.includes('hidden')
  ) {
    return 80;
  }
  return 100;
}

function parsePixelWidth(value?: string): number | null {
  if (!value) return null;
  const normalized = value.trim();
  if (!normalized) return null;

  if (normalized.endsWith('px')) {
    const parsed = Number.parseFloat(normalized.slice(0, -2));
    return Number.isFinite(parsed) ? parsed : null;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && /^-?\d+(\.\d+)?$/.test(normalized)
    ? parsed
    : null;
}

function toRowKeySet(values?: Iterable<DataTableRowKey>): Set<DataTableRowKey> {
  if (!values) return new Set<DataTableRowKey>();
  return new Set<DataTableRowKey>(values);
}

function compareDataTableValues(
  aValue: DataTableComparable,
  bValue: DataTableComparable,
): number {
  if (aValue == null && bValue == null) return 0;
  if (aValue == null) return 1;
  if (bValue == null) return -1;

  if (aValue instanceof Date || bValue instanceof Date) {
    const toEpoch = (value: DataTableComparable): number => {
      if (value instanceof Date) return value.getTime();
      if (typeof value === 'string' || typeof value === 'number') {
        return new Date(value).getTime();
      }
      return Number.NaN;
    };
    const aTime = toEpoch(aValue);
    const bTime = toEpoch(bValue);
    if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) {
      return aTime - bTime;
    }
  }

  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return aValue - bValue;
  }

  if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
    return Number(aValue) - Number(bValue);
  }

  return String(aValue).localeCompare(String(bValue), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

function SortUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function SortDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="m5 12 7 7 7-7" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SortNeutralIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-30 shrink-0"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="m8 7 4-4 4 4" />
      <path d="M12 3v18" />
      <path d="m8 17 4 4 4-4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="12"
      height="12"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function FileTextIcon({
  size = 48,
  className,
  strokeWidth = 2,
}: {
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  filters,
  onRemoveFilter,
  onRowClick,
  rowClassName,
  loading = false,
  emptyMessage = 'No data found.',
  pageSize: pageSizeProp,
  pageSizeOptions = [25, 50, 100],
  frozenColumns,
  density: externalDensity,
  sortKey,
  sortDir,
  onSortChange,
  renderColumnMeta,
  getRowKey,
  rowAccentColor,
  enableRowSelection = false,
  selectionVariant = 'inline',
  isRowSelectable,
  selectedRowKeys: selectedRowKeysProp,
  defaultSelectedRowKeys,
  onSelectedRowKeysChange,
  renderExpandedRow,
  expandedRowKeys: expandedRowKeysProp,
  defaultExpandedRowKeys,
  onExpandedRowKeysChange,
  expandMode = 'multiple',
  mobileMode = 'auto',
  mobileBreakpoint = DEFAULT_FIXED_TABLE_BREAKPOINT,
  renderMobileCard,
  mobilePrimaryColumnKey,
  mobileSecondaryColumnKeys,
  scrollMaxHeight,
  headerVariant = 'default',
}: DataTableProps<T>) {
  const hasConfiguredInitialPageSize =
    typeof pageSizeProp === 'number' &&
    Number.isFinite(pageSizeProp) &&
    pageSizeProp > 0;
  const autoPageSize =
    data.length > LARGE_DATASET_PAGE_THRESHOLD
      ? LARGE_DATASET_DEFAULT_PAGE_SIZE
      : DEFAULT_PAGE_SIZE;
  const initialPageSize = hasConfiguredInitialPageSize
    ? Math.floor(pageSizeProp)
    : autoPageSize;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [pageSizeTouched, setPageSizeTouched] = useState(false);
  const [internalDensity] = useState<DataTableDensity>('comfortable');
  const [internalSortKey, setInternalSortKey] = useState<string | null>(null);
  const [internalSortDir, setInternalSortDir] =
    useState<DataTableSortDirection>('asc');
  const [internalSelectedRowKeys, setInternalSelectedRowKeys] = useState<
    Set<DataTableRowKey>
  >(() => toRowKeySet(defaultSelectedRowKeys));
  const [internalExpandedRowKeys, setInternalExpandedRowKeys] = useState<
    Set<DataTableRowKey>
  >(() => toRowKeySet(defaultExpandedRowKeys));
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const density = externalDensity ?? internalDensity;
  const resolvedSortKey =
    sortKey === undefined ? internalSortKey : (sortKey ?? null);
  const resolvedSortDir = sortDir ?? internalSortDir;
  const selectedRowKeys = useMemo(
    () =>
      selectedRowKeysProp === undefined
        ? internalSelectedRowKeys
        : toRowKeySet(selectedRowKeysProp),
    [internalSelectedRowKeys, selectedRowKeysProp],
  );
  const expandedRowKeys = useMemo(
    () =>
      expandedRowKeysProp === undefined
        ? internalExpandedRowKeys
        : toRowKeySet(expandedRowKeysProp),
    [expandedRowKeysProp, internalExpandedRowKeys],
  );

  const isCardsMode = mobileMode === 'cards';
  const isMobileScrollableTable = mobileMode !== 'cards' && isMobileViewport;
  const isContrastHeader = headerVariant === 'contrast';
  const headerContainerClass = isContrastHeader
    ? 'sticky top-0 z-10 bg-white'
    : 'sticky top-0 z-10 bg-muted';
  const headerRowClass = isContrastHeader
    ? 'border-b-2 border-black'
    : 'border-b border-border';
  const headerTextClass = isContrastHeader
    ? 'text-black'
    : 'text-muted-foreground';
  const frozenHeaderBgClass = isContrastHeader ? 'bg-white' : 'bg-muted';
  const frozenHeaderBorderClass = isContrastHeader
    ? 'border-r border-black'
    : 'border-r border-border';

  useEffect(() => {
    if (mobileMode === 'cards') return;
    if (typeof window === 'undefined') return;

    const query = window.matchMedia(
      `(max-width: ${Math.max(1, mobileBreakpoint) - 1}px)`,
    );
    const updateViewport = () => setIsMobileViewport(query.matches);
    updateViewport();
    query.addEventListener('change', updateViewport);
    return () => query.removeEventListener('change', updateViewport);
  }, [mobileBreakpoint, mobileMode]);

  const updateSelectedRowKeys = useCallback(
    (next: Set<DataTableRowKey>) => {
      if (selectedRowKeysProp === undefined) {
        setInternalSelectedRowKeys(next);
      }
      onSelectedRowKeysChange?.(Array.from(next));
    },
    [onSelectedRowKeysChange, selectedRowKeysProp],
  );

  const updateExpandedRowKeys = useCallback(
    (next: Set<DataTableRowKey>) => {
      if (expandedRowKeysProp === undefined) {
        setInternalExpandedRowKeys(next);
      }
      onExpandedRowKeysChange?.(Array.from(next));
    },
    [expandedRowKeysProp, onExpandedRowKeysChange],
  );

  const setSortState = useCallback(
    (key: string | null, dir: DataTableSortDirection) => {
      if (onSortChange) {
        onSortChange(key, dir);
        return;
      }
      setInternalSortKey(key);
      setInternalSortDir(dir);
    },
    [onSortChange],
  );

  const handleSort = useCallback(
    (key: string) => {
      if (resolvedSortKey === key) {
        if (resolvedSortDir === 'asc') {
          setSortState(key, 'desc');
        } else {
          setSortState(null, 'asc');
        }
      } else {
        setSortState(key, 'asc');
      }
      setPage(0);
    },
    [resolvedSortDir, resolvedSortKey, setSortState],
  );

  const resolvedColumns = useMemo(() => {
    if (frozenColumns != null) {
      return columns.map((column, index) => ({
        ...column,
        frozen: index < frozenColumns,
      }));
    }
    return columns;
  }, [columns, frozenColumns]);

  const columnMinWidths = useMemo(
    () =>
      resolvedColumns.map(
        (column) =>
          column.minWidth ??
          inferColumnMinWidth(
            column as DataTableColumnDef<Record<string, unknown>>,
          ),
      ),
    [resolvedColumns],
  );

  const fixedColumnWidths = useMemo(
    () =>
      resolvedColumns.map((column, index) => {
        const explicitWidth = parsePixelWidth(column.width);
        const baseWidth = explicitWidth ?? columnMinWidths[index];
        return Math.max(columnMinWidths[index], Math.round(baseWidth));
      }),
    [columnMinWidths, resolvedColumns],
  );

  const columnMaxWidths = useMemo(
    () =>
      resolvedColumns.map((column, index) => {
        const explicitMaxWidth =
          typeof column.maxWidth === 'number' &&
          Number.isFinite(column.maxWidth)
            ? column.maxWidth
            : null;
        if (explicitMaxWidth != null) {
          return Math.max(columnMinWidths[index], Math.round(explicitMaxWidth));
        }

        const explicitWidth = parsePixelWidth(column.width);
        if (explicitWidth != null) {
          return Math.max(columnMinWidths[index], Math.round(explicitWidth));
        }

        return Math.max(columnMinWidths[index], DEFAULT_CELL_MAX_WIDTH);
      }),
    [columnMinWidths, resolvedColumns],
  );

  const frozenOffsets = useMemo(() => {
    const offsets: number[] = [];
    let total = 0;
    resolvedColumns.forEach((column, index) => {
      offsets.push(total);
      if (column.frozen) {
        total += isMobileScrollableTable
          ? fixedColumnWidths[index]
          : columnMinWidths[index];
      }
    });
    return offsets;
  }, [
    columnMinWidths,
    fixedColumnWidths,
    isMobileScrollableTable,
    resolvedColumns,
  ]);

  const lastFrozenIndex = useMemo(() => {
    let last = -1;
    resolvedColumns.forEach((column, index) => {
      if (column.frozen) last = index;
    });
    return last;
  }, [resolvedColumns]);

  const sorted = useMemo(() => {
    if (!resolvedSortKey) return data;
    const sortColumn = resolvedColumns.find(
      (column) => column.key === resolvedSortKey,
    );
    return [...data].sort((a, b) => {
      const cmp = sortColumn?.sortComparator
        ? sortColumn.sortComparator(a, b)
        : compareDataTableValues(
            sortColumn?.sortValue
              ? sortColumn.sortValue(a)
              : (a[resolvedSortKey] as DataTableComparable),
            sortColumn?.sortValue
              ? sortColumn.sortValue(b)
              : (b[resolvedSortKey] as DataTableComparable),
          );
      return resolvedSortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, resolvedColumns, resolvedSortDir, resolvedSortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const pagedRows = useMemo(
    () =>
      paged.map((row, index) => {
        const absoluteIndex = page * pageSize + index;
        const rowKey = getRowKey
          ? getRowKey(row, absoluteIndex)
          : absoluteIndex;
        return { row, rowKey };
      }),
    [getRowKey, page, pageSize, paged],
  );
  const showFrom = sorted.length === 0 ? 0 : page * pageSize + 1;
  const showTo = Math.min((page + 1) * pageSize, sorted.length);
  const hasActivePaginationControls = totalPages > 1;
  const resolvedPageSizeOptions = useMemo(() => {
    const options = new Set(
      pageSizeOptions.filter((option) => Number.isFinite(option) && option > 0),
    );
    options.add(pageSize);
    if (sorted.length > LARGE_DATASET_PAGE_THRESHOLD) {
      options.add(LARGE_DATASET_DEFAULT_PAGE_SIZE);
    }
    return Array.from(options).sort((a, b) => a - b);
  }, [pageSize, pageSizeOptions, sorted.length]);

  const selectablePagedRows = useMemo(
    () =>
      !enableRowSelection
        ? []
        : pagedRows.filter(({ row }) =>
            isRowSelectable ? isRowSelectable(row) : true,
          ),
    [enableRowSelection, isRowSelectable, pagedRows],
  );
  const selectedOnPageCount = useMemo(
    () =>
      selectablePagedRows.reduce(
        (count, rowEntry) =>
          count + (selectedRowKeys.has(rowEntry.rowKey) ? 1 : 0),
        0,
      ),
    [selectablePagedRows, selectedRowKeys],
  );
  const allRowsSelectedOnPage =
    selectablePagedRows.length > 0 &&
    selectedOnPageCount === selectablePagedRows.length;
  const someRowsSelectedOnPage =
    selectedOnPageCount > 0 && !allRowsSelectedOnPage;
  const useSelectionColumn =
    enableRowSelection && selectionVariant === 'column';
  const useInlineSelection =
    enableRowSelection && selectionVariant !== 'column';
  const tableColumnCount =
    resolvedColumns.length + (useSelectionColumn ? 1 : 0);
  const fixedTableWidth = useMemo(
    () =>
      fixedColumnWidths.reduce((total, width) => total + width, 0) +
      (useSelectionColumn ? SELECTION_COLUMN_WIDTH : 0),
    [fixedColumnWidths, useSelectionColumn],
  );

  const toggleAllVisibleSelection = useCallback(
    (checked: boolean) => {
      const next = new Set(selectedRowKeys);
      if (checked) {
        selectablePagedRows.forEach((rowEntry) => {
          next.add(rowEntry.rowKey);
        });
      } else {
        selectablePagedRows.forEach((rowEntry) => {
          next.delete(rowEntry.rowKey);
        });
      }
      updateSelectedRowKeys(next);
    },
    [selectablePagedRows, selectedRowKeys, updateSelectedRowKeys],
  );

  const mobilePrimaryColumn = useMemo(() => {
    if (resolvedColumns.length === 0) return null;
    if (!mobilePrimaryColumnKey) return resolvedColumns[0];
    return (
      resolvedColumns.find((column) => column.key === mobilePrimaryColumnKey) ??
      resolvedColumns[0]
    );
  }, [mobilePrimaryColumnKey, resolvedColumns]);

  const mobileSecondaryColumns = useMemo(() => {
    if (!mobilePrimaryColumn) return [];
    if (mobileSecondaryColumnKeys && mobileSecondaryColumnKeys.length > 0) {
      return mobileSecondaryColumnKeys
        .map((columnKey) =>
          resolvedColumns.find((column) => column.key === columnKey),
        )
        .filter((column): column is DataTableColumnDef<T> => Boolean(column));
    }
    return resolvedColumns
      .filter((column) => column.key !== mobilePrimaryColumn.key)
      .slice(0, 3);
  }, [mobilePrimaryColumn, mobileSecondaryColumnKeys, resolvedColumns]);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (hasConfiguredInitialPageSize) return;
    if (pageSizeTouched) return;
    setPageSize((current) =>
      current === autoPageSize ? current : autoPageSize,
    );
  }, [autoPageSize, hasConfiguredInitialPageSize, pageSizeTouched]);

  const frozenCellStyle = (index: number): CSSProperties => ({
    ...(resolvedColumns[index]?.frozen
      ? {
          position: 'sticky',
          left: frozenOffsets[index],
          zIndex: 1,
        }
      : {}),
    minWidth: columnMinWidths[index],
    width: isMobileScrollableTable
      ? fixedColumnWidths[index]
      : resolvedColumns[index]?.width,
    maxWidth: isMobileScrollableTable
      ? fixedColumnWidths[index]
      : columnMaxWidths[index],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: isMobileScrollableTable ? 'center' : undefined,
  });

  const frozenHeaderStyle = (index: number): CSSProperties => ({
    ...(resolvedColumns[index]?.frozen
      ? {
          position: 'sticky',
          left: frozenOffsets[index],
          zIndex: 11,
        }
      : {}),
    minWidth: columnMinWidths[index],
    width: isMobileScrollableTable
      ? fixedColumnWidths[index]
      : resolvedColumns[index]?.width,
    maxWidth: isMobileScrollableTable
      ? fixedColumnWidths[index]
      : columnMaxWidths[index],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: isMobileScrollableTable ? 'center' : undefined,
  });

  const frozenCellClass = (index: number) =>
    resolvedColumns[index]?.frozen
      ? cx(
          'bg-background',
          index === lastFrozenIndex && 'border-r border-border',
        )
      : '';

  const frozenHeaderCellClass = (index: number) =>
    resolvedColumns[index]?.frozen
      ? cx(
          frozenHeaderBgClass,
          index === lastFrozenIndex && frozenHeaderBorderClass,
        )
      : '';

  const renderCellValue = useCallback(
    (row: T, column: DataTableColumnDef<T>) =>
      column.render ? column.render(row) : (row[column.key] as ReactNode),
    [],
  );

  const resolveRowAccent = useCallback(
    (row: T): string | null => {
      const accent = rowAccentColor?.(row);
      if (!accent || accent === 'transparent') return null;
      return accent;
    },
    [rowAccentColor],
  );

  const rowAccentStyle = useCallback(
    (row: T): CSSProperties | undefined => {
      const accent = resolveRowAccent(row);
      if (!accent) return undefined;
      return { boxShadow: `inset 4px 0 0 ${accent}` };
    },
    [resolveRowAccent],
  );

  const scrollContainerStyle = useMemo<CSSProperties | undefined>(() => {
    if (scrollMaxHeight === undefined) return undefined;
    return {
      maxHeight:
        typeof scrollMaxHeight === 'number'
          ? `${scrollMaxHeight}px`
          : scrollMaxHeight,
    };
  }, [scrollMaxHeight]);

  const toggleRowSelection = useCallback(
    (rowKey: DataTableRowKey, checked: boolean) => {
      const next = new Set(selectedRowKeys);
      if (checked) {
        next.add(rowKey);
      } else {
        next.delete(rowKey);
      }
      updateSelectedRowKeys(next);
    },
    [selectedRowKeys, updateSelectedRowKeys],
  );

  const toggleRowExpanded = useCallback(
    (rowKey: DataTableRowKey) => {
      const next = new Set(expandedRowKeys);
      if (next.has(rowKey)) {
        next.delete(rowKey);
      } else {
        if (expandMode === 'single') {
          next.clear();
        }
        next.add(rowKey);
      }
      updateExpandedRowKeys(next);
    },
    [expandMode, expandedRowKeys, updateExpandedRowKeys],
  );

  if (loading) {
    const skeletonRows = density === 'compact' ? 12 : 8;

    if (isCardsMode) {
      return (
        <div className="space-y-2">
          {Array.from({ length: Math.min(skeletonRows, 6) }).map((_, index) => (
            <div
              key={index}
              className="rounded-md border border-border bg-background p-3"
            >
              <Skeleton className="mb-2 h-4 w-1/2 rounded" />
              <Skeleton className="mb-1 h-3.5 w-11/12 rounded" />
              <Skeleton className="h-3.5 w-8/12 rounded" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        className="w-full overflow-auto rounded-md border border-border"
        style={scrollContainerStyle}
      >
        <table
          className="w-full text-sm"
          style={{
            width: isMobileScrollableTable ? `${fixedTableWidth}px` : '100%',
            minWidth: isMobileScrollableTable ? `${fixedTableWidth}px` : '100%',
            tableLayout: isMobileScrollableTable ? 'fixed' : 'auto',
          }}
        >
          <thead className={headerContainerClass}>
            <tr className={headerRowClass}>
              {useSelectionColumn ? (
                <th
                  className={cx(
                    HEADER_HEIGHT[density],
                    CELL_PADDING[density],
                    'w-10 text-center font-medium',
                    headerTextClass,
                    HEADER_FONT[density],
                  )}
                />
              ) : null}
              {resolvedColumns.map((column, index) => (
                <th
                  key={column.key}
                  className={cx(
                    HEADER_HEIGHT[density],
                    CELL_PADDING[density],
                    isMobileScrollableTable
                      ? 'text-center font-medium'
                      : 'text-left font-medium',
                    headerTextClass,
                    HEADER_FONT[density],
                    frozenHeaderCellClass(index),
                  )}
                  style={frozenHeaderStyle(index)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={cx(
                  ROW_HEIGHTS[density],
                  'border-b border-border last:border-0',
                )}
              >
                {useSelectionColumn ? (
                  <td
                    className={cx(
                      CELL_PADDING[density],
                      'w-10 text-center bg-background',
                    )}
                  >
                    <Skeleton className="mx-auto h-3.5 w-3.5 rounded" />
                  </td>
                ) : null}
                {resolvedColumns.map((column, colIndex) => (
                  <td
                    key={column.key}
                    className={cx(
                      CELL_PADDING[density],
                      frozenCellClass(colIndex),
                      'bg-background',
                    )}
                    style={frozenCellStyle(colIndex)}
                  >
                    <Skeleton
                      className="h-3.5 rounded"
                      style={{
                        width:
                          colIndex === 0
                            ? '70%'
                            : colIndex === resolvedColumns.length - 1
                              ? '40%'
                              : '55%',
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      {filters && filters.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1 rounded bg-secondary px-2.5 py-1.5 text-[15px] text-foreground"
            >
              <span className="text-muted-foreground">{filter.label}:</span>{' '}
              {filter.value}
              {onRemoveFilter ? (
                <button
                  onClick={() => onRemoveFilter(filter.key)}
                  className="ml-0.5 hover:text-destructive"
                >
                  <CloseIcon />
                </button>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}

      {pagedRows.length === 0 ? (
        <EmptyState
          icon={FileTextIcon}
          message={
            filters && filters.length > 0
              ? 'No items match your filters'
              : emptyMessage
          }
          action={
            filters && filters.length > 0 && onRemoveFilter ? (
              <button
                className="text-[15px] text-muted-foreground hover:text-foreground underline underline-offset-2"
                onClick={() =>
                  filters.forEach((filter) => onRemoveFilter(filter.key))
                }
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : isCardsMode ? (
        <div className="space-y-2">
          {pagedRows.map(({ row, rowKey }) => {
            const rowSelectable = isRowSelectable ? isRowSelectable(row) : true;
            const expanded = expandedRowKeys.has(rowKey);

            return (
              <div
                key={rowKey}
                className={cx(
                  'rounded-md border border-border bg-background p-3',
                  onRowClick && 'cursor-pointer hover:bg-muted/30',
                  rowClassName?.(row),
                )}
                style={rowAccentStyle(row)}
                onClick={() => onRowClick?.(row)}
              >
                {enableRowSelection || renderExpandedRow ? (
                  <div className="mb-2 flex items-center justify-end gap-2">
                    {enableRowSelection ? (
                      <input
                        type="checkbox"
                        checked={selectedRowKeys.has(rowKey)}
                        disabled={!rowSelectable}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) =>
                          toggleRowSelection(
                            rowKey,
                            event.currentTarget.checked,
                          )
                        }
                        className="h-4 w-4 shrink-0 cursor-pointer"
                        style={SELECTION_CHECKBOX_STYLE}
                        aria-label="Select row"
                      />
                    ) : null}
                    {renderExpandedRow ? (
                      <button
                        type="button"
                        className="h-5 w-5 rounded border border-border text-sm leading-none text-muted-foreground hover:bg-muted"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleRowExpanded(rowKey);
                        }}
                        aria-label={expanded ? 'Collapse row' : 'Expand row'}
                      >
                        {expanded ? '-' : '+'}
                      </button>
                    ) : null}
                  </div>
                ) : null}

                {renderMobileCard ? (
                  renderMobileCard(row)
                ) : (
                  <div className="space-y-1.5">
                    {mobilePrimaryColumn ? (
                      <div
                        className={cx(
                          CARD_PRIMARY_FONT[density],
                          'font-medium',
                        )}
                      >
                        {renderCellValue(row, mobilePrimaryColumn)}
                      </div>
                    ) : null}
                    {mobileSecondaryColumns.map((column) => (
                      <div
                        key={column.key}
                        className={cx(
                          'flex items-start justify-between gap-3',
                          CARD_SECONDARY_FONT[density],
                        )}
                      >
                        <span className="text-muted-foreground">
                          {column.header}
                        </span>
                        <span className="text-right text-foreground">
                          {renderCellValue(row, column)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {renderExpandedRow && expanded ? (
                  <div className="mt-3 border-t border-border pt-3">
                    {renderExpandedRow(row)}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="w-full overflow-auto rounded-md border border-border"
          style={scrollContainerStyle}
        >
          <table
            className="w-full text-sm border-collapse"
            style={{
              width: isMobileScrollableTable ? `${fixedTableWidth}px` : '100%',
              minWidth: isMobileScrollableTable
                ? `${fixedTableWidth}px`
                : '100%',
              tableLayout: isMobileScrollableTable ? 'fixed' : 'auto',
            }}
          >
            <thead className={headerContainerClass}>
              <tr className={headerRowClass}>
                {useSelectionColumn ? (
                  <th
                    className={cx(
                      HEADER_HEIGHT[density],
                      CELL_PADDING[density],
                      'w-10 text-center font-medium',
                      headerTextClass,
                      HEADER_FONT[density],
                    )}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={allRowsSelectedOnPage}
                      disabled={selectablePagedRows.length === 0}
                      ref={(node) => {
                        if (node) {
                          node.indeterminate = someRowsSelectedOnPage;
                        }
                      }}
                      onChange={(event) =>
                        toggleAllVisibleSelection(event.currentTarget.checked)
                      }
                      className="h-4 w-4 shrink-0 cursor-pointer"
                      style={SELECTION_CHECKBOX_STYLE}
                      aria-label="Select all visible rows"
                    />
                  </th>
                ) : null}
                {resolvedColumns.map((column, colIndex) => (
                  <th
                    key={column.key}
                    className={cx(
                      HEADER_HEIGHT[density],
                      CELL_PADDING[density],
                      isMobileScrollableTable
                        ? 'text-center font-medium whitespace-nowrap overflow-hidden text-ellipsis'
                        : 'text-left font-medium whitespace-nowrap overflow-hidden text-ellipsis',
                      headerTextClass,
                      HEADER_FONT[density],
                      column.sortable && 'cursor-pointer select-none',
                      frozenHeaderCellClass(colIndex),
                    )}
                    style={frozenHeaderStyle(colIndex)}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <span className="inline-flex items-center gap-1 max-w-full overflow-hidden">
                      {useInlineSelection && colIndex === 0 ? (
                        <span
                          className="inline-flex items-center pr-1"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={allRowsSelectedOnPage}
                            disabled={selectablePagedRows.length === 0}
                            ref={(node) => {
                              if (node) {
                                node.indeterminate = someRowsSelectedOnPage;
                              }
                            }}
                            onChange={(event) =>
                              toggleAllVisibleSelection(
                                event.currentTarget.checked,
                              )
                            }
                            className="h-4 w-4 shrink-0 cursor-pointer"
                            style={SELECTION_CHECKBOX_STYLE}
                            aria-label="Select all visible rows"
                          />
                        </span>
                      ) : null}
                      <span className="truncate">{column.header}</span>
                      {renderColumnMeta?.(column)}
                      {column.sortable && resolvedSortKey === column.key ? (
                        resolvedSortDir === 'asc' ? (
                          <SortUpIcon />
                        ) : (
                          <SortDownIcon />
                        )
                      ) : null}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedRows.map(({ row, rowKey }) => {
                const rowSelectable = isRowSelectable
                  ? isRowSelectable(row)
                  : true;
                const expanded = expandedRowKeys.has(rowKey);
                const rowAccent = resolveRowAccent(row);
                const firstCellAccentStyle =
                  rowAccent == null
                    ? undefined
                    : ({
                        boxShadow: `inset 4px 0 0 ${rowAccent}`,
                      } as CSSProperties);

                return (
                  <Fragment key={rowKey}>
                    <tr
                      className={cx(
                        ROW_HEIGHTS[density],
                        'border-0 transition-colors duration-150 hover:bg-muted/50',
                        onRowClick && 'cursor-pointer',
                        rowClassName?.(row),
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {useSelectionColumn ? (
                        <td
                          className={cx(
                            CELL_PADDING[density],
                            CELL_FONT[density],
                            'w-10 text-center align-middle',
                          )}
                          style={firstCellAccentStyle}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRowKeys.has(rowKey)}
                            disabled={!rowSelectable}
                            onChange={(event) =>
                              toggleRowSelection(
                                rowKey,
                                event.currentTarget.checked,
                              )
                            }
                            className="h-4 w-4 shrink-0 cursor-pointer"
                            style={SELECTION_CHECKBOX_STYLE}
                            aria-label="Select row"
                          />
                        </td>
                      ) : null}
                      {resolvedColumns.map((column, colIndex) => {
                        const showControls =
                          colIndex === 0 &&
                          (useInlineSelection || renderExpandedRow);
                        return (
                          <td
                            key={column.key}
                            className={cx(
                              CELL_PADDING[density],
                              CELL_FONT[density],
                              isMobileScrollableTable
                                ? 'align-middle whitespace-nowrap overflow-hidden text-ellipsis text-center'
                                : 'align-middle whitespace-nowrap overflow-hidden text-ellipsis',
                              frozenCellClass(colIndex),
                            )}
                            style={
                              colIndex === 0 &&
                              !useSelectionColumn &&
                              firstCellAccentStyle
                                ? {
                                    ...frozenCellStyle(colIndex),
                                    ...firstCellAccentStyle,
                                  }
                                : frozenCellStyle(colIndex)
                            }
                          >
                            {showControls ? (
                              <div className="flex min-w-0 items-center gap-2">
                                {useInlineSelection ? (
                                  <input
                                    type="checkbox"
                                    checked={selectedRowKeys.has(rowKey)}
                                    disabled={!rowSelectable}
                                    onClick={(event) => event.stopPropagation()}
                                    onChange={(event) =>
                                      toggleRowSelection(
                                        rowKey,
                                        event.currentTarget.checked,
                                      )
                                    }
                                    className="h-4 w-4 shrink-0 cursor-pointer"
                                    style={SELECTION_CHECKBOX_STYLE}
                                    aria-label="Select row"
                                  />
                                ) : null}
                                {renderExpandedRow ? (
                                  <button
                                    type="button"
                                    className="h-5 w-5 shrink-0 rounded border border-border text-sm leading-none text-muted-foreground hover:bg-muted"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      toggleRowExpanded(rowKey);
                                    }}
                                    aria-label={
                                      expanded ? 'Collapse row' : 'Expand row'
                                    }
                                  >
                                    {expanded ? '-' : '+'}
                                  </button>
                                ) : null}
                                <span className="block min-w-0 flex-1 truncate">
                                  {renderCellValue(row, column)}
                                </span>
                              </div>
                            ) : (
                              <span className="block truncate">
                                {renderCellValue(row, column)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    {renderExpandedRow && expanded ? (
                      <tr className="border-b border-border bg-muted/20">
                        <td
                          colSpan={Math.max(1, tableColumnCount)}
                          className={cx(
                            CELL_PADDING[density],
                            CELL_FONT[density],
                            'align-top',
                          )}
                        >
                          {renderExpandedRow(row)}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {hasActivePaginationControls ? (
        <div className="mt-3 flex items-center justify-between text-[15px] text-muted-foreground">
          <span>
            Showing {showFrom}-{showTo} of {sorted.length}
          </span>
          <div className="flex items-center gap-5">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPageSizeTouched(true);
                setPage(0);
              }}
            >
              <SelectTrigger className="h-9 w-[85px] text-[15px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resolvedPageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              className="h-9 w-[116px] px-5 rounded-md border border-black bg-black text-[15px] text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-black/40 disabled:text-white/70 hover:bg-black/90"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() =>
                setPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              className="h-9 w-[116px] px-5 rounded-md border border-black bg-black text-[15px] text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-black/40 disabled:text-white/70 hover:bg-black/90"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
