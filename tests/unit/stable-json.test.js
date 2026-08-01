import test from 'node:test'; import assert from 'node:assert/strict'; import { stableJson } from '../../src/shared/stable-json.js';
test('stable ordering',()=>assert.equal(stableJson({b:2,a:1}),'{"a":1,"b":2}'));
