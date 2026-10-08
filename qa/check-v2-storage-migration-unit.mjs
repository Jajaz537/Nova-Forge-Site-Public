import assert from "node:assert/strict";
import {migrateLegacyBrowserState,LEGACY_KEYS,V2_KEYS,MARKER_KEY} from "../v2-preview/src/storage-migration.js";

class MemoryStorage {
  constructor(entries={}){this.map=new Map(Object.entries(entries));this.failKey=null;}
  getItem(k){return this.map.has(k)?this.map.get(k):null;}
  setItem(k,v){if(this.failKey===k) throw new Error("simulated-write-failure");this.map.set(k,String(v));}
  removeItem(k){this.map.delete(k);}
}

const json=v=>JSON.stringify(v);
const validManifest={
  schemaVersion:1,
  content:{id:"mod.alpha",name:"Alpha",version:"1.0.0",kind:"mod"},
  target:{gameId:"aetherlands",gameName:"Aetherlands",versions:["1.4.2"],loaders:["loader-a"]},
  creator:{id:"creator.alpha",displayName:"Alpha Studio"},
  compatibility:{evidence:"unknown",dependencies:[],conflicts:[]},
  rights:{license:"All rights reserved",redistribution:"unknown"},
  provenance:{state:"declared-unattested"},
  files:[{path:"mods/alpha.bin",size:4,hashes:{sha256:"a".repeat(64)},executable:false}],
  distribution:{state:"locked",downloadable:false},
  releaseReceipt:null
};

{
  const s=new MemoryStorage();
  const r=migrateLegacyBrowserState(s);
  assert.equal(r.status,"noop");
  assert.equal(r.markerWritten,true);
  assert.equal(s.getItem(LEGACY_KEYS.favorites),null);
}

{
  const s=new MemoryStorage({
    [LEGACY_KEYS.favorites]:json(["b","a","a"]),
    [LEGACY_KEYS.savedViews]:json([{id:"view-1",name:"Legacy",filters:{q:"dragon",kind:"pack",game:"aetherlands",sort:"featured",favoritesOnly:true}}]),
    [LEGACY_KEYS.creatorDraftV2]:json({draftSchema:2,manifest:validManifest}),
    [LEGACY_KEYS.collection]:json({schemaVersion:1,id:"collection-1",name:"Collection",itemIds:["mod.alpha"],syncState:"local-only",visibility:"private-local",ownerProfileId:null}),
    [LEGACY_KEYS.communityDraft]:json({schemaVersion:1,id:"discussion-1",kind:"discussion",targetId:"mod.alpha",title:"Titre",body:"Texte",authorProfileId:null,syncState:"local-only",publicationState:"local-draft",moderationState:"not-submitted"}),
    [LEGACY_KEYS.preferences]:json({motion:"reduced"})
  });
  const r=migrateLegacyBrowserState(s);
  assert.equal(r.status,"partial");
  assert.deepEqual(JSON.parse(s.getItem(V2_KEYS.favorites)).items,["a","b"]);
  const searches=JSON.parse(s.getItem(V2_KEYS.savedSearches));
  assert.equal(searches.partial,true);
  assert.deepEqual(searches.unmapped,["kind-pack-unmapped"]);
  const creator=JSON.parse(s.getItem(V2_KEYS.creatorDraft));
  assert.equal(creator.state,"local-draft");
  assert.equal(creator.release.distribution.state,"locked");
  assert.equal(creator.release.distribution.downloadable,false);
  assert.equal(creator.release.releaseReceipt,null);
  assert.equal(JSON.parse(s.getItem(V2_KEYS.collectionDrafts)).drafts[0].items[0].contentId,"mod.alpha");
  assert.equal(JSON.parse(s.getItem(V2_KEYS.communityDraft)).publicationState,"local-draft");
  assert.equal(JSON.parse(s.getItem(V2_KEYS.preferences)).reducedMotion,true);
  for(const key of Object.values(LEGACY_KEYS)) {
    if(key===LEGACY_KEYS.creatorDraftV1) continue;
    assert.notEqual(s.getItem(key),null,"legacy source must be preserved: "+key);
  }
}

{
  const s=new MemoryStorage({[LEGACY_KEYS.creatorDraftV1]:json({schemaVersion:1,fields:{contentId:"legacy"}})});
  const r=migrateLegacyBrowserState(s);
  assert.equal(r.status,"partial");
  assert.equal(s.getItem(V2_KEYS.creatorDraft),null);
  assert.notEqual(s.getItem(LEGACY_KEYS.creatorDraftV1),null);
  assert.ok(r.items.some(x=>x.state==="preserved-unmapped"));
}

{
  const s=new MemoryStorage({[LEGACY_KEYS.favorites]:"{not-json"});
  const r=migrateLegacyBrowserState(s);
  assert.equal(r.status,"partial");
  assert.equal(s.getItem(V2_KEYS.favorites),null);
  assert.equal(s.getItem(LEGACY_KEYS.favorites),"{not-json");
}

{
  const s=new MemoryStorage({[LEGACY_KEYS.favorites]:json(["one"])});
  s.failKey=MARKER_KEY;
  const first=migrateLegacyBrowserState(s);
  assert.equal(first.markerWritten,false);
  assert.deepEqual(JSON.parse(s.getItem(V2_KEYS.favorites)).items,["one"]);
  assert.notEqual(s.getItem(LEGACY_KEYS.favorites),null);
  s.failKey=null;
  const second=migrateLegacyBrowserState(s);
  assert.equal(second.markerWritten,true);
  assert.ok(second.items.some(x=>x.state==="already-present"));
  assert.deepEqual(JSON.parse(s.getItem(V2_KEYS.favorites)).items,["one"]);
}

console.log("PASS_V2_STORAGE_MIGRATION_UNIT");
