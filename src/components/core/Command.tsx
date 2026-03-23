import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";

interface CommandItemRecord {
  id: string;
  value: string;
}

interface CommandContextValue {
  query: string;
  setQuery: (value: string) => void;
  items: CommandItemRecord[];
  registerItem: (item: CommandItemRecord) => void;
  unregisterItem: (id: string) => void;
}

const CommandContext = createContext<CommandContextValue | null>(null);

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function useCommandContext() {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error("Command components must be used within Command.");
  }
  return context;
}

export interface CommandProps extends HTMLAttributes<HTMLDivElement> {}

export const Command = forwardRef<HTMLDivElement, CommandProps>(function Command(
  { className, children, ...props },
  ref,
) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CommandItemRecord[]>([]);

  const contextValue = useMemo<CommandContextValue>(
    () => ({
      query,
      setQuery,
      items,
      registerItem: (item) => {
        setItems((prev) => {
          const withoutItem = prev.filter((entry) => entry.id !== item.id);
          return [...withoutItem, item];
        });
      },
      unregisterItem: (id) => {
        setItems((prev) => prev.filter((entry) => entry.id !== id));
      },
    }),
    [items, query],
  );

  return (
    <CommandContext.Provider value={contextValue}>
      <div
        {...props}
        ref={ref}
        className={cx("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className)}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
});

export interface CommandInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(function CommandInput(
  { className, onChange, ...props },
  ref,
) {
  const { query, setQuery } = useCommandContext();
  return (
    <div className="flex items-center border-b border-border px-3">
      <input
        {...props}
        ref={ref}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          onChange?.(event);
        }}
        className={cx("flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground", className)}
      />
    </div>
  );
});

export interface CommandListProps extends HTMLAttributes<HTMLDivElement> {}

export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(function CommandList(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={cx("max-h-[300px] overflow-y-auto overflow-x-hidden", className)} />;
});

export interface CommandEmptyProps extends HTMLAttributes<HTMLDivElement> {}

export const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>(function CommandEmpty(
  { className, children, ...props },
  ref,
) {
  const { query, items } = useCommandContext();
  const normalizedQuery = normalize(query);
  const hasVisibleItems = items.some((item) => normalize(item.value).includes(normalizedQuery));

  if (hasVisibleItems) {
    return null;
  }

  return (
    <div {...props} ref={ref} className={cx("py-6 text-center text-sm text-muted-foreground", className)}>
      {children}
    </div>
  );
});

export interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {}

export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(function CommandGroup(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={cx("overflow-hidden p-1", className)} />;
});

export interface CommandItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value: string;
  onSelect?: (value: string) => void;
}

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
  { className, value, onSelect, onClick, onKeyDown, ...props },
  ref,
) {
  const { query, registerItem, unregisterItem } = useCommandContext();
  const id = useId();

  useEffect(() => {
    registerItem({ id, value });
    return () => unregisterItem(id);
  }, [id, registerItem, unregisterItem, value]);

  const visible = normalize(value).includes(normalize(query));
  if (!visible) {
    return null;
  }

  const handleSelect = () => onSelect?.(value);

  return (
    <div
      {...props}
      ref={ref}
      role="option"
      tabIndex={0}
      className={cx("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          handleSelect();
        }
      }}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          handleSelect();
        }
      }}
    />
  );
});

export interface CommandSeparatorProps extends HTMLAttributes<HTMLDivElement> {}
export const CommandSeparator = forwardRef<HTMLDivElement, CommandSeparatorProps>(function CommandSeparator(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={cx("-mx-1 my-1 h-px bg-border", className)} />;
});

export interface CommandShortcutProps extends HTMLAttributes<HTMLSpanElement> {}
export const CommandShortcut = forwardRef<HTMLSpanElement, CommandShortcutProps>(function CommandShortcut(
  { className, ...props },
  ref,
) {
  return <span {...props} ref={ref} className={cx("ml-auto text-xs tracking-widest text-muted-foreground", className)} />;
});

export interface CommandDialogProps extends ComponentPropsWithoutRef<"div"> {
  open?: boolean;
  children?: ReactNode;
}

export const CommandDialog = forwardRef<HTMLDivElement, CommandDialogProps>(function CommandDialog(
  { open = true, className, children, ...props },
  ref,
) {
  if (!open) {
    return null;
  }
  return (
    <div {...props} ref={ref} className={cx("fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4", className)}>
      <div className="w-full max-w-lg rounded-md border border-border bg-background p-0 shadow-lg">{children}</div>
    </div>
  );
});
