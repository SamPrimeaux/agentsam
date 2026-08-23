# Mobile client lab (`app/mobile`)

IAM's focused mobile shell (Sam · Projects · Work · Me) lives here for **rapid iteration** without churning the production `inneranimalmedia` monorepo.

## Why here

- Same platform APIs (`/api/*`) — no mobile backend fork.
- Vendored `@inneranimalmedia/client-core` + `platform-contracts` (sync from pinned IAM commit when contracts change).
- Independent Vite build; future publish to lab host or shadow IAM path after QC.

## Commands

```bash
npm run guard:mobile-lane
npm run dev:mobile      # :3010 → proxy /api to :8787
npm run build:mobile
```

## Boundaries

- Do not import IAM `dashboard/`.
- Do not add authoritative tenant writes — lab UI only.
- Production IAM PWA (`inneranimalmedia` dashboard) remains the shipped mobile web surface until this lane graduates.

Upstream IAM doc: `inneranimalmedia/docs/architecture/mobile-lane.md`.
