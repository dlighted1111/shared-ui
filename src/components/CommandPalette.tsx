import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../lib/cx";

export interface CommandPaletteItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
  sublabel?: string;
}

export interface CommandPaletteProps {
  pages: CommandPaletteItem[];
  searchRecords: (query: string) => Promise<CommandPaletteItem[]>;
  onSelect: (item: CommandPaletteItem) => void;
  minQueryLength?: number;
  placeholder?: string;
  noResultsLabel?: string;
  shortcutHintLabel?: string;
  panelClassName?: string;
  backdropClassName?: string;
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function CommandPalette({
  pages,
  searchRecords,
  onSelect,
  minQueryLength = 2,
  placeholder = "Search pages and records...",
  noResultsLabel = "No results found",
  shortcutHintLabel = "⌘K",
  panelClassName,
  backdropClassName,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<CommandPaletteItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const requestRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setRecords([]);
    setSelectedIdx(0);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [open]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length < minQueryLength) {
      setRecords([]);
      return;
    }

    timerRef.current = setTimeout(async () => {
      const requestId = requestRef.current + 1;
      requestRef.current = requestId;
      const nextRecords = await searchRecords(trimmedQuery);
      if (requestRef.current !== requestId) return;
      setRecords(nextRecords);
    }, 150);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [minQueryLength, query, searchRecords]);

  const filteredPages = useMemo(() => {
    const normalized = query.toLowerCase();
    return pages.filter((page) => !normalized || page.label.toLowerCase().includes(normalized));
  }, [pages, query]);

  const allResults = useMemo(
    () => [...filteredPages, ...records],
    [filteredPages, records]
  );

  useEffect(() => {
    setSelectedIdx(0);
  }, [allResults.length]);

  const handleSelect = useCallback(
    (item: CommandPaletteItem) => {
      setOpen(false);
      onSelect(item);
    },
    [onSelect]
  );

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIdx((index) => Math.min(index + 1, allResults.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIdx((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Enter" && allResults[selectedIdx]) {
      handleSelect(allResults[selectedIdx]);
    }
  };

  if (!open) return null;

  let globalIdx = -1;
  const hasNoResults = allResults.length === 0 && query.length >= minQueryLength;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
      onClick={() => setOpen(false)}
    >
      <div className={cx("fixed inset-0 bg-black/50", backdropClassName)} />
      <div
        className={cx(
          "relative w-[600px] rounded-lg shadow-xl overflow-hidden",
          panelClassName
        )}
        style={{ backgroundColor: "#111111" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center px-4 h-12 border-b border-white/10">
          <span className="text-white/40 mr-3 shrink-0">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
          />
          <span className="text-[10px] text-white/20 bg-white/5 rounded px-1.5 py-0.5 font-mono shrink-0">
            {shortcutHintLabel}
          </span>
        </div>

        <div className="max-h-[320px] overflow-y-auto py-1">
          {filteredPages.length > 0 ? (
            <>
              <p className="text-[10px] uppercase tracking-wider text-[#666] px-4 pt-2 pb-1 font-medium">
                Pages
              </p>
              {filteredPages.map((item) => {
                globalIdx += 1;
                const idx = globalIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={cx(
                      "w-full flex items-center gap-3 h-10 px-4 text-sm text-left transition-colors",
                      selectedIdx === idx ? "bg-[#1E1E1E]" : ""
                    )}
                    style={{ color: "white" }}
                  >
                    {item.icon ? (
                      <span className="text-white/40 shrink-0">{item.icon}</span>
                    ) : null}
                    <span>{item.label}</span>
                    {item.sublabel ? (
                      <span className="text-xs text-white/30 truncate">
                        {item.sublabel}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </>
          ) : null}

          {records.length > 0 ? (
            <>
              <p className="text-[10px] uppercase tracking-wider text-[#666] px-4 pt-2 pb-1 font-medium">
                Records
              </p>
              {records.map((item) => {
                globalIdx += 1;
                const idx = globalIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={cx(
                      "w-full flex items-center gap-3 h-10 px-4 text-sm text-left transition-colors",
                      selectedIdx === idx ? "bg-[#1E1E1E]" : ""
                    )}
                    style={{ color: "white" }}
                  >
                    {item.icon ? (
                      <span className="text-white/40 shrink-0">{item.icon}</span>
                    ) : null}
                    <span>{item.label}</span>
                    {item.sublabel ? (
                      <span className="text-xs text-white/30 truncate">
                        {item.sublabel}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </>
          ) : null}

          {hasNoResults ? (
            <p className="text-center text-white/30 text-sm py-6">{noResultsLabel}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
