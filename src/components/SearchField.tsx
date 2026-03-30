import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { DismissButton } from "./DismissButton";

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onValueChange: (value: string) => void;
  debounceMs?: number;
  onClear?: () => void;
  clearable?: boolean;
  showClearWhenEmpty?: boolean;
  clearLabel?: string;
  leading?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  leadingContainerClassName?: string;
  clearButtonClassName?: string;
  clearGlyphClassName?: string;
}

const DEFAULT_CONTAINER_CLASS = "relative";
const DEFAULT_INPUT_CLASS =
  "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
const DEFAULT_LEADING_CLASS =
  "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground";
const DEFAULT_CLEAR_BUTTON_CLASS =
  "absolute right-3 top-1/2 -translate-y-1/2";
const DEFAULT_CLEAR_GLYPH_CLASS = "text-[14px] leading-none";
const DEFAULT_DEBOUNCE_MS = 0;

function mergeClassNames(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField(
    {
      value,
      onValueChange,
      debounceMs = DEFAULT_DEBOUNCE_MS,
      onClear,
      clearable = true,
      showClearWhenEmpty = false,
      clearLabel = "Clear search",
      leading,
      containerClassName,
      inputClassName,
      leadingContainerClassName,
      clearButtonClassName,
      clearGlyphClassName,
      type,
      onBlur,
      onKeyDown,
      ...inputProps
    },
    ref
  ) {
    const resolvedDebounceMs =
      Number.isFinite(debounceMs) && debounceMs > 0
        ? Math.round(debounceMs)
        : 0;
    const [inputValue, setInputValue] = useState(value);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearScheduledUpdate = useCallback(() => {
      if (debounceTimerRef.current == null) return;
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }, []);

    const flushValue = useCallback(
      (nextValue: string) => {
        clearScheduledUpdate();
        onValueChange(nextValue);
      },
      [clearScheduledUpdate, onValueChange]
    );

    useEffect(() => {
      setInputValue(value);
      clearScheduledUpdate();
    }, [clearScheduledUpdate, value]);

    useEffect(
      () => () => {
        clearScheduledUpdate();
      },
      [clearScheduledUpdate]
    );

    const showClearButton =
      clearable && (showClearWhenEmpty || inputValue.length > 0);
    const hasClearSlot = clearable;

    const resolvedContainerClass = mergeClassNames(
      DEFAULT_CONTAINER_CLASS,
      containerClassName
    );
    const resolvedInputClass = mergeClassNames(
      DEFAULT_INPUT_CLASS,
      leading ? "pl-9" : undefined,
      hasClearSlot ? "pr-9" : undefined,
      inputClassName
    );
    const resolvedLeadingClass = mergeClassNames(
      DEFAULT_LEADING_CLASS,
      leadingContainerClassName
    );
    const resolvedClearButtonClass = mergeClassNames(
      DEFAULT_CLEAR_BUTTON_CLASS,
      clearButtonClassName
    );
    const resolvedClearGlyphClass = mergeClassNames(
      DEFAULT_CLEAR_GLYPH_CLASS,
      clearGlyphClassName
    );

    const handleClear = () => {
      setInputValue("");
      clearScheduledUpdate();
      if (onClear) {
        onClear();
        return;
      }
      onValueChange("");
    };

    const handleChange = (nextValue: string) => {
      if (resolvedDebounceMs <= 0) {
        setInputValue(nextValue);
        flushValue(nextValue);
        return;
      }

      setInputValue(nextValue);
      clearScheduledUpdate();
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        onValueChange(nextValue);
      }, resolvedDebounceMs);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      if (resolvedDebounceMs > 0 && debounceTimerRef.current != null) {
        flushValue(inputValue);
      }
      onBlur?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (resolvedDebounceMs > 0 && event.key === "Enter" && debounceTimerRef.current != null) {
        flushValue(inputValue);
      }
      onKeyDown?.(event);
    };

    return (
      <div className={resolvedContainerClass}>
        {leading && (
          <span aria-hidden className={resolvedLeadingClass}>
            {leading}
          </span>
        )}
        <input
          {...inputProps}
          ref={ref}
          type={type ?? "text"}
          value={inputValue}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={resolvedInputClass}
        />
        {showClearButton && (
          <DismissButton
            onClick={handleClear}
            className={resolvedClearButtonClass}
            glyphClassName={resolvedClearGlyphClass}
            label={clearLabel}
          />
        )}
      </div>
    );
  }
);
