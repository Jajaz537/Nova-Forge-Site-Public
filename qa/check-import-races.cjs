const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../assets/community.js'),'utf8');
class Element {
 constructor(){this.value='';this.type='text';this.children=[];this.files=[];this.events={};this.textContent='';}
 addEventListener(n,f){(this.events[n]??=[]).push(f)}
 async fire(n,event={target:this}){for(const f of this.events[n]||[])await f(event)}
 append(...x){this.children.push(...x)} replaceChildren(...x){this.children=x}
 removeAttribute(){} setAttribute(){} focus(){}
}
async function setup(){
 const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id)};
 const context={console,document:{querySelector:get,createElement:()=>new Element()},localStorage:{getItem:()=>null,removeItem(){},setItem(){}},fetch:async()=>({ok:true,json:async()=>({schemaVersion:1,dataClass:'demonstration',items:[{public:true,id:'demo',name:'Demo',game:{name:'Game'}}]})})};
 vm.runInNewContext(source,context);await new Promise(r=>setImmediate(r));return get;
}
const fixtures={collection:{schemaVersion:1,id:'imported',name:'Imported',description:'',syncState:'local-only',visibility:'private-local',ownerProfileId:null,itemIds:[]},submission:{schemaVersion:1,id:'imported',kind:'discussion',authorProfileId:null,syncState:'local-only',publicationState:'local-draft',moderationState:'not-submitted',targetId:'demo',body:'Imported body',title:'Imported title'}};
(async()=>{const checks=[];
 for(const kind of ['collection','submission']){
  for(const action of ['edit','file-change','clear','newer-import','invalid-json']){
   const get=await setup(),field=get(kind==='collection'?'#collection-name':'#submission-body'),form=get('#'+kind+'-form'),picker=get('#'+kind+'-import-file'),button=get('#'+kind+'-import');
   field.value='Initial';let finish;picker.files=[{text:()=>new Promise(r=>finish=r)}];const pending=button.fire('click');
   if(action==='edit'){field.value='Recent';await form.fire('input',{target:field});}
   if(action==='file-change')await picker.fire('change');
   if(action==='clear')await get('#'+kind+'-clear').fire('click');
   if(action==='newer-import'){picker.files=[{text:async()=>JSON.stringify({...fixtures[kind],name:'Newest',body:'Newest'})}];await button.fire('click');assert.equal(field.value,'Newest');}
   const expected=field.value;
   finish(action==='invalid-json'?'{broken':JSON.stringify(fixtures[kind]));await pending;
   assert.equal(field.value,expected,kind+' '+action+' preserves newer form');
   if(action==='invalid-json')assert.match(get('#'+kind+'-status').textContent,/Import bloqué/);
   checks.push(kind+': '+action+' preserves correct draft');
  }
 }
 const report={scope:'Node VM with deferred file reads; no native file-picker or screen-reader proof',checks};fs.writeFileSync(path.join(__dirname,'import-race-checks.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
