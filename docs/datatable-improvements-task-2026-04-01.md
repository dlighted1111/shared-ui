# Shared UI DataTable Improvements Task (2026-04-01)

## Context

Source spec: `/Users/kompanietss/Downloads/Shared-UI-DataTable-Improvements-Sergey.md`

Related project selected: `shared-ui` (primary repo in source spec).

Consumer impact: `mothership-web` and `doopluxe-foundation`.

## Task Contract

Task:
- Prepare and execute P1 DataTable improvements in `shared-ui` so consuming apps inherit behavior with one package update.

Scope:
- `shared-ui/src/components/DataTable.tsx` UI-only updates for:
  - P1.1 Auto-fit columns + truncation fix
  - P1.2 Zebra striping
  - P1.3 Opt-in truncation tooltip behavior
  - P1.4 Frozen column shadow upgrade
- Define acceptance checks for both consuming apps.

Out of scope:
- P2 and P3 items from source spec.
- Any DB schema, SQL migration, RPC, RLS, trigger, or backend changes.
- App-specific CMD+K and sidebar badge work in consuming apps.

Branch:
- `task/shared-ui-datatable-improvements-20260401`

Hard constraints:
- No backend or infra changes.
- Keep table horizontal scrolling support intact.
- Preserve existing default behavior unless explicitly changed by P1 requirements.
- Truncation becomes opt-in through `ColumnDef.truncate?: boolean`.

Done when:
- P1.1-P1.4 are implemented in `shared-ui` with no regressions in current table consumers.
- DataTable API docs/examples include the new `truncate` option.
- `mothership-web` validation confirms long text rendering, zebra striping, tooltip behavior, and frozen-column shadow.
- Any consumer-specific wrapper (`mothership-web` local DataTable wrapper) no longer reintroduces forced truncation.

Verify commands:
- `shared-ui`: `npm run lint`, `npm run test`, `npm run build`
- `mothership-web` smoke validation after package update/integration: `npm run lint`, `npm run test`, `npm run build`
- Manual checks from acceptance checklist below.

Output format:
- Batch checkpoint report with changed files, verification results, risks, and next step.

## Execution Plan (P1 only)

### Batch 1 - Remove forced truncation and enable auto-fit
- Remove forced `overflow`/`textOverflow`/`whiteSpace` from frozen cell style and table cell classes.
- Set table layout to `auto` (or remove fixed layout).
- Remove or raise `DEFAULT_CELL_MAX_WIDTH`.
- Add `truncate?: boolean` to `ColumnDef` (default false).

### Batch 2 - Opt-in truncation + native tooltip
- For columns with `truncate: true`, apply truncation classes only there.
- Add `title={String(cellValue)}` for opt-in truncated cells.

### Batch 3 - Zebra striping + frozen shadow
- Add alternating row tint classes.
- Replace or augment frozen boundary border with stronger shadow on last frozen column for both `th` and `td`.

### Batch 4 - Consumer validation and wrapper parity
- Validate in `mothership-web`.
- Ensure local wrapper does not re-apply truncation.
- Log follow-up task for `doopluxe-foundation` validation if repo access is external.

## Acceptance Checklist

- `turns/active` and `renewals/active`: long values are fully visible by default.
- Zebra striping is visible and hover state remains clear.
- Cells with `truncate: true` show ellipsis plus hover tooltip.
- Last frozen column shadow is visible while horizontally scrolling.
- No table layout regressions in existing stories or consumers.

## Dependencies and Open Questions

- Confirm whether `doopluxe-foundation` repo is available in this workspace for parity verification.
- Confirm preferred tooltip approach for opt-in truncation:
  - native `title` attribute (default in this task), or
  - shared Tooltip component.
- Confirm release path for shared-ui package version bump and consumer rollout.
