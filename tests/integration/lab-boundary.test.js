import test from 'node:test'; import assert from 'node:assert/strict'; import { readFile } from 'node:fs/promises';
test('fixture mode default',async()=>assert.match(await readFile(new URL('../../.env.example',import.meta.url),'utf8'),/fixture/));
