import type { ElementType, ReactNode } from "react";

export type AppSidebarIconComponent = ElementType<{
  className?: string;
  size?: string | number;
  strokeWidth?: number;
}>;

export type AppSidebarIcon = ReactNode | AppSidebarIconComponent;

export interface AppSidebarBadge {
  value: number | string;
  max?: number;
  tone?: "default" | "destructive" | "muted";
  hideWhenZero?: boolean;
}

export interface AppSidebarItem {
  id: string;
  label: string;
  href?: string;
  icon?: AppSidebarIcon;
  tooltip?: string;
  disabled?: boolean;
  hidden?: boolean;
  exactMatch?: boolean;
  matchPaths?: string[];
  badge?: AppSidebarBadge | null;
  isActive?: (pathname: string) => boolean;
  onSelect?: () => void;
}

export interface AppSidebarSection {
  id: string;
  label: string;
  items: AppSidebarItem[];
  hidden?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface AppSidebarAction {
  id: string;
  label: string;
  icon?: AppSidebarIcon;
  onSelect: () => void;
  tooltip?: string;
  hidden?: boolean;
  disabled?: boolean;
  destructive?: boolean;
}

export interface AppSidebarUserMenuHelpers {
  closeMenu: () => void;
}

export interface AppSidebarUser {
  name: string;
  subtitle?: string;
  initials?: string;
  avatar?: ReactNode;
  menu?: ReactNode | ((helpers: AppSidebarUserMenuHelpers) => ReactNode);
}

export interface AppSidebarBrand {
  full: ReactNode;
  compact?: ReactNode;
}

export interface AppSidebarRenderContext {
  collapsed: boolean;
  pathname: string;
}

export interface AppSidebarShellProps {
  brand: AppSidebarBrand;
  pathname: string;
  sections: AppSidebarSection[];
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onNavigate?: (item: AppSidebarItem) => void;
  width?: number;
  collapsedWidth?: number;
  className?: string;
  navClassName?: string;
  sectionClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  inactiveItemClassName?: string;
  searchSlot?: ReactNode | ((context: AppSidebarRenderContext) => ReactNode);
  headerSlot?: ReactNode | ((context: AppSidebarRenderContext) => ReactNode);
  footerTopSlot?: ReactNode | ((context: AppSidebarRenderContext) => ReactNode);
  footerBottomSlot?: ReactNode | ((context: AppSidebarRenderContext) => ReactNode);
  user?: AppSidebarUser;
  footerActions?: AppSidebarAction[];
  sectionToggleEventName?: string;
  scrollPersistenceKey?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}
