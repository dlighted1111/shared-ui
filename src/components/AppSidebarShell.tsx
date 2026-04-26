import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cx } from "../lib/cx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./core/Tooltip";
import type {
  AppSidebarAction,
  AppSidebarBadge,
  AppSidebarIcon,
  AppSidebarItem,
  AppSidebarSection,
  AppSidebarShellProps,
  AppSidebarUser,
} from "./AppSidebar.types";

const DEFAULT_WIDTH = 240;
const DEFAULT_COLLAPSED_WIDTH = 48;

function CollapseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="m14 9-3 3 3 3" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="m12 9 3 3-3 3" />
    </svg>
  );
}

function SectionChevron({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx(
        "h-3.5 w-3.5 text-muted-foreground transition-transform duration-150",
        collapsed && "-rotate-90",
      )}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function matchesPath(targetPath: string, pathname: string, exactMatch?: boolean): boolean {
  if (!targetPath) return false;
  const normalizedTarget = targetPath.endsWith("/") && targetPath.length > 1
    ? targetPath.slice(0, -1)
    : targetPath;
  const normalizedPathname = pathname.endsWith("/") && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
  if (exactMatch) return normalizedPathname === normalizedTarget;
  if (normalizedPathname === normalizedTarget) return true;
  if (normalizedTarget === "/") return normalizedPathname === "/";
  return normalizedPathname.startsWith(`${normalizedTarget}/`);
}

function isItemActive(item: AppSidebarItem, pathname: string): boolean {
  if (item.isActive) return item.isActive(pathname);
  if (item.matchPaths?.length) {
    return item.matchPaths.some((path) => matchesPath(path, pathname, false));
  }
  if (!item.href) return false;
  return matchesPath(item.href, pathname, item.exactMatch);
}

function getInitials(user: AppSidebarUser): string {
  if (user.initials?.trim()) return user.initials.trim();
  const tokens = user.name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "U";
  return tokens
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("");
}

function formatBadgeValue(badge: AppSidebarBadge): string {
  if (typeof badge.value !== "number") return String(badge.value);
  const max = badge.max ?? 99;
  return badge.value > max ? `${max}+` : String(badge.value);
}

function shouldRenderBadge(badge: AppSidebarBadge | null | undefined): badge is AppSidebarBadge {
  if (!badge) return false;
  if (typeof badge.value === "number" && badge.hideWhenZero && badge.value <= 0) {
    return false;
  }
  if (typeof badge.value === "number" && badge.value <= 0 && !badge.hideWhenZero) {
    return false;
  }
  return true;
}

function renderIcon(icon: AppSidebarIcon | undefined, collapsed: boolean): ReactNode {
  if (!icon) return null;
  if (isValidElement(icon)) {
    return cloneElement(icon as React.ReactElement, {
      className: cx("shrink-0", (icon as React.ReactElement).props.className),
    });
  }
  if (
    typeof icon === "function" ||
    (typeof icon === "object" && icon !== null && "$$typeof" in icon)
  ) {
    const IconComponent = icon as AppSidebarIcon;
    const Comp = IconComponent as (props: {
      className?: string;
      size?: number;
      strokeWidth?: number;
    }) => ReactNode;
    return <Comp size={collapsed ? 18 : 18} strokeWidth={1.5} className="shrink-0" />;
  }
  return <span className="inline-flex shrink-0 items-center">{icon}</span>;
}

function buildSectionState(sections: AppSidebarSection[]): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  for (const section of sections) {
    state[section.id] = Boolean(section.defaultCollapsed);
  }
  return state;
}

function resolveSlot(
  slot: AppSidebarShellProps["headerSlot"] | AppSidebarShellProps["searchSlot"] | AppSidebarShellProps["footerTopSlot"] | AppSidebarShellProps["footerBottomSlot"],
  collapsed: boolean,
  pathname: string,
) {
  if (typeof slot === "function") {
    return slot({ collapsed, pathname });
  }
  return slot;
}

function renderActionIcon(icon: AppSidebarAction["icon"]) {
  if (!icon) return null;
  return renderIcon(icon, true);
}

