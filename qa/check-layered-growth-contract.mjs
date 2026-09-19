import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../assets/living-world.js',import.meta.url),'utf8');
const baseConfig=JSON.parse(fs.readFileSync(new URL('../data/living-world.json',import.meta.url),'utf8'));

function makeNode(dataset={}){
  const attrs=new Map();
  return {
    dataset:{...dataset},
    textContent:'',
    hidden:false,
    setAttribute(name,value){attrs.set(name,String(value)); if(name==='src') this.src=String(value);},
    getAttribute(name){return attrs.has(name)?attrs.get(name):null;},
    removeAttribute(name){attrs.delete(name); if(name==='src') delete this.src;},
    _attrs:attrs
  };
}

function fixedDateClass(iso){
  return class FixedDate extends Date {
    constructor(value){super(value===undefined?iso:value);}
    static now(){return new Date(iso).getTime();}
  };
}

async function runScenario(config,iso='2026-09-19T12:00:00Z'){
  const root=makeNode();
  const status=makeNode();
  const phase=makeNode();
  const age=makeNode();
  const wolfLabel=makeNode({worldInhabitant:'wolf'});
  const dragonLabel=makeNode({worldInhabitant:'dragon'});
  const wolfNext=makeNode({worldNext:'wolf'});
  const dragonNext=makeNode({worldNext:'dragon'});
  const environment=makeNode({worldFallbackSrc:'./assets/modaryx-wolf-dragon-hero.webp'});
  environment.setAttribute('src','./assets/modaryx-wolf-dragon-hero.webp');
  const wolfVisual=makeNode({worldVisual:'wolf'});
  const dragonVisual=makeNode({worldVisual:'dragon'});
  wolfVisual.hidden=true;
  dragonVisual.hidden=true;

  const document={
    documentElement:root,
    baseURI:'https://modaryx.test/index.html',
    hidden:false,
    querySelector(selector){
      if(selector==='[data-world-status]') return status;
      if(selector==='[data-world-phase]') return phase;
      if(selector==='[data-world-age]') return age;
      if(selector==='[data-world-environment]') return environment;
      return null;
    },
    querySelectorAll(selector){
      if(selector==='[data-world-inhabitant]') return [wolfLabel,dragonLabel];
      if(selector==='[data-world-next]') return [wolfNext,dragonNext];
      if(selector==='[data-world-visual]') return [wolfVisual,dragonVisual];
      return [];
    },
    addEventListener(){}
  };

  const intervals=[];
  const context={
    URL,Map,Set,Number,String,Array,Math,Promise,
    Date:fixedDateClass(iso),
    document,
    fetch:async()=>({
      ok:true,
      headers:{get(){return null;}},
      async json(){return JSON.parse(JSON.stringify(config));}
    }),
    window:{
      setInterval(fn,ms){intervals.push({fn,ms});return intervals.length;},
      clearInterval(){}
    }
  };

  vm.runInNewContext(source,context,{filename:'assets/living-world.js'});
  await new Promise(resolve=>setTimeout(resolve,0));
  await new Promise(resolve=>setTimeout(resolve,0));

  return {root,status,phase,age,wolfLabel,dragonLabel,wolfNext,dragonNext,environment,wolfVisual,dragonVisual,intervals};
}

function assert(name,condition){
  if(!condition) throw new Error(name);
}

function readyConfig(){
  const config=JSON.parse(JSON.stringify(baseConfig));
  config.visualGrowth.status='ready';
  config.visualGrowth.environmentAsset='./assets/living-world/environment.webp';
  for(const slot of config.visualGrowth.slots){
    for(const stageId of config.growthModel.order){
      slot.stages[stageId]=`./assets/living-world/${slot.inhabitantId}-${stageId}.webp`;
    }
  }
  return config;
}

const fallback=await runScenario(baseConfig);
assert('current contract must remain awaiting-assets',fallback.root.dataset.worldVisualGrowth==='awaiting-assets');
assert('fallback composite must remain selected',fallback.environment.src==='./assets/modaryx-wolf-dragon-hero.webp');
assert('wolf layer must remain hidden without art',fallback.wolfVisual.hidden===true&&!fallback.wolfVisual.src);
assert('dragon layer must remain hidden without art',fallback.dragonVisual.hidden===true&&!fallback.dragonVisual.src);
assert('logical wolf stage remains baby',fallback.root.dataset.worldWolfStage==='baby');
assert('logical dragon stage remains baby',fallback.root.dataset.worldDragonStage==='baby');

const ready=await runScenario(readyConfig());
assert('complete bundle must activate',ready.root.dataset.worldVisualGrowth==='active');
assert('environment layer must replace composite',ready.environment.src==='https://modaryx.test/assets/living-world/environment.webp');
assert('wolf baby layer active',ready.wolfVisual.hidden===false&&ready.wolfVisual.src.endsWith('/assets/living-world/wolf-baby.webp'));
assert('dragon baby layer active',ready.dragonVisual.hidden===false&&ready.dragonVisual.src.endsWith('/assets/living-world/dragon-baby.webp'));

const juvenile=await runScenario(readyConfig(),'2026-11-20T12:00:00Z');
assert('wolf must use juvenile visual at day 62',juvenile.wolfVisual.src.endsWith('/assets/living-world/wolf-juvenile.webp'));
assert('dragon must use juvenile visual at day 62',juvenile.dragonVisual.src.endsWith('/assets/living-world/dragon-juvenile.webp'));
assert('wolf logical stage juvenile',juvenile.root.dataset.worldWolfStage==='juvenile');
assert('dragon logical stage juvenile',juvenile.root.dataset.worldDragonStage==='juvenile');

const incomplete=readyConfig();
incomplete.visualGrowth.slots.find(s=>s.inhabitantId==='dragon').stages.baby=null;
const failedClosed=await runScenario(incomplete);
assert('ready bundle with missing stage must fail closed',failedClosed.root.dataset.worldSource==='unavailable');
assert('failed bundle must not activate layers',failedClosed.wolfVisual.hidden===true&&failedClosed.dragonVisual.hidden===true);

const external=readyConfig();
external.visualGrowth.slots.find(s=>s.inhabitantId==='wolf').stages.baby='https://example.com/wolf.webp';
const rejected=await runScenario(external);
assert('external visual asset must be rejected',rejected.root.dataset.worldSource==='unavailable');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_LAYERED_GROWTH_CONTRACT',
  current:{visualState:fallback.root.dataset.worldVisualGrowth,wolf:fallback.root.dataset.worldWolfStage,dragon:fallback.root.dataset.worldDragonStage},
  syntheticReady:{visualState:ready.root.dataset.worldVisualGrowth,environment:ready.environment.src,wolf:ready.wolfVisual.src,dragon:ready.dragonVisual.src},
  juvenile:{wolf:juvenile.wolfVisual.src,dragon:juvenile.dragonVisual.src},
  failClosed:true
},null,2));
