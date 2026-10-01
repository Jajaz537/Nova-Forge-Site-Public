import fs from 'node:fs';
import path from 'node:path';
import {webkit} from 'playwright';

const ORIGIN=(process.env.MODARYX_TEST_ORIGIN||'http://127.0.0.1:4182').replace(/\/$/,'');
const OUT=process.env.MODARYX_WEBKIT_OUT||path.join(process.cwd(),'webkit-preflight-output');
const pages=[
  {id:'home',path:'index.html'},
  {id:'catalog',path:'catalog.html'},
  {id:'search',path:'search.html'},
  {id:'creator-studio',path:'creator-studio.html'},
  {id:'community',path:'community.html'},
  {id:'profiles',path:'profiles.html'},
  {id:'ecosystem',path:'ecosystem.html'},
  {id:'documentation',path:'documentation.html'},
  {id:'security',path:'security.html'},
  {id:'verify',path:'verify.html'},
  {id:'downloads',path:'downloads.html'},
  {id:'project',path:'project.html'},
  {id:'project-ember-textures',path:'project-ember-textures.html'},
  {id:'project-balanced-latency-pack',path:'project-balanced-latency-pack.html'},
  {id:'project-forge-night-experience',path:'project-forge-night-experience.html'},
  {id:'games',path:'games/index.html'},
  {id:'gta-6',path:'gta-6/index.html'},
  {id:'gta-6-mods',path:'gta-6/mods/index.html'},
  {id:'gta-6-guides',path:'gta-6/guides/index.html'},
  {id:'rdr2',path:'red-dead-redemption-2/index.html'},
  {id:'rdr2-mods',path:'red-dead-redemption-2/mods/index.html'},
  {id:'rdr2-guides',path:'red-dead-redemption-2/guides/index.html'},
  {id:'404',path:'404.html'}
];
const viewports=[
  {id:'desktop',width:1440,height:1000},
  {id:'mobile',width:390,height:844}
];
const failures=[];
const observations=[];
fs.mkdirSync(OUT,{recursive:true});

const browser=await webkit.launch({headless:true});
try{
  for(const viewport of viewports){
    const context=await browser.newContext({
      viewport:{width:viewport.width,height:viewport.height},
      deviceScaleFactor:1,
      reducedMotion:'reduce',
      serviceWorkers:'block'
    });
    await context.route('**/*',async(route)=>{
      const url=new URL(route.request().url());
      if(url.origin===ORIGIN) return route.continue();
      return route.abort();
    });

    for(const item of pages){
      const page=await context.newPage();
      const pageErrors=[];
      page.on('pageerror',(error)=>pageErrors.push(String(error?.message||error)));
      const response=await page.goto(ORIGIN+'/'+item.path+'?webkit-preflight='+viewport.id,{
        waitUntil:'domcontentloaded',
        timeout:20000
      });
      await page.evaluate(()=>document.fonts?.ready||Promise.resolve());
      await page.waitForTimeout(450);

      const metrics=await page.evaluate(()=>{
        const de=document.documentElement;
        const body=document.body;
        const h1=document.querySelector('h1');
        const hero=document.querySelector('.hero,.catalog-hero,.project-hero,.studio-hero,.profiles-hero,.games-intro,.modaryx-realm-hero,.project-page > .section:first-of-type');
        const footer=document.querySelector('.site-footer');
        const visible=(el)=>{
          if(!el)return false;
          const r=el.getBoundingClientRect();
          const s=getComputedStyle(el);
          return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
        };
        const brokenImages=[...document.images]
          .filter((img)=>img.complete&&img.naturalWidth===0)
          .map((img)=>img.getAttribute('src')||'');
        const clippedControls=[...document.querySelectorAll('a,button,input,select,textarea,summary')]
          .filter((el)=>{
            if(!visible(el)||el.closest('.section-nav'))return false;
            const r=el.getBoundingClientRect();
            return r.right>innerWidth+2||r.left<-2;
          })
          .map((el)=>({
            tag:el.tagName.toLowerCase(),
            text:(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,80),
            left:Math.round(el.getBoundingClientRect().left),
            right:Math.round(el.getBoundingClientRect().right)
          }));
        return {
          title:document.title,
          readyState:document.readyState,
          viewport:{width:innerWidth,height:innerHeight},
          documentWidth:Math.max(de.scrollWidth,body?.scrollWidth||0),
          overflowPx:Math.max(0,Math.max(de.scrollWidth,body?.scrollWidth||0)-de.clientWidth),
          h1Visible:visible(h1),
          heroVisible:visible(hero),
          footerVisible:visible(footer),
          brokenImages,
          clippedControls
        };
      });

      const prefix=item.id+' '+viewport.id;
      if(!response||!response.ok()) failures.push(prefix+': navigation HTTP '+(response?.status()??'none'));
      if(metrics.readyState!=='complete') failures.push(prefix+': document not complete');
      if(Math.abs(metrics.viewport.width-viewport.width)>1) failures.push(prefix+': viewport mismatch '+metrics.viewport.width);
      if(metrics.overflowPx>1) failures.push(prefix+': horizontal overflow '+metrics.overflowPx+'px');
      if(!metrics.h1Visible) failures.push(prefix+': h1 not visible');
      if(!metrics.heroVisible) failures.push(prefix+': opening composition not visible');
      if(!metrics.footerVisible) failures.push(prefix+': footer not visible in layout');
      if(metrics.brokenImages.length) failures.push(prefix+': broken images '+metrics.brokenImages.join(','));
      if(metrics.clippedControls.length) failures.push(prefix+': clipped controls '+JSON.stringify(metrics.clippedControls));
      if(pageErrors.length) failures.push(prefix+': page errors '+pageErrors.join(' | '));

      const screenshot=path.join(OUT,viewport.id+'-'+item.id+'.png');
      await page.screenshot({path:screenshot,fullPage:true,animations:'disabled'});
      observations.push({
        page:item.path,
        viewport:viewport.id,
        httpStatus:response?.status()??null,
        pageErrors,
        ...metrics,
        screenshot:path.basename(screenshot)
      });
      await page.close();
    }
    await context.close();
  }

  const result={
    marker:failures.length?'FAIL_TARGETED_WEBKIT_23_ROUTE_PREFLIGHT':'PASS_TARGETED_WEBKIT_23_ROUTE_PREFLIGHT',
    browser:{engine:'webkit',version:browser.version(),automation:'playwright-1.63.0'},
    pages:pages.length,
    viewports:viewports.map(({id,width,height})=>({id,width,height})),
    observations,
    failures
  };
  fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
  if(failures.length)process.exitCode=1;
}finally{
  await browser.close();
}
