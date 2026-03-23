# Shared UI Foundation: Theme Provider + Tokens + Storybook

## Scope

This document captures Batch 1 foundation setup in `@lt/shared-ui`:

- design tokens for light/dark themes
- `ThemeProvider` contract and `useTheme` hook
- Storybook base scaffold for visual review

This batch is UI-only and introduces no DB, API, migration, or edge-function changes.

## Public Contracts Added

- `ThemeProvider`
- `useTheme`
- `useThemeContext`
- `designTokens`
- `ThemeMode`, `ResolvedTheme`, `ThemeTokenMap`

All are exported through `src/index.ts`.

## Token Strategy

- Tokens are defined in `src/theme/tokens.ts`.
- Theme-specific token maps are keyed by `light` and `dark`.
- Provider resolves mode (`light | dark | system`) and exposes CSS variables.

## Storybook Base

- Config is under `.storybook/`.
- Theme toolbar is available in Storybook globals (`light`, `dark`, `system`).
- First foundation story: `Foundation/ThemeProvider`.

## Runbook

From `shared-ui`:

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run storybook`
- `npm run build-storybook`
