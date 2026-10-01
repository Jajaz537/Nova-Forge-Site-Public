// Targeted transaction units extracted from the actual source; not a browser claim.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function unit(file,name){const s=fs.readFileSync(path.join(root,'assets',file),'utf8'); const match=s.match(new RegExp('  function '+name+'\\([^]*?\\n  }'));assert.ok(match,name);return match[0];}
const state={textContent:''};const button={setAttribute(){throw Error('unexpected success')},classList:{toggle(){}},textContent:'Original'};
const c={favorites:new Set(['kept']),saveFavorites:()=>false,stateNode:state,items:[],favoritesOnly:{checked:false},savedViews:[{id:'one',name:'Kept'}],viewSelect:{value:'one'},persistSavedViews:()=>false,viewsStateNode:state,refreshSavedViews(){throw Error('unexpected refresh')}};
vm.createContext(c);vm.runInContext(unit('catalog.js','toggleFavorite')+'\n'+unit('catalog.js','deleteSelectedView'),c);c.toggleFavorite('new',button);assert.deepEqual([...c.favorites],['kept']);assert.match(state.textContent,/non modifié/);c.deleteSelectedView();assert.equal(c.savedViews.length,1);assert.match(state.textContent,/Suppression impossible/);
const p={root:{dataset:{projectId:'new'}},loadFavorites:()=>new Set(),localStorage:{setItem(){throw Error('denied')}},FAVORITES_KEY:'test',state,renderFavorite(){throw Error('unexpected success')}};vm.createContext(p);vm.runInContext(unit('project-hub.js','toggleFavorite'),p);p.toggleFavorite();assert.match(state.textContent,/non modifié/);
console.log(JSON.stringify({status:'PASS',checks:3,scope:'Rejected storage preserves catalog favorite, saved view and project favorite states; source transaction units'},null,2));
