import { useEffect, type ReactNode } from "react";
import { cx } from "../lib/cx";

export interface KeyboardShortcutItem {
  action: ReactNode;
  keys: string | string[];
}

export interface KeyboardShortcutSection {
  title: string;
  items: KeyboardShortcutItem[];
}

export interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  sections: KeyboardShortcutSection[];
  overlayClassName?: string;
  panelClassName?: string;
  sectionTitleClassName?: string;
  actionClassName?: string;
  keyClassName?: string;
}

export function KeyboardShortcutsModal({
  open,
  onClose,
  title = "Keyboard Shortcuts",
  sections,
  overlayClassName,
  panelClassName,
  sectionTitleClassName,
  actionClassName,
  keyClassName,
}: KeyboardShortcutsModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={cx("fixed inset-0 z-[100] flex items-center justify-center", overlayClassName)} onClick={onClose}>
      <div className="fixed inset-0 bg-black/40" />
      <div
        className={cx("relative w-[520px] rounded-lg border border-border bg-background p-6", panelClassName)}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.06em] text-foreground">{title}</h2>
        {sections.map((section) => (
          <div key={section.title} className="mt-3 first:mt-0">
            <p className={cx("mb-2 text-[9px] font-medium uppercase tracking-wider text-muted-foreground", sectionTitleClassName)}>
              {section.title}
            </p>
            <div className="space-y-1.5">
              {section.items.map((item, index) => {
                const itemKey = `${section.title}-${index}-${String(item.action)}`;
                const keys = Array.isArray(item.keys) ? item.keys : [item.keys];
                return (
                  <div key={itemKey} className="flex items-center justify-between text-xs">
                    <span className={cx("text-foreground", actionClassName)}>{item.action}</span>
                    <span className="inline-flex items-center gap-1">
                      {keys.map((keyLabel, keyIndex) => (
                        <kbd key={`${itemKey}-${keyIndex}`} className={cx("rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground", keyClassName)}>
                          {keyLabel}
                        </kbd>
                      ))}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
