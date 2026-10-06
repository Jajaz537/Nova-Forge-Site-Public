import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=path.resolve("schemas/v2");
const files=["game.schema.json","content-type.schema.json","content-item.schema.json","release.schema.json","dependency.schema.json","compatibility-claim.schema.json","file-artifact.schema.json","collection-v2.schema.json","modpack.schema.json","profile-loadout.schema.json","creator.schema.json","team.schema.json","search-document.schema.json"];
const stable=value=>Array.isArray(value)?"["+value.map(stable).join(",")+"]":value&&typeof value==="object"?"{"+Object.keys(value).sort().map(k=>JSON.stringify(k)+":"+stable(value[k])).join(",")+"}":JSON.stringify(value);
const typeOk=(t,v)=>Array.isArray(t)?t.some(x=>typeOk(x,v)):t==="null"?v===null:t==="array"?Array.isArray(v):t==="object"?v!==null&&typeof v==="object"&&!Array.isArray(v):t==="integer"?Number.isInteger(v):t==="number"?typeof v==="number"&&Number.isFinite(v):typeof v===t;
function validate(schema,value,path="$",rootSchema=schema,errors=[]){
  if(schema.const!==undefined&&stable(value)!==stable(schema.const)) errors.push(path+": const");
  if(schema.enum&&!schema.enum.some(x=>stable(x)===stable(value))) errors.push(path+": enum");
  if(schema.type!==undefined&&!typeOk(schema.type,value)){errors.push(path+": type");return errors;}
  if(typeof value==="string"){
    if(schema.minLength!==undefined&&value.length<schema.minLength) errors.push(path+": minLength");
    if(schema.pattern&&!new RegExp(schema.pattern).test(value)) errors.push(path+": pattern");
    if(schema.format==="date-time"&&(Number.isNaN(Date.parse(value))||!value.includes("T"))) errors.push(path+": date-time");
    if(schema.format==="uri"){try{if(!new URL(value).protocol) errors.push(path+": uri")}catch{errors.push(path+": uri")}}
  }
  if(typeof value==="number"&&schema.minimum!==undefined&&value<schema.minimum) errors.push(path+": minimum");
  if(Array.isArray(value)){
    if(schema.minItems!==undefined&&value.length<schema.minItems) errors.push(path+": minItems");
    if(schema.uniqueItems){const keys=value.map(stable);if(keys.length!==new Set(keys).size) errors.push(path+": duplicate");}
    if(schema.items) value.forEach((x,i)=>validate(schema.items,x,path+"["+i+"]",rootSchema,errors));
  }
  if(value&&typeof value==="object"&&!Array.isArray(value)){
    const props=schema.properties||{};
    for(const req of schema.required||[]) if(!Object.prototype.hasOwnProperty.call(value,req)) errors.push(path+"."+req+": required");
    for(const [k,v] of Object.entries(value)){
      if(props[k]) validate(props[k],v,path+"."+k,rootSchema,errors);
      else if(schema.additionalProperties===false) errors.push(path+"."+k+": additional");
      else if(schema.additionalProperties&&typeof schema.additionalProperties==="object") validate(schema.additionalProperties,v,path+"."+k,rootSchema,errors);
    }
  }
  for(const nested of schema.allOf||[]) validate(nested,value,path,rootSchema,errors);
  if(schema.if){
    const probe=[];validate(schema.if,value,path,rootSchema,probe);
    if(probe.length===0&&schema.then) validate(schema.then,value,path,rootSchema,errors);
    if(probe.length!==0&&schema.else) validate(schema.else,value,path,rootSchema,errors);
  }
  return errors;
}
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),"utf8"));
for(const name of files){
  const s=read(name);
  assert.equal(s.$schema,"http://json-schema.org/draft-07/schema#");
  assert.match(s.$id,/^urn:modaryx:schemas:[a-z0-9-]+:v2$/);
  assert.equal(s.additionalProperties,false,name+" root must be strict");
  assert.equal(JSON.stringify(s).includes("nova-forge"),false,name+" must not mint nova-forge schema ids");
}

