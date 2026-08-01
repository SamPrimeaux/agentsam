import { readdir, readFile } from 'node:fs/promises'; import path from 'node:path';
const base=path.join(process.cwd(),'fixtures/components'); const dirs=(await readdir(base,{withFileTypes:true})).filter(x=>x.isDirectory()); let bad=false;
for(const d of dirs){const p=path.join(base,d.name,'manifest.json'); const m=JSON.parse(await readFile(p,'utf8')); for(const k of ['component_id','source','compatibility_mode','observable_outputs','promotion']) if(m[k]==null){console.error(`${p}: missing ${k}`);bad=true;} if(m.component_id!==d.name){console.error(`${p}: id mismatch`);bad=true;}}
if(bad)process.exit(1); console.log(`Validated ${dirs.length} manifest(s).`);
