import type { ReactNode } from "react";

export interface ColumnDef {
  key: string;
  label: string;
  alwaysVisible?: boolean;
}

interface ColumnPickerRenderApi {
  columns: ColumnDef[];
  isVisible: (key: string) => boolean;
  toggle: (key: string) => void;
}

export interface ColumnPickerProps {
  columns: ColumnDef[];
  visible: Set<string>;
  onChange: (visible: Set<string>) => void;
  children: (api: ColumnPickerRenderApi) => ReactNode;
}

export function ColumnPicker({ columns, visible, onChange, children }: ColumnPickerProps) {
  const toggle = (key: string) => {
    const next = new Set(visible);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange(next);
  };

  return <>{children({ columns, isVisible: (key) => visible.has(key), toggle })}</>;
}
