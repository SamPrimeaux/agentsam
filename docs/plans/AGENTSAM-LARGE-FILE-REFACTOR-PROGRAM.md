# Agent Sam Large-File Refactor Program

## Mission

Prepare bounded, independently reviewable refactor lanes for the largest files in `SamPrimeaux/inneranimalmedia` without allowing Agent Sam experiments to endanger production behavior.

This repository is the laboratory and coordination surface. Production source remains in `inneranimalmedia` until a candidate is proven through compatibility fixtures, independent review, and a feature-flagged or shadow integration plan.

## Baseline

Repository scan supplied on 2026-08-01:

- 2,774 JS/TS/TSX/Py files
- 31.6 MB total source
- 71 files over 50 KB
- 23 files over 100 KB
- 6 files over 200 KB

Largest known files:

| Priority | Size | Approx. tokens | Source file |
|---:|---:|---:|---|
| 1 | 427.8 KB | 109,500 | `dashboard/Finance.js` |
| 2 | 249.4 KB | 63,800 | `dashboard/App.tsx` |
| 3 | 227.5 KB | 58,200 | `src/api/agent.js` |
| 4 | 206.1 KB | 52,800 | `dashboard/cms-editor/CmsEditorApp.tsx` |
| 5 | 190.9 KB | 48,900 | `dashboard/components/ChatAssistant/ChatAssistant.tsx` |
| 6 | 163.9 KB | 42,000 | `src/api/settings.js` |
| 7 | 147.6 KB | 37,800 | `src/core/catalog-tool-executor.js` |
| 8 | 143.9 KB | 36,800 | `src/core/agent-tool-loop.js` |

These figures must be refreshed from the pinned source commit before each lane starts. Never assume the table remains current.

## Why this matters

Large files impose a recurring agent tax:

1. They require repeated paginated reads before any edit can be planned.
2. Context must be reloaded in every new session and by every independent reviewer.
3. Exact patch anchors become less unique as boilerplate repeats.
4. Models under context pressure are more likely to choose blunt whole-file rewrites.
5. Reviewers cannot cheaply isolate responsibility, side effects, or ownership.
6. A single-file change can hide unrelated behavior and widen regression risk.

The goal is not arbitrary file splitting. The goal is to create stable seams, explicit responsibilities, smaller review units, and testable contracts.

## Program rules

1. One source component per lane.
2. One writing agent per branch and isolated checkout/worktree.
3. Pin the exact `inneranimalmedia` source commit in the capsule manifest.
4. Import only the target file plus the minimum dependencies needed for fixtures.
5. Preserve a frozen legacy oracle.
6. Do not redesign product behavior while extracting modules.
7. Every intentional behavior change must be listed separately from structural refactoring.
8. No automatic merge, production deploy, database migration, or cross-repository promotion.
9. Independent QC must not modify the implementer's branch.
10. Promotion back to `inneranimalmedia` requires a separate integration PR.

## File-size policy

### Soft target

Actively edited source modules should generally remain near:

- 400–600 lines, or
- 15–20 KB

This is guidance, not a blind failure condition. Cohesion is more important than an arbitrary number.

### Hard new-growth gate

For `src/` and `dashboard/`:

- New files over 50 KB must fail the size guard unless explicitly allowlisted with a written reason and review date.
- Existing oversized files are grandfathered temporarily but may not grow beyond their recorded baseline.
- A touched oversized file should either shrink or include a documented extraction plan.

The first guard should be report-only in the Agent Sam lab, then warning-only in `inneranimalmedia`, then blocking for new growth after baseline review.

## Refactor sequence

### Phase 0 — Build the measurement and evidence layer

Deliverables:

- reproducible source-size scanner;
- baseline JSON pinned to an `inneranimalmedia` commit;
- file-size guard with allowlist support;
- import/reference graph report for each target;
- public export and route inventory;
- change-frequency and direct-caller report;
- compatibility report template.

Exit criteria:

- the same scan produces stable results on the same commit;
- CI can detect new files over the hard threshold;
- CI can detect growth beyond an existing-file baseline;
- reports contain no production secrets or customer data.

### Phase 1 — `dashboard/Finance.js`

Reason: largest known file and highest recurring read cost.

Initial agent task is archaeology only:

- enumerate top-level components, hooks, constants, formatters, API clients, state groups, dialogs, tables, charts, and route responsibilities;
- identify import consumers and exported entry points;
- create a responsibility map;
- propose module boundaries without moving code;
- identify hidden shared state and ordering dependencies.

Likely target shape, subject to evidence:

```text
dashboard/finance/
  FinanceApp.tsx
  routes/
  pages/
  components/
  hooks/
  services/
  state/
  formatters/
  contracts/
```

Promotion must preserve the existing public route and component entry point through a compatibility facade.

### Phase 2 — `dashboard/App.tsx`

Focus:

- route registration;
- shell/layout composition;
- global providers;
- lazy-loaded feature boundaries;
- navigation and session wiring.

Target: make `App.tsx` a composition root, not the implementation home for product domains.

