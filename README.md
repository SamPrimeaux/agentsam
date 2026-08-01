# Agent Sam Core Lab

Isolated compatibility and refactoring laboratory for bounded Inner Animal Media core components.

## Purpose

- Import one component with a pinned source commit.
- Freeze the legacy implementation as the behavioral oracle.
- Build a modular candidate behind explicit ports.
- Compare both against sanitized deterministic fixtures.
- Produce reviewable evidence before any shadow integration into `inneranimalmedia`.

## Boundaries

No production secrets, customer data, deployments, authoritative writes, automatic promotion, or automatic merge.

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
