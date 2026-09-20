import fs from 'node:fs';
import {validateVisualGrowth, renderVisualGrowth} from '../assets/living-world-visual-growth.mjs';

const baseConfig=JSON.parse(fs.readFileSync(new URL('../data/living-world.json',import.meta.url),'utf8'));
const mainSource=fs.readFileSync(new URL('../assets/living-world.js',import.meta.url),'utf8');
const indexSource=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');

function node(dataset={}){
  const attrs=new Map();
  return {
    dataset:{...dataset},
    textContent:'',
    className:'',
    hidden:false,
    children:[],
    setAttribute(name,value){attrs.set(name,String(value)); if(name==='src') this.src=String(value);},
    getAttribute(name){return attrs.has(name)?attrs.get(name):null;},
    append(child){this.children.push(child);},
    querySelector(selector){
      const match=selector.match(/^\[data-world-visual="([^"]+)"\]$/);
      if(match) return this.children.find(x=>x.dataset?.worldVisual===match[1])||null;
      return null;
    },
    _attrs:attrs
  };
}

function documentMock(){
  const root=node();
  const hero=node();
  const environment=node({worldFallbackSrc:'./assets/modaryx-wolf-dragon-hero.webp'});
  environment.className='modaryx-realm-art';
  environment.setAttribute('src','./assets/modaryx-wolf-dragon-hero.webp');
  const head=node();

  return {
    root,hero,environment,head,
    document:{
      documentElement:root,
      baseURI:'https://modaryx.test/index.html',
      head,
      querySelector(selector){
        if(selector==='[data-world-environment], .modaryx-realm-art') return environment;
        if(selector==='.modaryx-realm-hero') return hero;
        if(selector==='[data-world-visual-layers]') return hero.children.find(x=>x.dataset?.worldVisualLayers==='true')||null;
        if(selector==='link[data-world-visual-growth-style]') return head.children.find(x=>x.dataset?.worldVisualGrowthStyle==='true')||null;
        return null;
      },
      createElement(tag){
        const el=node();
        el.tagName=String(tag).toUpperCase();
        el.alt='';
        el.width=0;
        el.height=0;
        return el;
      }
    }
  };
}

function assert(name,condition){
  if(!condition) throw new Error(name);
}

function awaitingConfig(){
  const config=JSON.parse(JSON.stringify(baseConfig));
  config.visualGrowth.status='awaiting-assets';
  config.visualGrowth.environmentAsset=null;
  for(const slot of config.visualGrowth.slots){
    for(const stageId of config.growthModel.order){
      slot.stages[stageId]=null;
    }
  }
  return config;
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

assert('current visual contract must validate',validateVisualGrowth(baseConfig,'https://modaryx.test/index.html'));
assert('current visual status must be ready',baseConfig.visualGrowth.status==='ready');
assert('current ready contract must declare environment asset',typeof baseConfig.visualGrowth.environmentAsset==='string');
assert('main runtime must lazy-load visual module only for ready status',
  mainSource.includes("config?.visualGrowth?.status === 'ready'") &&
  mainSource.includes("living-world-visual-growth.mjs"));
assert('visual layer markup must not burden current critical HTML',!indexSource.includes('data-world-visual-layers'));

const awaiting=awaitingConfig();
assert('synthetic awaiting contract must validate',validateVisualGrowth(awaiting,'https://modaryx.test/index.html'));
const fallbackDoc=documentMock();
const fallbackResult=await renderVisualGrowth({
  config:awaiting,
  document:fallbackDoc.document,
  root:fallbackDoc.root,
  stages:{wolf:'baby',dragon:'baby'},
  loadImage:async()=>true
});
assert('awaiting-assets must not activate layers',fallbackResult===false&&fallbackDoc.root.dataset.worldVisualGrowth==='awaiting-assets');
assert('fallback composite must remain untouched',fallbackDoc.environment.src==='./assets/modaryx-wolf-dragon-hero.webp');

const ready=readyConfig();
assert('synthetic ready contract must validate',validateVisualGrowth(ready,'https://modaryx.test/index.html'));
const readyDoc=documentMock();
const loaded=[];
const readyResult=await renderVisualGrowth({
  config:ready,
  document:readyDoc.document,
  root:readyDoc.root,
  stages:{wolf:'baby',dragon:'baby'},
  loadImage:async(url)=>{loaded.push(url);return true;}
});
assert('complete ready bundle must activate',readyResult===true&&readyDoc.root.dataset.worldVisualGrowth==='active');
assert('environment must switch atomically',readyDoc.environment.src==='https://modaryx.test/assets/living-world/environment.webp');
const layer=readyDoc.hero.children.find(x=>x.dataset?.worldVisualLayers==='true');
assert('layer container must be created',Boolean(layer));
const wolf=layer.querySelector('[data-world-visual="wolf"]');
const dragon=layer.querySelector('[data-world-visual="dragon"]');
assert('wolf baby layer must activate',wolf&&!wolf.hidden&&wolf.src.endsWith('/assets/living-world/wolf-baby.webp'));
assert('dragon baby layer must activate',dragon&&!dragon.hidden&&dragon.src.endsWith('/assets/living-world/dragon-baby.webp'));
assert('environment and current stages must preload before activation',loaded.length===3);

const juvenileDoc=documentMock();
await renderVisualGrowth({
  config:ready,
  document:juvenileDoc.document,
  root:juvenileDoc.root,
  stages:{wolf:'juvenile',dragon:'juvenile'},
  loadImage:async()=>true
});
const juvenileLayer=juvenileDoc.hero.children.find(x=>x.dataset?.worldVisualLayers==='true');
assert('wolf juvenile mapping',juvenileLayer.querySelector('[data-world-visual="wolf"]').src.endsWith('/assets/living-world/wolf-juvenile.webp'));
assert('dragon juvenile mapping',juvenileLayer.querySelector('[data-world-visual="dragon"]').src.endsWith('/assets/living-world/dragon-juvenile.webp'));

const incomplete=readyConfig();
incomplete.visualGrowth.slots.find(s=>s.inhabitantId==='dragon').stages.baby=null;
assert('ready bundle missing a stage must fail validation',!validateVisualGrowth(incomplete,'https://modaryx.test/index.html'));

const external=readyConfig();
external.visualGrowth.slots.find(s=>s.inhabitantId==='wolf').stages.baby='https://example.com/wolf.webp';
assert('external stage asset must fail validation',!validateVisualGrowth(external,'https://modaryx.test/index.html'));

const failedLoadDoc=documentMock();
const failedLoad=await renderVisualGrowth({
  config:ready,
  document:failedLoadDoc.document,
  root:failedLoadDoc.root,
  stages:{wolf:'baby',dragon:'baby'},
  loadImage:async()=>{throw new Error('missing asset');}
});
assert('asset load failure must preserve fallback',failedLoad===false&&failedLoadDoc.root.dataset.worldVisualGrowth==='fallback');
assert('failed load must keep composite',failedLoadDoc.environment.src==='./assets/modaryx-wolf-dragon-hero.webp');

console.log(JSON.stringify({
  marker:'PASS_TARGETED_LAYERED_GROWTH_CONTRACT',
  current:{status:baseConfig.visualGrowth.status,environment:baseConfig.visualGrowth.environmentAsset,criticalHtmlSlots:false},
  syntheticReady:{active:true,preloaded:loaded.length,wolf:wolf.src,dragon:dragon.src},
  failClosed:true
},null,2));
