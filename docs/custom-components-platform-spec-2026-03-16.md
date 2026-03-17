# LT Shared UI Custom Components Spec

## Task Contract
Task: Build a custom shared component system in `@lt/shared-ui` and make it consumable by `crm-web` and `mothership-web`.
Scope: Shared component APIs, styles, Storybook docs, theme provider, and migration-ready exports.
Out of scope: Domain business logic, Supabase calls, route changes, database migrations, edge functions.
Branch: `feature/shared-ui-wave1-20260316` (continue until split requested).
Hard constraints:
- No UI component libraries for the new shared primitives (no Radix/shadcn/MUI/AntD in new shared components).
- Keep React-only runtime with app-level business logic outside shared-ui.
- Preserve existing behavior in consuming apps through adapters where needed.
Done when:
- All required shared components are implemented and exported:
  - `Button`, `Link`, `Input`, `Textarea`, `Checkbox`, `SelectMenu`, `Dropdown`, `ColorPicker`, `Modal`, `Datepicker`, `Toast`.
- A theme provider (light/dark) exists and is used in component examples.
- Storybook documents all shared components with usage and states.
- Both apps build successfully using the shared package.
Verify commands:
- `shared-ui`: `npm run build` and Storybook build command once added.
- `crm-web`: `npm run build`
- `mothership-web`: `npm run build`
Output format: checkpoint per batch with changed files, verification, risks, next step.

## Canonical Audit Reference
- Consolidated audit task folder: [`companies/lt/lt/docs/tasks/consolidated-audit-2026-03-14`](../../lt/docs/tasks/consolidated-audit-2026-03-14/)
- This implementation track uses only UI sections from that package and explicitly excludes DB/migration/edge-function tracks.

## Architecture Rules
- Keep components presentation-focused and reusable.
- Avoid app-specific naming and business entities in shared component props.
- Prefer controlled component APIs and typed callbacks.
- Use CSS variables for theming tokens and support light/dark at provider level.

## Required Folder Structure
- `src/components/core/*` for new primitive components.
- `src/theme/*` for provider, tokens, and theme hooks.
- `src/styles/*` for global tokens and component styles.
- `src/index.ts` exports all public APIs only.
- `docs/storybook/*` for Storybook guidance and conventions.

## Implementation Batches
1. Foundation
- Add theme tokens, `ThemeProvider`, and base style reset strategy.
- Add Storybook config and docs skeleton.

2. Form primitives
- `Input`, `Textarea`, `Checkbox`, `SelectMenu`, `Datepicker`, `ColorPicker`.
- Cover default, disabled, error, and dark mode states.

3. Action and navigation primitives
- `Button`, `Link`, `Dropdown`.
- Add size/variant system and keyboard accessibility checks.

4. Feedback and overlays
- `Modal`, `Toast`.
- Ensure escape handling, focus management, and reduced-motion safe behavior.

5. Hardening and adoption support
- Final API review, export cleanup, migration notes for consumers.

## Storybook Requirement
Yes, use Storybook for this initiative.
- Reason: it is the fastest way to review visual parity and interaction states for shared primitives across two apps.
- Minimum story set per component: default, variants, disabled, error (if applicable), dark theme.

## Risks and Mitigations
- Risk: visual drift between apps.
  - Mitigation: tokenized styles and Storybook visual review before app rollout.
- Risk: behavior regressions for modal/dropdown/date interactions.
  - Mitigation: adapter rollout in apps, keep local fallback until build and manual smoke pass are green.
