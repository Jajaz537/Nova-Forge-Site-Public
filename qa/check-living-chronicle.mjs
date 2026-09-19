import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../assets/living-world.js',import.meta.url),'utf8');
const config=JSON.parse(fs.readFileSync(new URL('../data/living-world.json',import.meta.url),'utf8'));

function node(dataset={}){return {dataset:{...dataset},textContent:''};}
function fixedDate(iso){
  return class FixedDate extends Date{
    constructor(value){super(value===undefined?iso:value);}
    static now(){return new Date(iso).getTime();}
  };
}
async function run(iso){
  const root=node(),status=node(),phase=node(),age=node(),chronicle=node();
  const wolf=node({worldInhabitant:'wolf'}),dragon=node({worldInhabitant:'dragon'});
  const wolfNext=node({worldNext:'wolf'}),dragonNext=node({worldNext:'dragon'});
  const doc={
    documentElement:root,baseURI:'https://modaryx.test/index.html',hidden:false,
    querySelector(selector){
      if(selector==='[data-world-status]')return status;
      if(selector==='[data-world-phase]')return phase;
      if(selector==='[data-world-age]')return age;
      if(selector==='[data-world-chronicle]')return chronicle;
      return null;
    },
    querySelectorAll(selector){
      if(selector==='[data-world-inhabitant]')return [wolf,dragon];
      if(selector==='[data-world-next]')return [wolfNext,dragonNext];
      return [];
    },
    addEventListener(){}
  };
  const intervals=[];
  const context={
    URL,Map,Number,String,Array,Math,Promise,
    Date:fixedDate(iso),document:doc,
    fetch:async()=>({ok:true,headers:{get(){return null;}},async json(){return JSON.parse(JSON.stringify(config));}}),
    window:{setInterval(fn,ms){intervals.push({fn,ms});return intervals.length;},clearInterval(){}}
  };
  vm.runInNewContext(source,context,{filename:'assets/living-world.js'});
  await new Promise(r=>setTimeout(r,0));
  await new Promise(r=>setTimeout(r,0));
  return {root,status,phase,age,chronicle,wolf,dragon};
}
function assert(name,condition){if(!condition)throw new Error(name);}

const dawn=await run('2026-09-19T06:00:00Z');
const day=await run('2026-09-19T12:00:00Z');
const dayAgain=await run('2026-09-19T12:59:00Z');
const dusk=await run('2026-09-19T19:00:00Z');
const night=await run('2026-09-19T23:00:00Z');

for(const [label,state,phase] of [['dawn',dawn,'dawn'],['day',day,'day'],['dusk',dusk,'dusk'],['night',night,'night']]){
  assert(label+' phase',state.root.dataset.worldPhase===phase);
  assert(label+' signal id',typeof state.root.dataset.worldSignal==='string'&&state.root.dataset.worldSignal.length>0);
  assert(label+' signal text',state.chronicle.textContent.length>20);
  assert(label+' signal mirrored',state.chronicle.dataset.worldSignal===state.root.dataset.worldSignal);
}
assert('same cadence slot must stay deterministic',
  day.root.dataset.worldSignal===dayAgain.root.dataset.worldSignal &&
  day.chronicle.textContent===dayAgain.chronicle.textContent);
assert('signals remain separate from logical growth',
  dawn.root.dataset.worldWolfStage==='baby'&&dawn.root.dataset.worldDragonStage==='baby');

const entries=config.ambientSignals?.entries||[];
assert('ambient signal model',config.ambientSignals?.model==='shared-world-cycle-v1');
assert('ambient signal cadence',Number.isInteger(config.ambientSignals?.cadenceHours)&&config.ambientSignals.cadenceHours>=1);
assert('ambient signal ids unique',new Set(entries.map(x=>x.id)).size===entries.length);
for(const phaseId of ['dawn','day','dusk','night']){
  assert('phase '+phaseId+' must have signal',entries.some(x=>x.phases?.includes(phaseId)));
}

console.log(JSON.stringify({
  marker:'PASS_TARGETED_LIVING_CHRONICLE',
  signals:{
    dawn:{id:dawn.root.dataset.worldSignal,text:dawn.chronicle.textContent},
    day:{id:day.root.dataset.worldSignal,text:day.chronicle.textContent},
    dusk:{id:dusk.root.dataset.worldSignal,text:dusk.chronicle.textContent},
    night:{id:night.root.dataset.worldSignal,text:night.chronicle.textContent}
  },
  deterministicWithinCadence:true,
  growthUnaffected:true
},null,2));
