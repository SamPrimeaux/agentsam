#!/usr/bin/env node
/**
 * Sync lab static surfaces into ./public for Workers Assets deploy.
 * CF Builds uses: npx wrangler deploy (no build step required if public/ is committed).
 */
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

rmSync(publicDir, { recursive: true, force: true });
mkdirSync(publicDir, { recursive: true });

const ganttSrc = join(root, 'prototype-gnantt.html');
const prototypeSrc = join(root, 'prototype');
if (!existsSync(ganttSrc) || !existsSync(prototypeSrc)) {
  console.error('missing prototype sources');
  process.exit(1);
}

cpSync(ganttSrc, join(publicDir, 'prototype-gnantt.html'));
cpSync(prototypeSrc, join(publicDir, 'prototype'), { recursive: true });

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AgentSam Lab</title>
  <style>
    :root { color-scheme: dark; --bg:#0b0e16; --panel:#121725; --line:#252c40; --text:#f5f7ff; --muted:#8f98ad; --accent:#7c5cff; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; background: radial-gradient(circle at 70% 10%, rgba(124,92,255,.18), transparent 35%), #080a10; color: var(--text); }
    main { max-width: 760px; margin: 0 auto; padding: 64px 24px; }
    h1 { font-size: 2rem; margin: 0 0 8px; }
    p { color: var(--muted); line-height: 1.6; }
    .card { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; padding: 18px 20px; margin-top: 18px; }
    a { color: #c5b5ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .meta { font-size: 12px; color: #6f7890; margin-top: 28px; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
  </style>
</head>
<body>
  <main>
    <h1>AgentSam Lab</h1>
    <p>Separate Worker + repo from <code>inneranimalmedia</code>. This surface ships the WorkGraph timeline prototype and lab packages from <code>SamPrimeaux/agentsam</code> main.</p>
    <div class="card">
      <strong><a href="/prototype-gnantt.html">WorkGraph timeline prototype</a></strong>
      <p style="margin:8px 0 0">Gantt / board / list projections driven by <code>prototype/data/demo-workgraph.js</code>.</p>
    </div>
    <div class="card">
      <strong>Packages on main</strong>
      <p style="margin:8px 0 0"><code>packages/work-graph</code> · <code>packages/financial-*</code> · FinancialOS product scaffold</p>
    </div>
    <p class="meta">Health: <a href="/api/health"><code>/api/health</code></a></p>
  </main>
</body>
</html>
`;

writeFileSync(join(publicDir, 'index.html'), indexHtml);
writeFileSync(
  join(publicDir, '404.html'),
  `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Not found</title></head><body style="font-family:sans-serif;background:#080a10;color:#f5f7ff;padding:48px"><h1>404</h1><p><a href="/" style="color:#c5b5ff">AgentSam Lab home</a></p></body></html>\n`,
);

// Prove sync saw the current gantt title (fail loud if empty).
const gantt = readFileSync(join(publicDir, 'prototype-gnantt.html'), 'utf8');
if (!gantt.includes('demo-workgraph.js')) {
  console.error('prototype-gnantt.html was not WorkGraph-wired');
  process.exit(1);
}

console.log('Synced public/ assets for agentsam Worker deploy');
