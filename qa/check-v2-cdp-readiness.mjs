import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const chrome=process.env.CHROME_BIN;
if(!chrome) throw new Error("CHROME_BIN missing");

const port=9224;
const proc=spawn(chrome,[
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "--hide-scrollbars",
  "--remote-debugging-port="+port,
  "--user-data-dir=/tmp/modaryx-v2-cdp-readiness-profile",
  "about:blank",
],{stdio:"ignore"});

let exited=null;
proc.on("exit",(code,signal)=>{exited={code,signal};});

async function waitJson(path){
  let last;
  for(let i=0;i<200;i++){
    if(exited) throw new Error("Chrome exited before CDP readiness: "+JSON.stringify(exited));
    try{
      const r=await fetch(`http://127.0.0.1:${port}${path}`);
      if(r.ok) return await r.json();
      last=new Error("HTTP "+r.status);
    }catch(e){last=e;}
    await sleep(100);
  }
  throw last||new Error("CDP unavailable after readiness window");
}

try{
  const version=await waitJson("/json/version");
  const targets=await waitJson("/json/list");
  const page=targets.find(x=>x.type==="page");
  if(!version?.Browser) throw new Error("CDP version missing Browser");
  if(!page?.webSocketDebuggerUrl) throw new Error("CDP page target missing");
  console.log("CDP_BROWSER",version.Browser);
  console.log("CDP_TARGETS",targets.length);
  console.log("PASS_V2_CDP_READINESS");
}finally{
  proc.kill("SIGTERM");
}
