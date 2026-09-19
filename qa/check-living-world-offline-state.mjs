import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../assets/living-world.js', import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../assets/living-world.css', import.meta.url),'utf8');
const config=JSON.parse(fs.readFileSync(new URL('../data/living-world.json', import.meta.url),'utf8'));

class FixedDate extends Date {
  constructor(value){
    super(value === undefined ? '2026-09-19T12:00:00Z' : value);
  }
  static now(){ return new Date('2026-09-19T12:00:00Z').getTime(); }
}

const node=(dataset={})=>({dataset:{...dataset},textContent:''});

async function scenario(mode){
  const root=node();
  const status=node();
  const phase=node();
  const age=node();
  const wolf=node({worldInhabitant:'wolf'});
  const dragon=node({worldInhabitant:'dragon'});
  const wolfNext=node({worldNext:'wolf'});
  const dragonNext=node({worldNext:'dragon'});
  const listeners={};

  const document={
    documentElement:root,
    baseURI:'https://example.test/index.html',
    hidden:false,
    querySelector(selector){
      if(selector==='[data-world-status]') return status;
      if(selector==='[data-world-phase]') return phase;
      if(selector==='[data-world-age]') return age;
      return null;
    },
    querySelectorAll(selector){
      if(selector==='[data-world-inhabitant]') return [wolf,dragon];
      if(selector==='[data-world-next]') return [wolfNext,dragonNext];
      return [];
    },
    addEventListener(type,fn){listeners[type]=fn;}
  };

  const response={
    ok:true,
    headers:{get(name){return String(name).toLowerCase()==='x-modaryx-cache' && mode==='stale' ? 'offline-stale' : null;}},
    async json(){return structuredClone(config);}
  };

  const intervals=[];
  const context={
    URL,Map,Number,String,Array,Math,Promise,
    Date:FixedDate,
    document,
    fetch:async()=>{if(mode==='unavailable') throw new Error('offline-no-cache'); return response;},
    window:{
      setInterval(fn,ms){intervals.push({fn,ms}); return intervals.length;},
      clearInterval(){}
    }
  };

  vm.runInNewContext(source,context,{filename:'assets/living-world.js'});
  await new Promise(resolve=>setTimeout(resolve,0));
  await new Promise(resolve=>setTimeout(resolve,0));

  return {root,status,phase,age,wolf,dragon,wolfNext,dragonNext,intervals};
}

function assert(name,condition){
  if(!condition) throw new Error(name);
}

const fresh=await scenario('fresh');
assert('fresh source state',fresh.root.dataset.worldSource==='fresh'&&fresh.status.dataset.worldSource==='fresh');
assert('fresh ready',fresh.status.dataset.worldReady==='true');
assert('fresh status must not claim offline',!fresh.status.textContent.includes('hors ligne'));
assert('fresh chronology',fresh.age.textContent==='Jour de fondation');
assert('fresh wolf stage',fresh.wolf.textContent==='Louveteau');
assert('fresh dragon stage',fresh.dragon.textContent==='Dragonneau');

const stale=await scenario('stale');
assert('stale source state',stale.root.dataset.worldSource==='offline-stale'&&stale.status.dataset.worldSource==='offline-stale');
assert('stale remains usable',stale.status.dataset.worldReady==='true');
assert('stale status must be explicit',stale.status.textContent.includes('dernière configuration connue hors ligne'));
assert('stale chronology continues from cached rules',stale.age.textContent==='Jour de fondation');
assert('stale wolf stage',stale.wolf.textContent==='Louveteau');
assert('stale dragon stage',stale.dragon.textContent==='Dragonneau');

const unavailable=await scenario('unavailable');
assert('unavailable source state',unavailable.root.dataset.worldSource==='unavailable'&&unavailable.status.dataset.worldSource==='unavailable');
assert('unavailable not ready',unavailable.status.dataset.worldReady==='false');
assert('unavailable message honest',unavailable.status.textContent.includes('momentanément indisponible'));

assert('stale css state present',css.includes('[data-world-source=offline-stale]'));
assert('unavailable css state present',css.includes('[data-world-source=unavailable]'));

console.log(JSON.stringify({
  marker:'PASS_TARGETED_LIVING_WORLD_OFFLINE_STATE',
  fresh:{source:fresh.root.dataset.worldSource,status:fresh.status.textContent},
  stale:{source:stale.root.dataset.worldSource,status:stale.status.textContent,wolf:stale.wolf.textContent,dragon:stale.dragon.textContent},
  unavailable:{source:unavailable.root.dataset.worldSource,status:unavailable.status.textContent}
},null,2));
