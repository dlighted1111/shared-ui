import type { ReactNode } from "react";

export interface FilterPill {
  key: string;
  label: string;
  onRemove: () => void;
}

interface FilterPopoverRenderApi {
  activeCount: number;
  pills: FilterPill[];
  hasActiveFilters: boolean;
  hasPills: boolean;
  onClearAll: () => void;
  body: ReactNode;
}

export interface FilterPopoverProps {
  activeCount: number;
  pills: FilterPill[];
  onClearAll: () => void;
  children: ReactNode;
  render: (api: FilterPopoverRenderApi) => ReactNode;
}

export function FilterPopover({ activeCount, pills, onClearAll, children, render }: FilterPopoverProps) {
  return (
    <>
      {render({
        activeCount,
        pills,
        hasActiveFilters: activeCount > 0,
        hasPills: pills.length > 0,
        onClearAll,
        body: children,
      })}
    </>
  );
}
