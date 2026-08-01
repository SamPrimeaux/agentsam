export function createBudgetLine({ id, period, category, amountMinor, dimensions = {}, assumptions = [] }) {
  if (!id || !period || !category || !Number.isFinite(amountMinor)) throw new TypeError('valid budget line fields are required');
  return Object.freeze({ id, period, category, amountMinor: Math.trunc(amountMinor), dimensions: Object.freeze({ ...dimensions }), assumptions: Object.freeze([...assumptions]) });
}

export function calculateVariance({ actualMinor, planMinor }) {
  if (!Number.isFinite(actualMinor) || !Number.isFinite(planMinor)) throw new TypeError('actualMinor and planMinor must be finite');
  const amountMinor = actualMinor - planMinor;
  const percent = planMinor === 0 ? null : amountMinor / Math.abs(planMinor);
  return Object.freeze({ actualMinor, planMinor, amountMinor, percent, direction: amountMinor === 0 ? 'on-plan' : amountMinor > 0 ? 'above-plan' : 'below-plan' });
}

export function applyScenario(baseRows, assumptions) {
  const byTarget = new Map(assumptions.map((item) => [item.target, item]));
  return baseRows.map((row) => {
    const assumption = byTarget.get(row.category);
    if (!assumption) return Object.freeze({ ...row });
    const multiplier = Number.isFinite(assumption.multiplier) ? assumption.multiplier : 1;
    const deltaMinor = Number.isFinite(assumption.deltaMinor) ? assumption.deltaMinor : 0;
    return Object.freeze({ ...row, amountMinor: Math.trunc(row.amountMinor * multiplier + deltaMinor), appliedAssumptionId: assumption.id });
  });
}

export function compareScenarios(scenarios) {
  return scenarios.map((scenario) => Object.freeze({
    id: scenario.id,
    label: scenario.label,
    totalMinor: scenario.rows.reduce((sum, row) => sum + row.amountMinor, 0),
    assumptionCount: scenario.assumptions?.length || 0
  }));
}