### Phase 3 — `src/api/agent.js`

Focus:

- thin transport routes;
- authentication/request parsing;
- streaming/SSE adapter;
- application service calls;
- response and error mapping.

Do not refactor `agent-tool-loop.js` in the same lane. First extract transport and use-case seams while preserving the production execution spine.

### Phase 4 — `CmsEditorApp.tsx`

Focus:

- editor shell;
- document state;
- preview bridge;
- inspector panels;
- persistence actions;
- commands and keyboard shortcuts.

### Phase 5 — `ChatAssistant.tsx`

Focus:

- presentation versus conversation state;
- streaming event reducer;
- attachment/file context;
- composer;
- message list;
- tool execution display;
- approvals and error states.

### Phase 6 — backend runtime giants

Targets:

- `src/api/settings.js`
- `src/core/catalog-tool-executor.js`
- `src/core/agent-tool-loop.js`

These require stronger compatibility and replay infrastructure. They should not be the first autonomous refactor lanes.

## Standard lane lifecycle

### 1. Source pin

Record:

- repository;
- source commit SHA;
- source path;
- file size and line count;
- direct importers;
- direct imports;
- known runtime routes;
- recent churn.

### 2. Archaeology report

No production behavior changes. Produce:

- symbol inventory;
- responsibility clusters;
- shared mutable state;
- side effects;
- external contracts;
- likely seams;
- unsafe assumptions;
- unknowns requiring operator review.

### 3. Characterization tests

Before modularization, capture current behavior through:

- route/component smoke fixtures;
- exported helper tests;
- snapshot or golden outputs where appropriate;
- mocked network/storage calls;
- event sequence fixtures;
- error-path fixtures.

Characterization tests document behavior; they do not certify that legacy behavior is ideal.

### 4. Candidate extraction

Move one responsibility cluster at a time. Keep the old entry point as a facade. Avoid broad renaming and behavior improvements in the same commit.

### 5. Compatibility review

Compare:

- imports and exports;
- rendered or returned outputs;
- event ordering;
- network requests;
- storage effects;
- route behavior;
- error behavior;
- bundle/build results;
- performance where relevant.

### 6. Independent QC

A separate agent reviews the branch and submits:

- pass/fail matrix;
- untested behavior;
- suspicious behavior changes;
- rollback confidence;
- recommendation: reject, revise, shadow, or integrate.

### 7. Production integration

A new `inneranimalmedia` branch imports the candidate behind a facade or feature flag. The lab branch is not merged directly into production.

## Agent roles

### Archaeologist

Read-only. Builds the source map and identifies seams. Must distinguish defined code from production-reachable code.

### Refactor implementer

Moves one bounded responsibility cluster at a time. May not broaden scope into product redesign.

### Compatibility verifier

Runs legacy and candidate fixtures, inspects diffs, and checks behavior claims. Does not modify the implementer branch.

### Integration owner

Works only in `inneranimalmedia` after lab approval. Owns feature flags, shadow mode, rollback, and production validation.

## Required evidence package

Every lane must produce:

```text
reports/<component>/<run-id>/
  source-pin.json
  size-before-after.json
  symbol-inventory.json
  responsibility-map.md
  import-graph.json
  compatibility-summary.md
  tests-run.json
  known-gaps.md
  integration-plan.md
  rollback-plan.md
```

## Success metrics

A refactor is successful when it improves all or most of the following without changing unintended behavior:

- maximum file size;
- average edit/read scope;
- number of responsibilities per module;
- independent testability;
- patch uniqueness;
- reviewer comprehension;
- build/test reliability;
- rollback clarity.

Do not use raw file count as a success metric. Splitting one giant file into many incoherent files is not an improvement.

## Initial milestones

### Milestone A — Guard and baseline

- scanner committed;
- baseline generated from pinned source commit;
- report-only CI running;
- no production integration.

### Milestone B — Finance archaeology

- complete responsibility and symbol map;
- proposed module boundaries;
- no behavior changes.

### Milestone C — Finance first extraction

- one low-risk cluster extracted;
- facade preserves entry point;
- characterization tests pass;
- independent QC complete.

### Milestone D — Repeatable factory

- capsule template works for `App.tsx` and `agent.js` without redesigning the lab process.

## Ticket breakdown

Umbrella:

`agentsam_large_file_refactor_program`

Children:

- `agentsam_source_size_scanner`
- `agentsam_source_size_guard`
- `agentsam_large_file_baseline`
- `agentsam_finance_archaeology`
- `agentsam_finance_characterization`
- `agentsam_finance_first_extraction`
- `agentsam_app_composition_root_archaeology`
- `agentsam_agent_api_transport_archaeology`
- `agentsam_cms_editor_archaeology`
- `agentsam_chat_assistant_archaeology`
- `agentsam_refactor_compatibility_reporter`
- `agentsam_refactor_independent_qc`

## Immediate next action

Do not begin by rewriting `Finance.js`.

Begin with Milestone A and the read-only Finance archaeology lane. That prepares agents to split the file based on real dependencies and behavior rather than visual guesses.
