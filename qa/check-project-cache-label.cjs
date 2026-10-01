const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../assets/project-hub.js'),'utf8');
const unit=name=>source.match(new RegExp('  (?:async )?function '+name+'\\([^]*?\\n  }'))[0];
(async()=>{
 const checks=[];
 for(const cached of ['none','catalog','graph']){
  const notes=[];const state={insertAdjacentElement:(where,node)=>notes.push(node)};
  const context={CATALOG_URL:'catalog',GRAPH_URL:'graph',requestedId:()=> 'demo',root:{dataset:{projectId:'demo'}},state,renderProject(){state.textContent='Loaded'},renderFavorite(){},document:{createElement:()=>({})},navigator:{onLine:true},fetch:async url=>({ok:true,headers:{get:()=>url===cached?'offline-stale':null},json:async()=>({schemaVersion:1,items:[{id:'demo',public:true}]})}),loadFavorites:()=>new Set(),localStorage:{setItem(){}},FAVORITES_KEY:'test'};
  vm.createContext(context);vm.runInContext(unit('hydrate')+'\n'+unit('toggleFavorite'),context);await context.hydrate();
  assert.equal(notes.length,cached==='none'?0:1);context.toggleFavorite();
  if(cached!=='none')assert.match(notes[0].textContent,/Copie en cache/);
  checks.push(cached==='none'?'Network-only data has no cache notice':cached+' cache notice survives a favorite action');
 }
 const report={result:'PASS',scope:'Three Node VM source scenarios; not native offline proof',checks};fs.writeFileSync(path.join(__dirname,'project-cache-label-checks.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
