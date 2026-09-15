const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'assets/project-hub.js'),'utf8');
const unit=source.match(/  function renderProject\([^]*?\n  }/)[0];
const item=JSON.parse(fs.readFileSync(path.join(root,'data/catalog.json'),'utf8')).items[0];
const graph=JSON.parse(fs.readFileSync(path.join(root,'data/compatibility-graph.json'),'utf8'));
function fixture(failCard=false){const nodes={};const context={root:{dataset:{projectId:item.id}},state:{},node:id=>(nodes[id]??={textContent:'static'}),labels:{},relationsRoot:{children:['static relation'],replaceChildren(...x){this.children=x}},relationsEmpty:{hidden:false},renderFavorite(){},document:{title:'Static title'},relationCard(){if(failCard)throw Error('card failure');return {prepared:true}}};vm.createContext(context);vm.runInContext(unit,context);return {context,nodes};}
const checks=[];
for(const bad of [{nodes:null,edges:[]},{nodes:[null],edges:[]},{nodes:[],edges:[null]},{nodes:[],edges:[{from:'a',to:'b'}]}]){const f=fixture();assert.throws(()=>f.context.renderProject(item,bad));assert.deepEqual(f.nodes,{});assert.deepEqual(f.context.relationsRoot.children,['static relation']);assert.equal(f.context.document.title,'Static title');}
checks.push('Four malformed graph variants cannot partially overwrite static project fields');
let f=fixture(true);assert.throws(()=>f.context.renderProject(item,graph));assert.deepEqual(f.nodes,{});assert.deepEqual(f.context.relationsRoot.children,['static relation']);
checks.push('Relation preparation failure preserves visible fields and previous relations');
f=fixture();f.context.renderProject(item,graph);assert.equal(f.nodes['project-title'].textContent,item.name);assert.equal(f.context.relationsRoot.children.length,2);
checks.push('Actual project data replaces fields and its two prepared relations');
f=fixture();assert.throws(()=>f.context.renderProject({...item,name:''},graph));assert.deepEqual(f.nodes,{});
checks.push('Missing project title cannot erase static content');
const report={result:'PASS',scope:'Four grouped source Node VM scenarios; not native browser proof',checks};fs.writeFileSync(path.join(__dirname,'project-render-checks.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
