// Focused tests of the actual export handlers, not a browser download certificate.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const studio=fs.readFileSync(path.join(root,'assets/creator-studio.js'),'utf8');
const community=fs.readFileSync(path.join(root,'assets/community.js'),'utf8');
const studioCode=studio.slice(studio.indexOf('  downloadButton.addEventListener'),studio.indexOf('  form.addEventListener',studio.indexOf('  downloadButton.addEventListener')));
const communityCode=community.slice(community.indexOf('  function downloadJson'),community.indexOf('  function buildCollection'));
const checks=[];
for(const surface of ['studio','community']) for(const failure of ['none','create','click']) {
 const calls=[],timers=[];let handler;
 const draft={content:{id:'test-export'},distribution:{state:'locked',downloadable:false}};
 const original=JSON.stringify(draft);
 const context={Blob,canonicalText:JSON.stringify,requireValidDraft:()=>draft,read:()=> 'test-export',status:{textContent:''},downloadButton:{addEventListener:(_,fn)=>handler=fn},setTimeout:fn=>timers.push(fn),URL:{createObjectURL:()=>{if(failure==='create')throw Error('create blocked');return 'blob:local-test'},revokeObjectURL:u=>calls.push('revoke:'+u)},document:{body:{append:()=>calls.push('append')},createElement:()=>({click:()=>{calls.push('click');if(failure==='click')throw Error('click blocked')},remove:()=>calls.push('remove')})}};
 vm.createContext(context);vm.runInContext(surface==='studio'?studioCode:communityCode,context);
 const action=surface==='studio'?()=>handler():()=>context.downloadJson(draft,'test-export.json');
 if(surface==='community'&&failure!=='none')assert.throws(action);else action();
 assert.equal(JSON.stringify(draft),original,'Export must never mutate draft');
 assert.equal(calls.some(x=>x.startsWith('revoke:')),false,'URL remains alive during click');
 if(failure!=='create'){
  assert.equal(calls[0],'append');assert.ok(calls.includes('remove'));assert.equal(timers.length,1);timers[0]();assert.equal(calls.at(-1),'revoke:blob:local-test');
 }else assert.equal(timers.length,0);
 if(surface==='studio')assert.match(context.status.textContent,failure==='none'?/Vérifiez les téléchargements/:/Export impossible/);
 checks.push(`${surface}: ${failure==='none'?'handoff and deferred cleanup':failure+' failure, retained draft and cleanup'}`);
}
const report={status:'PASS',scope:'Six source-handler Node simulations; browser delivery and filesystem receipt not certified',checks};
fs.writeFileSync(path.join(__dirname,'export-checks.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