export function AppSidebarShell({
  brand,
  pathname,
  sections,
  collapsed,
  onCollapsedChange,
  onNavigate,
  width = DEFAULT_WIDTH,
  collapsedWidth = DEFAULT_COLLAPSED_WIDTH,
  className,
  navClassName,
  sectionClassName,
  itemClassName,
  activeItemClassName,
  inactiveItemClassName,
  searchSlot,
  headerSlot,
  footerTopSlot,
  footerBottomSlot,
  user,
  footerActions,
  sectionToggleEventName,
  scrollPersistenceKey,
  tooltipSide = "right",
}: AppSidebarShellProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() =>
    buildSectionState(sections),
  );
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const visibleSections = useMemo(() => {
    return sections
      .filter((section) => !section.hidden)
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => !item.hidden),
      }))
      .filter((section) => section.items.length > 0);
  }, [sections]);

  const visibleFooterActions = useMemo(
    () => (footerActions ?? []).filter((action) => !action.hidden),
    [footerActions],
  );

  useEffect(() => {
    setCollapsedSections((previous) => {
      const next: Record<string, boolean> = {};
      for (const section of visibleSections) {
        next[section.id] = previous[section.id] ?? Boolean(section.defaultCollapsed);
      }
      return next;
    });
  }, [visibleSections]);

  useEffect(() => {
    if (!sectionToggleEventName) return;
    const handler = () => {
      setCollapsedSections((previous) => {
        const collapsibleSections = visibleSections.filter(
          (section) => section.collapsible !== false,
        );
        if (collapsibleSections.length === 0) return previous;
        const allCollapsed = collapsibleSections.every(
          (section) => previous[section.id],
        );
        const next = { ...previous };
        for (const section of collapsibleSections) {
          next[section.id] = !allCollapsed;
        }
        return next;
      });
    };
    window.addEventListener(sectionToggleEventName, handler);
    return () => window.removeEventListener(sectionToggleEventName, handler);
  }, [sectionToggleEventName, visibleSections]);

  useEffect(() => {
    if (collapsed) {
      setUserMenuOpen(false);
    }
  }, [collapsed]);

  useLayoutEffect(() => {
    if (!scrollPersistenceKey || typeof window === "undefined") return;
    const navElement = navRef.current;
    if (!navElement) return;
    const raw = window.sessionStorage.getItem(scrollPersistenceKey);
    const restored = raw ? Number(raw) : 0;
    if (Number.isFinite(restored) && restored > 0) {
      navElement.scrollTop = restored;
    }
  }, [scrollPersistenceKey]);

  useEffect(() => {
    if (!scrollPersistenceKey || typeof window === "undefined") return;
    const navElement = navRef.current;
    if (!navElement) return;

    const persist = () => {
      window.sessionStorage.setItem(scrollPersistenceKey, String(navElement.scrollTop));
    };

    navElement.addEventListener("scroll", persist, { passive: true });
    return () => {
      persist();
      navElement.removeEventListener("scroll", persist);
    };
  }, [scrollPersistenceKey]);

  const handleItemSelect = useCallback(
    (item: AppSidebarItem) => {
      if (item.disabled) return;
      item.onSelect?.();
      if (item.href && onNavigate) {
        onNavigate(item);
      }
      setUserMenuOpen(false);
    },
    [onNavigate],
  );

  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((previous) => ({
      ...previous,
      [sectionId]: !previous[sectionId],
    }));
  }, []);

  const resolvedHeaderSlot = resolveSlot(headerSlot, collapsed, pathname);
  const resolvedSearchSlot = resolveSlot(searchSlot, collapsed, pathname);
  const resolvedFooterTopSlot = resolveSlot(footerTopSlot, collapsed, pathname);
  const resolvedFooterBottomSlot = resolveSlot(footerBottomSlot, collapsed, pathname);

  const avatarInitials = user ? getInitials(user) : "";

  const userMenu = user?.menu
    ? typeof user.menu === "function"
      ? user.menu({ closeMenu: () => setUserMenuOpen(false) })
      : user.menu
    : null;

  return (
    <TooltipProvider delayDuration={220}>
      <aside
        className={cx(
          "flex h-screen shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-150 ease-out",
          className,
        )}
        style={{ width: collapsed ? collapsedWidth : width }}
      >
        <div
          className={cx(
            "flex h-12 shrink-0 items-center border-b border-sidebar-border px-2.5",
            collapsed ? "justify-center" : "justify-between gap-2",
          )}
        >
          {!collapsed ? (
            <div className="min-w-0 truncate text-sm font-semibold text-foreground">
              {brand.full}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent/60 hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ExpandIcon /> : <CollapseIcon />}
          </button>
        </div>

        {collapsed && brand.compact ? (
          <div className="flex h-9 shrink-0 items-center justify-center border-b border-sidebar-border text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {brand.compact}
          </div>
        ) : null}

        {resolvedHeaderSlot ? (
          <div className="shrink-0 px-2 py-2">{resolvedHeaderSlot}</div>
        ) : null}

        {resolvedSearchSlot ? (
          <div className="shrink-0 border-b border-sidebar-border px-2 py-2">
            {resolvedSearchSlot}
          </div>
        ) : null}

        <nav
          ref={navRef}
          className={cx("flex-1 overflow-y-auto overflow-x-hidden px-2 py-2", navClassName)}
        >
          {visibleSections.map((section) => {
            const sectionCollapsed = collapsedSections[section.id];
            const canToggleSection = section.collapsible !== false;

            return (
              <section
                key={section.id}
                className={cx("mb-4", sectionClassName)}
              >
                {!collapsed ? (
                  <div className="mb-1">
                    {canToggleSection ? (
                      <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className="group flex w-full items-center justify-between px-2"
                      >
                        <span className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {section.label}
                        </span>
                        <SectionChevron collapsed={sectionCollapsed} />
                      </button>
                    ) : (
                      <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {section.label}
                      </div>
                    )}
                  </div>
                ) : null}

                {(collapsed || !sectionCollapsed) && (
                  <ul className="space-y-0.5">
                    {section.items.map((item) => {
                      const active = isItemActive(item, pathname);
                      const badgeVisible = shouldRenderBadge(item.badge);
                      const badgeTone = item.badge?.tone ?? "default";
                      const badgeToneClass =
                        badgeTone === "destructive"
                          ? "bg-destructive text-destructive-foreground"
                          : badgeTone === "muted"
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary";

                      const content = (
                        <button
                          type="button"
                          disabled={item.disabled}
                          onClick={() => handleItemSelect(item)}
                          className={cx(
                            "flex w-full items-center rounded-md text-sm transition-colors duration-150",
                            collapsed
                              ? "justify-center px-0 py-2"
                              : "gap-2.5 px-2 py-1.5",
                            active
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-foreground/80 hover:bg-accent/60",
                            item.disabled && "cursor-not-allowed opacity-60",
                            active && activeItemClassName,
                            !active && inactiveItemClassName,
                            itemClassName,
                          )}
                          title={collapsed ? item.tooltip ?? item.label : undefined}
                        >
                          <span className="relative inline-flex shrink-0">
                            {renderIcon(item.icon, collapsed)}
                            {collapsed && badgeVisible ? (
                              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-destructive" />
                            ) : null}
                          </span>
                          {!collapsed ? (
                            <>
                              <span className="truncate">{item.label}</span>
                              {badgeVisible ? (
                                <span
                                  className={cx(
                                    "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                                    badgeToneClass,
                                  )}
                                >
                                  {formatBadgeValue(item.badge)}
                                </span>
                              ) : null}
                            </>
                          ) : null}
                        </button>
                      );

                      if (!collapsed) {
                        return <li key={item.id}>{content}</li>;
                      }

                      return (
                        <li key={item.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>{content}</TooltipTrigger>
                            <TooltipContent side={tooltipSide}>
                              {item.tooltip ?? item.label}
                            </TooltipContent>
                          </Tooltip>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-sidebar-border px-2 py-2">
          {resolvedFooterTopSlot ? (
            <div
              className={cx(
                "mb-2 flex",
                collapsed ? "justify-center" : "justify-end",
              )}
            >
              {resolvedFooterTopSlot}
            </div>
          ) : null}

          {user ? (
            <div className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      if (userMenu && !collapsed) {
                        setUserMenuOpen((value) => !value);
                      }
                    }}
                    className={cx(
                      "flex w-full items-center rounded-md transition-colors duration-150 hover:bg-accent/60",
                      collapsed ? "justify-center px-0 py-2" : "gap-2.5 px-2 py-1.5",
                    )}
                    aria-label={user.name}
                  >
                    {user.avatar ? (
                      user.avatar
                    ) : (
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {avatarInitials}
                      </span>
                    )}
                    {!collapsed ? (
                      <div className="min-w-0 flex-1 text-left">
                        <div className="truncate text-sm font-medium text-foreground">
                          {user.name}
                        </div>
                        {user.subtitle ? (
                          <div className="truncate text-[11px] text-muted-foreground">
                            {user.subtitle}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </button>
                </TooltipTrigger>
                {collapsed ? (
                  <TooltipContent side={tooltipSide}>
                    {user.name}
                  </TooltipContent>
                ) : null}
              </Tooltip>

              {!collapsed && userMenuOpen && userMenu ? (
                <div className="absolute bottom-full left-0 z-50 mb-1 w-full rounded-md border border-border bg-popover p-1 shadow-sm">
                  {userMenu}
                </div>
              ) : null}
            </div>
          ) : null}

          {visibleFooterActions.length > 0 ? (
            <div
              className={cx(
                user ? "mt-2" : "",
                collapsed ? "flex flex-col items-center gap-1" : "space-y-1",
              )}
            >
              {visibleFooterActions.map((action) => {
                const actionButton = (
                  <button
                    key={action.id}
                    type="button"
                    disabled={action.disabled}
                    onClick={action.onSelect}
                    className={cx(
                      "rounded-md text-sm transition-colors duration-150",
                      collapsed
                        ? "inline-flex h-8 w-8 items-center justify-center"
                        : "flex w-full items-center gap-2 px-2 py-1.5",
                      action.destructive
                        ? "text-destructive hover:bg-accent"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      action.disabled && "cursor-not-allowed opacity-60",
                    )}
                    aria-label={action.label}
                  >
                    {renderActionIcon(action.icon)}
                    {!collapsed ? <span className="truncate">{action.label}</span> : null}
                  </button>
                );

                if (!collapsed) {
                  return actionButton;
                }

                return (
                  <Tooltip key={action.id}>
                    <TooltipTrigger asChild>{actionButton}</TooltipTrigger>
                    <TooltipContent side={tooltipSide}>
                      {action.tooltip ?? action.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ) : null}

          {resolvedFooterBottomSlot ? (
            <div className={cx(visibleFooterActions.length > 0 || user ? "mt-2" : "")}>
              {resolvedFooterBottomSlot}
            </div>
          ) : null}
        </div>
      </aside>
    </TooltipProvider>
  );
}
