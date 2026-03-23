import {
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";

interface CollapsibleContextValue {
  open: boolean;
  disabled?: boolean;
  setOpen: (nextOpen: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export interface CollapsibleTriggerProps extends HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  { open, defaultOpen = false, onOpenChange, disabled = false, className, children, ...props },
  ref,
) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const currentOpen = isControlled ? open : internalOpen;

  const contextValue = useMemo<CollapsibleContextValue>(
    () => ({
      open: currentOpen,
      disabled,
      setOpen: (nextOpen) => {
        if (!isControlled) {
          setInternalOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
    }),
    [currentOpen, disabled, isControlled, onOpenChange],
  );

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <div {...props} ref={ref} data-state={currentOpen ? "open" : "closed"} className={cx(className)}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
});

export const CollapsibleTrigger = forwardRef<HTMLElement, CollapsibleTriggerProps>(function CollapsibleTrigger(
  { asChild = false, className, children, onClick, ...props },
  ref,
) {
  const context = useContext(CollapsibleContext);
  const open = Boolean(context?.open);
  const disabled = Boolean(context?.disabled);

  const handleClick: MouseEventHandler<HTMLElement> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled || !context) {
      return;
    }
    context.setOpen(!open);
  };

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ onClick?: MouseEventHandler<HTMLElement>; className?: string }>;
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <child.type
        {...(child.props as any)}
        {...props}
        ref={ref}
        data-state={open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        className={cx(child.props.className, className)}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(event);
          handleClick(event);
        }}
      />
    );
  }

  return (
    <button
      {...props}
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      disabled={disabled}
      data-state={open ? "open" : "closed"}
      className={cx(className)}
      onClick={handleClick as MouseEventHandler<HTMLButtonElement>}
    >
      {children}
    </button>
  );
});

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(function CollapsibleContent(
  { asChild = false, className, children, ...props },
  ref,
) {
  const context = useContext(CollapsibleContext);
  const open = Boolean(context?.open);

  if (!open) {
    return null;
  }

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <child.type {...(child.props as any)} {...props} ref={ref} data-state="open" className={cx(child.props.className, className)} />
    );
  }

  return (
    <div {...props} ref={ref} data-state="open" className={cx(className)}>
      {children}
    </div>
  );
});

