import { mkdir, writeFile } from 'node:fs/promises'; import path from 'node:path';
const id=String(process.argv[2]||''); if(!/^[a-z0-9][a-z0-9-]*$/.test(id)){console.error('Usage: npm run component:new -- <id>');process.exit(2);} const root=process.cwd();
for(const d of ['legacy','candidate','ports','adapters']){const p=path.join(root,'src/lab',id,d);await mkdir(p,{recursive:true});await writeFile(path.join(p,'.gitkeep'),'');}
const f=path.join(root,'fixtures/components',id);await mkdir(f,{recursive:true});await writeFile(path.join(f,'manifest.json'),JSON.stringify({component_id:id,source:{repository:'OWNER/REPO',commit:'PINNED_SHA',paths:['PATH']},compatibility_mode:'exact',observable_outputs:['DEFINE'],promotion:{shadow_mode:'DEFINE',rollback:'DEFINE'}},null,2)+'\n');
console.log(`Created ${id}`);
