import fs from 'node:fs';
import path from 'node:path';

const key=process.env.OPENAI_API_KEY;
if(!key) throw new Error('OPENAI_API_KEY missing');
const frameDir='visual-proof/frames';
const files=fs.readdirSync(frameDir).filter(x=>/\.jpe?g$/i.test(x)).sort().slice(0,12);
if(!files.length) throw new Error('No evidence frames');

const images=files.map(file=>({
  type:'input_image',
  image_url:'data:image/jpeg;base64,'+fs.readFileSync(path.join(frameDir,file)).toString('base64'),
  detail:'low'
}));

const instructions=`You are MODARYX Visual Forge, a bounded visual QA and CSS correction agent.
MODARYX is the web platform; never rename it Nova Forge.
Evidence is from exact SHA ${process.env.SOURCE_SHA}.
Target: Premium HD, luminous coherent fantasy kingdom, readable product surfaces, desktop+mobile.
Hard constraints:
- fidelity before variation; do not redesign geography/castle/approved realm art;
- preserve living-world behavior;
- no DNS, Cloudflare, main branch, secrets, dependencies, binaries or generated art changes;
- only edit assets/modaryx-canon-vf.css;
- never declare VF/PASS;
- if evidence is ambiguous or already acceptable, return NO_PATCH.
Return either exactly NO_PATCH or a unified git diff affecting ONLY assets/modaryx-canon-vf.css.
Prefer one small correction addressing the strongest clearly visible defect. Do not use markdown fences.`;

const body={
  model:'gpt-5.6',
  input:[{role:'user',content:[
    {type:'input_text',text:instructions},
    ...images
  ]}]
};
const res=await fetch('https://api.openai.com/v1/responses',{
  method:'POST',
  headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
  body:JSON.stringify(body)
});
if(!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0,1000)}`);
const data=await res.json();
const text=(data.output||[]).flatMap(o=>o.content||[]).filter(c=>c.type==='output_text').map(c=>c.text).join('\n').trim();
fs.writeFileSync('visual-proof/agent-report.txt',text+'\n');
if(text==='NO_PATCH') process.exit(0);
if(!text.startsWith('diff --git a/assets/modaryx-canon-vf.css b/assets/modaryx-canon-vf.css')) throw new Error('Agent returned an out-of-scope or invalid patch');
for(const line of text.split('\n')){
  if((line.startsWith('+++ b/')||line.startsWith('--- a/')) && !line.endsWith('assets/modaryx-canon-vf.css')) throw new Error('Patch scope violation');
}
fs.writeFileSync('visual-proof/agent.patch',text+'\n');
