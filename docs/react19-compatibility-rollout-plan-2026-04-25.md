# Shared UI React 19 Compatibility Rollout Plan (2026-04-25)

## Context

`crm-web` consumes `@lt/shared-ui` from GitHub, and `shared-ui` currently declares:

- `peerDependencies.react: ^18.3.1`

This peer constraint blocks safe consumer upgrades to React 19.

## Goal

Make `shared-ui` explicitly compatible with React 19, publish a pinned revision, and enable downstream repos (`crm-web`, then others) to upgrade without peer-resolution conflicts.

## Scope

- Update `shared-ui` React compatibility contracts.
- Validate `shared-ui` build and Storybook behavior on React 19.
- Define consumer rollout order and rollback points.

Out of scope:

- Large UI refactors unrelated to compatibility.
- Forcing consumer installs with `--force` or `--legacy-peer-deps`.

## Risk Analysis

## High Risk

- Peer contract mismatch between `shared-ui` and consumers causes install failures.
- React 19 behavior changes can expose subtle rendering and strict-mode differences in shared components.

## Medium Risk

- Type package drift (`@types/react`, `@types/react-dom`) can cause noisy type regressions across downstream apps.
- Storybook and build tooling may need config updates when ecosystem packages expect React 19.

## Low Risk

- Documentation and version pinning updates.

## Execution Plan

## Phase A - Shared UI Compatibility Update

1. Create a dedicated branch in `shared-ui`.
2. Update dependency contracts:
   - Prefer widening peer support first (example: `^18.3.1 || ^19.0.0`) to reduce rollout risk.
   - Align local dev deps (`react`, `react-dom`, type packages) with target validation set.
3. Install and refresh lockfile.

Verification:

- `npm run lint`
- `npm run build`
- `npm run storybook` (manual smoke of core primitives)

## Phase B - Shared UI Consumer Safety Check

Validate highest-usage components in Storybook and/or harness pages:

- table/data grid primitives
- dialogs/popovers/dropdowns
- form controls and filter controls
- toast/notification wrappers

Exit criteria:

- No runtime errors in Storybook smoke paths.
- No new type errors in `shared-ui`.

## Phase C - Publish/Pin Strategy

1. Push `shared-ui` branch.
2. Use an immutable identifier for consumers:
   - Git commit SHA (preferred short-term), or
   - version tag/release (preferred medium-term).
3. Record the pinned target in rollout notes.

## Phase D - Consumer Rollout

Order:

1. `crm-web` (currently blocked by `shared-ui` React peer constraint)
2. `mothership-web`
3. other consumers

For each consumer:

- update `@lt/shared-ui` ref to pinned compatible revision
- run dependency update batch
- verify with:
  - `npm run lint`
  - `npm run test`
  - `npm run build`

## Rollback Plan

- Keep one commit per phase.
- If React 19 regressions appear in `shared-ui`, revert to last stable commit and keep peer widened only if validated.
- If a consumer fails after upgrade, revert only that consumer’s dependency bump and keep other repos unchanged.

## Current Decision

Before further React-major work in `crm-web`, complete **Phase A + B** in `shared-ui` and consume a pinned compatible revision.

