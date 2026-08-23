import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function sourceFiles(dir) {
  return walk(path.join(root, dir)).filter((f) => /\.(?:[cm]?[jt]sx?)$/.test(f));
}

for (const file of sourceFiles('packages/client-core')) {
  const text = fs.readFileSync(file, 'utf8');
  if (/from\s+['"][^'"]*(?:dashboard|mobile)\//.test(text)) {
    failures.push(`client-core reverse dependency: ${path.relative(root, file)}`);
  }
}
for (const file of sourceFiles('app/mobile')) {
  const text = fs.readFileSync(file, 'utf8');
  if (/from\s+['"][^'"]*dashboard\//.test(text)) {
    failures.push(`mobile imports dashboard: ${path.relative(root, file)}`);
  }
}
if (!fs.existsSync(path.join(root, 'app', 'mobile', 'src', 'app', 'MobileApp.tsx'))) {
  failures.push('app/mobile vertical slice missing');
}
if (!fs.existsSync(path.join(root, 'packages', 'client-core', 'src', 'agent', 'client.ts'))) {
  failures.push('shared Agent Sam client missing');
}

if (failures.length) {
  console.error('[guard-mobile-lane] FAIL');
  failures.forEach((x) => console.error(`- ${x}`));
  process.exit(1);
}
console.log('[guard-mobile-lane] PASS — lab mobile surface + vendored client-core');
