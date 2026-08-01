# Lab Architecture

- `contracts/`: stable schemas.
- `fixtures/components/<id>/manifest.json`: source pin, boundaries, observable outputs, promotion plan.
- `src/lab/<id>/legacy/`: frozen imported implementation.
- `src/lab/<id>/candidate/`: modular replacement.
- `src/lab/<id>/ports/`: dependency interfaces.
- `src/lab/<id>/adapters/`: deterministic fakes and optional staging adapters.
- `tests/contract/`: legacy/candidate comparisons.
- `tests/unit/`: pure invariants.
- `tests/integration/`: bounded fixture-repository workflows.

Promotion stages: fixture comparison → shadow execution → canary → feature flag → legacy removal.
