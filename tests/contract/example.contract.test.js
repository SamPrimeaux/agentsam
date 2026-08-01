import test from 'node:test'; import assert from 'node:assert/strict';
import { normalizeRecord as legacy } from '../../src/lab/example/legacy/index.js';
import { normalizeRecord as candidate } from '../../src/lab/example/candidate/index.js';
for (const input of [{id:7,value:' hello '},{},null]) test(`compat ${JSON.stringify(input)}`,()=>assert.deepEqual(candidate(input),legacy(input)));
