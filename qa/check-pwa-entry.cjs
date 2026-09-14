const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'assets/shell.js'),'utf8');
const entry=source.slice(0,source.indexOf('\n\n(() =>'));
const pages=fs.readdirSync(root).filter(n=>n.endsWith('.html')&&!['review.html','comparison.html'].includes(n));
assert.equal(pages.length,16);
for(const page of pages){const html=fs.readFileSync(path.join(root,page),'utf8');assert.equal((html.match(/src="\.\/assets\/shell\.js"/g)||[]).length,1,page);}
assert.ok(!fs.readFileSync(path.join(root,'assets/app.js'),'utf8').includes('serviceWorker.register'));
const checks=['All 16 public pages load the shared entry exactly once; no duplicate registration in app.js'];
async function scenario(name,options={},expected=1){
 const calls=[];const context={URL,window:{isSecureContext:options.secure!==false},location:{origin:'https://modaryx.test'},document:{currentScript:options.noScript?null:{src:options.src||'https://modaryx.test/assets/shell.js'}},navigator:options.unsupported?{}:{serviceWorker:{register:(url,opts)=>{calls.push({url:url.href,...opts});if(options.syncFail)throw Error('blocked');return options.reject?Promise.reject(Error('refused')):Promise.resolve({});}}}};
 await vm.runInNewContext(entry,context);assert.equal(calls.length,expected,name);
 if(expected){assert.equal(calls[0].url,options.worker||'https://modaryx.test/sw.js');assert.equal(calls[0].scope,options.scope||'https://modaryx.test/');assert.equal(calls[0].updateViaCache,'none');}
 checks.push(name);
}
(async()=>{
 await scenario('HTTPS page without a navigation element still registers');
 await scenario('Subdirectory deployment uses shell location, not document URL',{src:'https://modaryx.test/preview/assets/shell.js',worker:'https://modaryx.test/preview/sw.js',scope:'https://modaryx.test/preview/'});
 await scenario('Insecure context skipped',{secure:false},0);
 await scenario('Unsupported browser skipped',{unsupported:true},0);
 await scenario('Missing script URL skipped',{noScript:true},0);
 await scenario('Foreign script origin skipped',{src:'https://other.test/assets/shell.js'},0);
 await scenario('Registration promise rejection contained',{reject:true});
 await scenario('Synchronous registration failure contained',{syncFail:true});
 const report={status:'PASS',scope:'Nine structural and Node VM checks; not native PWA installation/offline proof',checks};fs.writeFileSync(path.join(__dirname,'pwa-entry-checks.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
