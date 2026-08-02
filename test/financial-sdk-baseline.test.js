import test from 'node:test';
import assert from 'node:assert/strict';
import { money, sumMoney, calculateRunwayMonths } from '../packages/financial-core/src/index.js';
import { createRelationship, createFollowUp, groupFollowUpsByUrgency } from '../packages/financial-crm/src/index.js';
import { calculateVariance, applyScenario } from '../packages/fp-and-a/src/index.js';
import { validateActionRegistry, createCapabilityMap } from '../packages/financial-ui-contracts/src/index.js';
import { defineAdapter, createIsolatedRuntime, evaluatePromotionGate } from '../packages/financial-integration-kit/src/index.js';

test('financial core keeps arithmetic deterministic', () => {
  assert.deepEqual(sumMoney([money(1000), money(2500)]), money(3500));
  assert.equal(calculateRunwayMonths({ cashMinor: 120000, monthlyBurnMinor: 10000 }), 12);
});

test('CRM contracts support relationships and actionable follow-ups', () => {
  const relationship = createRelationship({ id: 'rel_1', displayName: 'Acme', relationshipType: 'customer' });
  const followUp = createFollowUp({ id: 'fu_1', relationshipId: relationship.id, dueAt: '2026-01-01T12:00:00Z', title: 'Review proposal' });
  const grouped = groupFollowUpsByUrgency([followUp], new Date('2026-01-02T12:00:00Z'));
  assert.equal(grouped.overdue.length, 1);
});

test('FP&A calculations remain model-independent', () => {
  assert.equal(calculateVariance({ actualMinor: 120, planMinor: 100 }).percent, 0.2);
  const [row] = applyScenario([{ category: 'revenue', amountMinor: 1000 }], [{ id: 'a1', target: 'revenue', multiplier: 0.9 }]);
  assert.equal(row.amountMinor, 900);
});

test('every rendered action must have an executable contract', () => {
  assert.equal(validateActionRegistry([{ id: 'relationship.create', label: 'Add client', execute: async () => ({ ok: true }) }]), true);
  assert.throws(() => validateActionRegistry([{ id: 'dead.button', label: 'Dead button' }]));
});

test('drop-ins default to isolated non-authoritative operation', async () => {
  const adapter = defineAdapter({ id: 'fixture.clients', read: async () => [{ id: 'rel_1' }] });
  const runtime = createIsolatedRuntime({ adapters: [adapter] });
  assert.equal(runtime.mode, 'read-only-sandbox');
  assert.deepEqual(await runtime.read('fixture.clients', {}), [{ id: 'rel_1' }]);
  await assert.rejects(runtime.write('fixture.clients', {}), /disabled/);
  assert.equal(createCapabilityMap().authoritativeWrites, false);
});

test('promotion remains blocked until every proof gate passes', () => {
  const result = evaluatePromotionGate({ deterministicTests: true, fixtureParity: true, permissionsVerified: true, evidenceComplete: false, shadowReviewed: false });
  assert.equal(result.promotable, false);
  assert.deepEqual(result.failures, ['evidenceComplete', 'shadowReviewed']);
});
