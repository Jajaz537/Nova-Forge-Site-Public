import fs from 'node:fs';
import path from 'node:path';

const configPath='data/living-world.json';
const config=JSON.parse(fs.readFileSync(configPath,'utf8'));
const visual=config.visualGrowth;
const failures=[];
const notes=[];

function fail(message){failures.push(message);}
function assert(condition,message){if(!condition)fail(message);}

function safeRepoPath(value){
  if(typeof value!=='string'||!value.startsWith('./assets/living-world/')) return null;
  const resolved=path.normalize(value.slice(2));
  if(resolved.startsWith('..')||path.isAbsolute(resolved)) return null;
  return resolved;
}

function pngInfo(buffer){
  if(buffer.length<33||buffer.toString('hex',0,8)!=='89504e470d0a1a0a') return null;
  const width=buffer.readUInt32BE(16);
  const height=buffer.readUInt32BE(20);
  const colorType=buffer[25];
  return {format:'png',width,height,alpha:colorType===4||colorType===6};
}

function read24le(buffer,offset){
  return buffer[offset]|(buffer[offset+1]<<8)|(buffer[offset+2]<<16);
}

function webpInfo(buffer){
  if(buffer.length<30||buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WEBP') return null;
  let offset=12;
  while(offset+8<=buffer.length){
    const type=buffer.toString('ascii',offset,offset+4);
    const size=buffer.readUInt32LE(offset+4);
    const data=offset+8;
    if(type==='VP8X'&&data+10<=buffer.length){
      return {
        format:'webp',
        width:1+read24le(buffer,data+4),
        height:1+read24le(buffer,data+7),
        alpha:Boolean(buffer[data]&0x10)
      };
    }
    if(type==='VP8L'&&data+5<=buffer.length&&buffer[data]===0x2f){
      const bits=buffer.readUInt32LE(data+1);
      return {
        format:'webp',
        width:1+(bits&0x3fff),
        height:1+((bits>>14)&0x3fff),
        alpha:true
      };
    }
    if(type==='VP8 '&&data+10<=buffer.length&&buffer[data+3]===0x9d&&buffer[data+4]===0x01&&buffer[data+5]===0x2a){
      return {
        format:'webp',
        width:buffer.readUInt16LE(data+6)&0x3fff,
        height:buffer.readUInt16LE(data+8)&0x3fff,
        alpha:false
      };
    }
    offset=data+size+(size%2);
  }
  return null;
}

function imageInfo(file){
  const buffer=fs.readFileSync(file);
  return pngInfo(buffer)||webpInfo(buffer);
}

assert(config.schemaVersion===1,'living-world schemaVersion must remain 1');
assert(visual?.model==='layered-stage-assets-v1','visual growth model mismatch');
assert(['awaiting-assets','ready'].includes(visual?.status),'visual growth status invalid');
assert(visual?.activation==='atomic-current-stage','visual activation must remain atomic-current-stage');
assert(visual?.assetPolicy?.allowedPrefix==='./assets/living-world/','visual asset prefix drifted');
assert(visual?.assetPolicy?.loading==='current-stage-only','visual loading policy drifted');
assert(visual?.assetPolicy?.cache==='runtime-on-demand','visual cache policy drifted');
assert(Number.isInteger(visual?.canvas?.width)&&Number.isInteger(visual?.canvas?.height),'visual canvas invalid');

const order=config.growthModel?.order||[];
const slots=visual?.slots||[];
assert(order.join('|')==='baby|juvenile|adolescent|young-adult|adult','canonical growth order drifted');
assert(slots.length===(config.inhabitants||[]).length,'visual slot count must match inhabitants');

const refs=[];
if(visual?.environmentAsset!==null) refs.push({kind:'environment',value:visual.environmentAsset});
for(const slot of slots){
  assert((config.inhabitants||[]).some(x=>x.id===slot.inhabitantId),`unknown visual inhabitant ${slot.inhabitantId}`);
  assert(Object.keys(slot.stages||{}).join('|')===order.join('|'),`${slot.inhabitantId}: stage keys drifted`);
  for(const stageId of order){
    const value=slot.stages?.[stageId];
    if(value!==null) refs.push({kind:'layer',inhabitantId:slot.inhabitantId,stageId,value});
  }
}

if(visual.status==='awaiting-assets'){
  assert(visual.environmentAsset===null,'awaiting-assets must not claim an environment asset');
  for(const slot of slots){
    for(const stageId of order){
      assert(slot.stages?.[stageId]===null,`awaiting-assets must keep ${slot.inhabitantId}/${stageId} null`);
    }
  }
  const assetDir='assets/living-world';
  const existing=fs.existsSync(assetDir)
    ? fs.readdirSync(assetDir,{withFileTypes:true}).filter(x=>x.isFile()).map(x=>x.name)
    : [];
  notes.push({status:'awaiting-assets',existingUnreferencedFiles:existing});
}else{
  assert(typeof visual.environmentAsset==='string','ready status requires environment asset');
  for(const slot of slots){
    for(const stageId of order){
      assert(typeof slot.stages?.[stageId]==='string',`ready status requires ${slot.inhabitantId}/${stageId}`);
    }
  }

  for(const ref of refs){
    const file=safeRepoPath(ref.value);
    assert(Boolean(file),`unsafe asset path: ${ref.value}`);
    if(!file) continue;
    assert(fs.existsSync(file),`missing asset file: ${file}`);
    if(!fs.existsSync(file)) continue;
    const info=imageInfo(file);
    assert(Boolean(info),`unsupported or malformed image: ${file}`);
    if(!info) continue;
    assert(info.width===visual.canvas.width&&info.height===visual.canvas.height,
      `${file}: expected ${visual.canvas.width}x${visual.canvas.height}, got ${info.width}x${info.height}`);
    if(ref.kind==='layer') assert(info.alpha===true,`${file}: companion layer must preserve alpha transparency`);
    notes.push({...ref,file,info});
  }

  const unique=new Set(refs.map(x=>x.value));
  assert(unique.size===refs.length,'visual asset paths must be unique');
}

console.log(JSON.stringify({
  marker:failures.length
    ? 'FAIL_TARGETED_LAYERED_ASSET_GATE'
    : visual.status==='ready'
      ? 'PASS_TARGETED_LAYERED_ASSET_GATE_READY'
      : 'PASS_TARGETED_LAYERED_ASSET_GATE_AWAITING',
  status:visual.status,
  canvas:visual.canvas,
  references:refs.length,
  notes,
  failures
},null,2));

if(failures.length) process.exitCode=1;