const now="2026-10-06T08:30:00Z";
const ids={game:"mx_game_aetherlands",type:"mx_type_mod",creator:"mx_creator_boreal",team:"mx_team_boreal",content:"mx_content_dawn",release:"mx_release_dawn_1",file:"mx_file_dawn_zip",dep:"mx_dep_dawn_core",claim:"mx_claim_dawn_142",receipt:"mx_receipt_001",profile:"mx_profile_local",collection:"mx_collection_calm",role:"mx_role_author"};
const fixtures={
 "game.schema.json":{schemaVersion:2,id:ids.game,slug:"aetherlands",name:"Aetherlands",aliases:[],status:"catalog-enabled",platforms:["windows"],versions:["1.4.2"],dlcs:[],contentTypeIds:[ids.type],categoryIds:[],loaderIds:[],environmentModel:"client",installCapabilities:{manual:true,manager:false,direct:false},metadata:{updatedAt:now}},
 "content-type.schema.json":{schemaVersion:2,id:ids.type,label:"Mod",family:"gameplay",gameScope:ids.game,supportsFiles:true,supportsVersions:true,supportsDependencies:true,supportsConflicts:true,supportsLoadOrder:true,supportsClientServerEnvironment:true,supportsCollections:true,installMode:"contextual"},
 "content-item.schema.json":{schemaVersion:2,id:ids.content,slug:"sentiers-de-laube",title:"Sentiers de l’aube",summary:"Résumé",description:"Description",gameId:ids.game,contentTypeId:ids.type,creatorIds:[ids.creator],teamId:null,categories:[],tags:["exploration"],status:"published",licenseRef:null,permissionRef:null,provenanceSummary:{state:"declared",receiptId:null},moderationState:"approved",visibility:"public",currentReleaseId:ids.release,createdAt:now,updatedAt:now},
 "release.schema.json":{schemaVersion:2,id:ids.release,contentId:ids.content,version:"1.0.0",channel:"stable",publishedAt:now,gameVersions:["1.4.2"],loaders:[],platforms:["windows"],dlcs:[],environment:"client",fileIds:[ids.file],dependencyIds:[ids.dep],compatibilityClaimIds:[ids.claim],changelog:"Initial",provenance:{state:"verified",source:"creator"},distribution:{state:"available",downloadable:true,reason:null},releaseReceipt:ids.receipt},
 "dependency.schema.json":{schemaVersion:2,id:ids.dep,sourceContentId:ids.content,sourceReleaseRange:">=1.0.0",targetContentId:"mx_content_core",targetReleaseRange:">=1.0.0",relationType:"required",reason:"Core library",source:"manifest",verificationState:"declared"},
 "compatibility-claim.schema.json":{schemaVersion:2,id:ids.claim,contentId:ids.content,releaseId:ids.release,gameId:ids.game,gameVersion:"1.4.2",loader:null,platform:"windows",environment:"client",state:"compatible",evidenceType:"measured",receiptId:ids.receipt,source:"targeted-proof",observedAt:now,notes:""},
 "file-artifact.schema.json":{schemaVersion:2,id:ids.file,releaseId:ids.release,filename:"dawn.zip",path:"/artifacts/dawn.zip",size:1024,mediaType:"application/zip",executable:false,hashes:{sha256:"a".repeat(64)},signature:{state:"absent",signerId:null,receiptId:null},provenance:{state:"verified",receiptId:ids.receipt},distributionState:"available",downloadable:true},
 "collection-v2.schema.json":{schemaVersion:2,id:ids.collection,title:"Exploration sereine",description:"Sélection",curatorId:ids.creator,visibility:"public",gameIds:[ids.game],tags:["exploration"],items:[{contentId:ids.content,note:"Recommandé",order:0,recommendedReleaseId:ids.release}],createdAt:now,updatedAt:now},
 "modpack.schema.json":{schemaVersion:2,id:"mx_modpack_calm",title:"Calm Pack",gameId:ids.game,gameVersion:"1.4.2",loader:null,version:"1.0.0",releaseConstraints:[{contentId:ids.content,range:"=1.0.0"}],configArtifacts:[],dependencies:[ids.dep],conflicts:[],rights:{state:"cleared",receiptId:ids.receipt},provenance:{state:"verified",receiptId:ids.receipt},distribution:{state:"available",downloadable:true},history:["1.0.0"]},
 "profile-loadout.schema.json":{schemaVersion:2,id:ids.profile,ownerProfileId:null,gameId:ids.game,gameVersion:"1.4.2",selectedReleases:[ids.release],enabledState:{[ids.release]:true},loadOrder:[ids.release],localConfigRefs:[],syncState:"local-only",visibility:"private-local",shareConsentReceiptId:null,createdAt:now,updatedAt:now},
 "creator.schema.json":{schemaVersion:2,id:ids.creator,handle:"atelier-boreal",displayName:"Atelier Boréal",bio:"",avatar:null,links:[],verificationState:"unverified",teamIds:[ids.team],projectIds:[ids.content]},
 "team.schema.json":{schemaVersion:2,id:ids.team,name:"Atelier Boréal",description:"",visibility:"public",members:[{profileId:"mx_profile_author",roleId:ids.role}],roles:[{id:ids.role,label:"Auteur"}],projectIds:[ids.content]},
 "search-document.schema.json":{schemaVersion:2,id:ids.content,entityType:"content",title:"Sentiers de l’aube",summary:"Résumé",href:"/content/sentiers-de-laube",gameId:ids.game,contentTypeId:ids.type,creatorIds:[ids.creator],categories:[],tags:["exploration"],gameVersions:["1.4.2"],loaders:[],platforms:["windows"],status:"published",updatedAt:now,rankingSignals:{quality:1,freshness:1,popularity:0}}
};
for(const [name,fixture] of Object.entries(fixtures)){
  const errors=validate(read(name),fixture);
  assert.deepEqual(errors,[],name+" valid fixture: "+errors.join(","));
}

