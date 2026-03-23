import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { cx } from "../../lib/cx";

export interface DropdownItem {
  id: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownProps {
  triggerLabel: string;
  items: DropdownItem[];
  onSelect?: (item: DropdownItem) => void;
  disabled?: boolean;
  align?: "start" | "end";
  className?: string;
}

export function Dropdown({ triggerLabel, items, onSelect, disabled = false, align = "start", className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const enabledIndexes = useMemo(
    () => items.map((item, index) => (!item.disabled ? index : -1)).filter((index) => index >= 0),
    [items],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    function onWindowPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", onWindowPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onWindowPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
      return;
    }
    const firstEnabled = enabledIndexes[0] ?? -1;
    setActiveIndex(firstEnabled);
  }, [enabledIndexes, open]);

  useEffect(() => {
    if (activeIndex < 0 || !open) {
      return;
    }
    itemRefs.current[activeIndex]?.focus();
  }, [activeIndex, open]);

  function moveActive(direction: "next" | "prev") {
    if (!enabledIndexes.length) {
      return;
    }
    const currentPosition = enabledIndexes.indexOf(activeIndex);
    if (currentPosition < 0) {
      setActiveIndex(enabledIndexes[0]);
      return;
    }
    const offset = direction === "next" ? 1 : -1;
    const nextPosition = (currentPosition + offset + enabledIndexes.length) % enabledIndexes.length;
    setActiveIndex(enabledIndexes[nextPosition]);
  }

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(enabledIndexes[0] ?? -1);
    }
  }

  const menuStyle: CSSProperties = {
    position: "absolute",
    top: "calc(100% + 6px)",
    [align === "end" ? "right" : "left"]: 0,
    zIndex: 10,
    minWidth: 180,
    borderRadius: "var(--lt-radius-sm)",
    border: "1px solid var(--lt-color-border)",
    boxShadow: "var(--lt-shadow-md)",
    background: "var(--lt-color-bg)",
    padding: "6px",
    margin: 0,
    listStyle: "none",
  };

  return (
    <div ref={containerRef} className={cx(className)} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onKeyDown={onTriggerKeyDown}
        onClick={() => setOpen((value) => !value)}
        style={{
          borderRadius: "var(--lt-radius-sm)",
          border: "1px solid var(--lt-color-border)",
          background: "var(--lt-color-surface)",
          color: "var(--lt-color-text)",
          padding: "8px 12px",
          fontSize: "var(--lt-font-size-sm)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {triggerLabel}
      </button>

      {open ? (
        <ul role="menu" style={menuStyle}>
          {items.map((item, index) => (
            <li key={item.id} style={{ margin: 0 }}>
              <button
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    moveActive("next");
                    return;
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    moveActive("prev");
                    return;
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    setActiveIndex(enabledIndexes[0] ?? -1);
                    return;
                  }
                  if (event.key === "End") {
                    event.preventDefault();
                    setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
                    return;
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    setOpen(false);
                  }
                }}
                onClick={() => {
                  if (item.disabled) {
                    return;
                  }
                  onSelect?.(item);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: "none",
                  background: activeIndex === index ? "var(--lt-color-surface)" : "transparent",
                  color: item.danger ? "var(--lt-color-danger)" : "var(--lt-color-text)",
                  borderRadius: "var(--lt-radius-sm)",
                  padding: "8px 10px",
                  fontSize: "var(--lt-font-size-sm)",
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  opacity: item.disabled ? 0.55 : 1,
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
