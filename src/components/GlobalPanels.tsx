import type { ReactNode } from "react";

export interface GlobalPanelEntry {
  type: string;
  id: string;
  meta?: Record<string, unknown>;
}

export interface GlobalPanelRendererProps {
  id: string;
  meta?: Record<string, unknown>;
  onClose: () => void;
  backLabel?: string;
  onBack?: () => void;
}

export type GlobalPanelRenderer = (
  props: GlobalPanelRendererProps
) => ReactNode;

export interface GlobalPanelsProps {
  current: GlobalPanelEntry | null;
  previous: GlobalPanelEntry | null;
  onClose: () => void;
  onBack: () => void;
  renderers: Record<string, GlobalPanelRenderer | undefined>;
  backLabel?: string;
}

export function GlobalPanels({
  current,
  previous,
  onClose,
  onBack,
  renderers,
  backLabel = "\u2190 Back",
}: GlobalPanelsProps) {
  if (!current) return null;
  const render = renderers[current.type];
  if (!render) return null;

  return (
    <>
      {render({
        id: current.id,
        meta: current.meta,
        onClose,
        backLabel: previous ? backLabel : undefined,
        onBack: previous ? onBack : undefined,
      })}
    </>
  );
}