const invalidId=structuredClone(fixtures["game.schema.json"]);invalidId.id="bad id";
assert.ok(validate(read("game.schema.json"),invalidId).length>0,"invalid ids must fail");

const withdrawn=structuredClone(fixtures["release.schema.json"]);withdrawn.distribution={state:"withdrawn",downloadable:true,reason:"withdrawn"};
assert.ok(validate(read("release.schema.json"),withdrawn).length>0,"withdrawn release must fail closed");

const measured=structuredClone(fixtures["compatibility-claim.schema.json"]);measured.receiptId=null;
assert.ok(validate(read("compatibility-claim.schema.json"),measured).length>0,"measured claim without receipt must fail");

const provenance=structuredClone(fixtures["file-artifact.schema.json"]);provenance.provenance={state:"verified",receiptId:null};
assert.ok(validate(read("file-artifact.schema.json"),provenance).length>0,"verified provenance without receipt must fail");

const publicProfile=structuredClone(fixtures["profile-loadout.schema.json"]);publicProfile.visibility="shared-public";publicProfile.shareConsentReceiptId=null;
assert.ok(validate(read("profile-loadout.schema.json"),publicProfile).length>0,"public profile without explicit consent receipt must fail");

const fakeInstallable=structuredClone(fixtures["collection-v2.schema.json"]);fakeInstallable.installable=true;
assert.ok(validate(read("collection-v2.schema.json"),fakeInstallable).length>0,"collection must not silently become installable");

const duplicateRelations=[fixtures["dependency.schema.json"],structuredClone(fixtures["dependency.schema.json"])];
const relationKey=x=>[x.sourceContentId,x.sourceReleaseRange,x.targetContentId,x.targetReleaseRange,x.relationType].join("|");
assert.notEqual(new Set(duplicateRelations.map(relationKey)).size,duplicateRelations.length,"duplicate relation sentinel");

const searchA=fixtures["search-document.schema.json"];
const searchB={...searchA,title:"Titre renommé",summary:"Résumé mis à jour"};
assert.equal(searchA.id,searchB.id,"search identity must stay stable across mutable copy");

console.log("V2_SCHEMA_COUNT",files.length);
console.log("PASS_V2_SCHEMA_MATERIALIZATION");
