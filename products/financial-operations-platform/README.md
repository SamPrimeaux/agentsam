# FinancialOS Product Scaffold

This directory is the product entry point for AgentSam's platform-level financial business CRM and AI-powered FP&A program.

The master plan lives at:

- `docs/plans/AGENTSAM-FINANCIAL-OPERATIONS-PLATFORM.md`

The machine-readable product declaration lives at:

- `products/financial-operations-platform/product.manifest.json`

## Planned package boundaries

```text
products/financial-operations-platform/
  README.md
  product.manifest.json
  contracts/
    event-envelope.schema.json
    source-lineage.schema.json
    canonical-entity.schema.json
    metric-definition.schema.json
    agent-evidence.schema.json
  fixtures/
    saas/
    services/
    nonprofit/
    ecommerce/
    multi-entity/
  evals/
    numerical-accuracy/
    attribution/
    policy-compliance/
    uncertainty/
  workflows/
    cash-runway-risk/
    month-end-close/
    invoice-review/
    board-package/
```

```text
packages/
  financial-core/
  financial-graph/
  financial-crm/
  fp-and-a/
  accounting-intelligence/
  treasury/
  revenue-intelligence/
  procurement/
  payroll-intelligence/
  reporting/
  board/
  risk-controls/
  document-intelligence/
  workflow-engine/
  approval-engine/
  connector-sdk/
  financial-agent-sdk/
```

## First implementation lane

Build one narrow, end-to-end, read-only slice before broadening the surface.

### Input adapters

1. Bank CSV adapter
2. Operating-plan spreadsheet adapter
3. Stripe fixture or read-only Stripe adapter
4. Customer/vendor CSV adapter

### Canonical entities

1. Tenant
2. Legal entity
3. Account
4. Counterparty
5. Transaction
6. Invoice
7. Payment
8. Budget line
9. Forecast assumption
10. Evidence item

### Deterministic outputs

1. Current cash position
2. Monthly revenue
3. Monthly spend
4. Top counterparties
5. Burn rate
6. Runway
7. Budget versus actuals
8. Downside scenario

### Agent outputs

1. Source-linked variance explanation
2. Executive financial summary
3. Missing-data and confidence report
4. Recommended review tasks

## Implementation sequence

### Milestone 1: contracts and fixtures

- define canonical IDs and provider aliases;
- define ingestion and evidence envelopes;
- establish currency, timezone, and period rules;
- add sanitized fixtures;
- pin expected metrics for each fixture.

### Milestone 2: deterministic finance core

- parse source inputs;
- normalize transactions and counterparties;
- calculate cash, revenue, spend, burn, runway, and variances;
- prove idempotent replay;
- prove calculation reproducibility.

### Milestone 3: source-linked agent reasoning

- retrieve only permission-eligible records;
- provide calculations and evidence to the agent;
- require explicit assumptions and uncertainty;
- reject unsupported answers;
- produce machine-readable evidence alongside prose.

### Milestone 4: command-center surface

- cash card;
- revenue and spend trends;
- budget versus actuals;
- counterparty view;
- financial relationship timeline;
- scenario comparison;
- universal finance chat.

### Milestone 5: workflow promotion

- add review tasks and approvals;
- run agents in shadow mode;
- compare outputs against golden baselines;
- promote individual actions only after quality gates pass.

## Hard rules

- Financial math does not live only inside prompts.
- Provider IDs do not become canonical primary identity.
- No hard-coded default branch, provider, currency, timezone, fiscal year, or chart of accounts.
- Material AI claims require evidence, freshness, assumptions, and confidence.
- Read-only comes before authoritative writes.
- Money movement and ledger mutation require explicit policy and recorded approval.
- Every product control must be functional before it is presented as available.
