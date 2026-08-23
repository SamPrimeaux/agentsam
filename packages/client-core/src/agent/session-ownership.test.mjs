/**
 * Sprint 3 Agent Sam ownership proof.
 * client-core listSessions is the canonical session *list* contract.
 * Dashboard + mobile both consume createAgentClient (second surface = mobile).
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../../..');

test('dashboard session list uses createAgentClient.listSessions', () => {
  const hook = readFileSync(join(root, 'dashboard/hooks/useAgentChatSessions.ts'), 'utf8');
  assert.match(hook, /createAgentClient/);
  assert.match(hook, /\.listSessions\(/);
  assert.doesNotMatch(hook, /fetch\(`\/api\/agent\/sessions\?/);
  assert.doesNotMatch(hook, /fetch\('\/api\/agent\/sessions\?/);
});

test('mobile second surface already uses createAgentClient', () => {
  const mobile = readFileSync(join(root, 'mobile/src/app/MobileApp.tsx'), 'utf8');
  assert.match(mobile, /createAgentClient/);
  assert.match(mobile, /listSessions\(/);
});

test('AgentSessionSummary is the shared contract from platform-contracts', () => {
  const contracts = readFileSync(join(root, 'packages/platform-contracts/src/index.ts'), 'utf8');
  assert.match(contracts, /export type AgentSessionSummary/);
  assert.match(contracts, /started_at\?: number/);
  assert.match(contracts, /updated_at\?: number/);
  const client = readFileSync(join(root, 'packages/client-core/src/agent/client.ts'), 'utf8');
  assert.match(client, /AgentSessionSummary/);
  assert.match(client, /normalizeAgentSessionSummary/);
});
