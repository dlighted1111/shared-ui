# shared-ui

Shared UI primitives consumed by `crm-web` and `mothership-web`.

Current migrated components:

- `StatusPill`
- `EmptyState`
- `QuickFilterBar`
- CSV utilities (`downloadCsvFile`, `buildDatedCsvFilename`, `exportRecordsToCsv`)

This package intentionally contains only presentation primitives.
Domain data logic, auth, routing, query keys, and API calls stay in each app.
