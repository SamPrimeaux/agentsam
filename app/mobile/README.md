# IAM Mobile (lab)

Rapid-iteration mobile client surface for Inner Animal Media. Lives in the [Agent Sam Core Lab](https://github.com/SamPrimeaux/agentsam) so dashboard/mobile UX experiments do not churn the production monorepo.

## Platform contract

- Consumes production IAM `/api/*` (session, workspace, Agent Sam SSE, projects, tickets, artifacts).
- Shared transport via vendored `@inneranimalmedia/client-core` + `@inneranimalmedia/platform-contracts` (sync from `SamPrimeaux/inneranimalmedia` when contracts change).
- Does **not** import `inneranimalmedia/dashboard` or add `/api/mobile` backend forks.

Heavy workstation surfaces stay on IAM desktop/PWA; this app is the focused tab shell (Sam · Projects · Work · Me).

## Dev

```bash
# From agentsam lab repo root — IAM worker on :8787 (local or tunneled)
npm run dev:mobile
```

Vite dev server: `http://localhost:3010` with `/api` proxied to `127.0.0.1:8787`.

## Ship path (future)

Lab build → `agentsam.inneranimalmedia.com/mobile/` or shadow path on IAM after QC — not wired in IAM `deploy:full` today.

## Upstream

Relocated from `inneranimalmedia/mobile/` (2026-08). SSOT architecture notes remain in IAM: `docs/architecture/mobile-lane.md`.
