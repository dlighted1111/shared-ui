import { useEffect, useState, type ReactNode } from "react";
import {
  KeyboardShortcutsModal,
  type KeyboardShortcutSection,
} from "./KeyboardShortcutsModal";

export interface ShortcutsModalProps {
  sections: KeyboardShortcutSection[];
  title?: ReactNode;
  triggerKey?: string;
  overlayClassName?: string;
  panelClassName?: string;
  sectionTitleClassName?: string;
  actionClassName?: string;
  keyClassName?: string;
  shouldIgnoreToggle?: () => boolean;
}

export function ShortcutsModal({
  sections,
  title,
  triggerKey = "?",
  overlayClassName,
  panelClassName,
  sectionTitleClassName,
  actionClassName,
  keyClassName,
  shouldIgnoreToggle,
}: ShortcutsModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreToggle?.()) return;
      if (event.key === triggerKey && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldIgnoreToggle, triggerKey]);

  return (
    <KeyboardShortcutsModal
      open={open}
      onClose={() => setOpen(false)}
      title={title}
      sections={sections}
      overlayClassName={overlayClassName}
      panelClassName={panelClassName}
      sectionTitleClassName={sectionTitleClassName}
      actionClassName={actionClassName}
      keyClassName={keyClassName}
    />
  );
}
