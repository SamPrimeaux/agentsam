# Agent Sam Core Lab

Isolated compatibility and refactoring laboratory for bounded Inner Animal Media core components.

## Purpose

- Import one component with a pinned source commit.
- Freeze the legacy implementation as the behavioral oracle.
- Build a modular candidate behind explicit ports.
- Compare both against sanitized deterministic fixtures.
- Produce reviewable evidence before any shadow integration into `inneranimalmedia`.

## Boundaries

- Separate Worker/repo from `inneranimalmedia` (`agentsam` → `https://agentsam.inneranimalmedia.com`).
- No customer data / authoritative IAM tenant writes from this lab.
- Ship lab UI: `npm run deploy` (syncs `public/` then `wrangler deploy`).

## First target

`src/core/code-indexer.js` from `SamPrimeaux/inneranimalmedia` is the recommended first capsule.

## Workflow

```text
pinned import → baseline fixtures → candidate modules → compatibility report → independent PR QC → shadow integration
```

Create a capsule:

```bash
npm run component:new -- code-indexer
npm run check
```

## Mobile client lab (`app/mobile`)

Rapid-fire mobile dashboards and Agent Sam tab UX — relocated from `inneranimalmedia/mobile/`. See [`docs/app-mobile-lab.md`](docs/app-mobile-lab.md).

```bash
npm run dev:mobile    # Vite :3010, proxies /api → local IAM worker :8787
npm run build:mobile
```

## Large-file refactor program

The lab now includes a staged program for preparing, characterizing, modularizing, and independently reviewing oversized `inneranimalmedia` components. Start with [`docs/plans/AGENTSAM-LARGE-FILE-REFACTOR-PROGRAM.md`](docs/plans/AGENTSAM-LARGE-FILE-REFACTOR-PROGRAM.md). The supplied baseline is intentionally marked unverified until regenerated from a pinned source commit.
