const MARKER_KEY = "modaryx:v2:migration:v1";

export const LEGACY_KEYS = Object.freeze({
  favorites: "nova-forge:catalog:favorites:v1",
  savedViews: "nova-forge:catalog:saved-views:v1",
  creatorDraftV1: "nova-forge:creator:draft:v1",
  creatorDraftV2: "nova-forge:creator:draft:v2",
  collection: "nova-forge:community:collection:v1",
  communityDraft: "nova-forge:community:submission:v1",
  preferences: "nova_site_shell_preferences_v1",
});

export const V2_KEYS = Object.freeze({
  favorites: "modaryx:v2:favorites",
  savedSearches: "modaryx:v2:saved-searches",
  creatorDraft: "modaryx:v2:creator-draft",
  collectionDrafts: "modaryx:v2:collection-drafts",
  communityDraft: "modaryx:v2:community-draft",
  preferences: "modaryx:v2:preferences",
});

const readJson = (storage, key) => {
  const raw = storage.getItem(key);
  if (raw === null) return {state:"absent"};
  try { return {state:"ok", value:JSON.parse(raw), raw}; }
  catch { return {state:"invalid", raw}; }
};

const writeJson = (storage, key, value) => storage.setItem(key, JSON.stringify(value));
const nonEmpty = (value, max=2048) => typeof value === "string" && value.trim().length > 0 && value.length <= max;
const stringArray = (value, maxItems=256) => Array.isArray(value) && value.length <= maxItems && value.every(v => nonEmpty(v, 512));
const unique = (items) => [...new Set(items)];

function destinationAlreadyPresent(storage, destinationKey) {
  return storage.getItem(destinationKey) !== null;
}

function migrateFavorites(storage) {
  const legacy=readJson(storage,LEGACY_KEYS.favorites);
  if(legacy.state==="absent") return {legacyKey:LEGACY_KEYS.favorites,state:"absent"};
  if(legacy.state==="invalid" || !Array.isArray(legacy.value)) return {legacyKey:LEGACY_KEYS.favorites,state:"invalid-preserved"};
  if(destinationAlreadyPresent(storage,V2_KEYS.favorites)) return {legacyKey:LEGACY_KEYS.favorites,v2Key:V2_KEYS.favorites,state:"already-present"};
  const items=unique(legacy.value.filter(v=>nonEmpty(v,256))).sort();
  writeJson(storage,V2_KEYS.favorites,{schemaVersion:1,items});
  return {legacyKey:LEGACY_KEYS.favorites,v2Key:V2_KEYS.favorites,state:"migrated",count:items.length};
}

function migrateSavedViews(storage) {
  const legacy=readJson(storage,LEGACY_KEYS.savedViews);
  if(legacy.state==="absent") return {legacyKey:LEGACY_KEYS.savedViews,state:"absent"};
  if(legacy.state==="invalid" || !Array.isArray(legacy.value)) return {legacyKey:LEGACY_KEYS.savedViews,state:"invalid-preserved"};
  if(destinationAlreadyPresent(storage,V2_KEYS.savedSearches)) return {legacyKey:LEGACY_KEYS.savedViews,v2Key:V2_KEYS.savedSearches,state:"already-present"};
  const searches=[];
  const skipped=[];
  for(const view of legacy.value.slice(0,12)){
    if(!view || !nonEmpty(view.id,160) || !nonEmpty(view.name,160) || !view.filters || typeof view.filters!=="object"){
      skipped.push("invalid-view");
      continue;
    }
    const source=view.filters;
    const filters={};
    if(typeof source.q==="string") filters.q=source.q.slice(0,300);
    if(typeof source.game==="string" && source.game) filters.game=source.game.slice(0,160);
    if(typeof source.evidence==="string" && source.evidence) filters.evidence=source.evidence.slice(0,80);
    if(typeof source.sort==="string" && source.sort) filters.sort=source.sort.slice(0,80);
    if(source.favoritesOnly===true) filters.favoritesOnly=true;
    if(typeof source.kind==="string" && source.kind){
      if(source.kind==="pack") skipped.push("kind-pack-unmapped");
      else filters.kind=source.kind.slice(0,80);
    }
    searches.push({id:view.id,name:view.name,filters,source:"legacy-saved-view-v1"});
  }
  writeJson(storage,V2_KEYS.savedSearches,{schemaVersion:1,searches,partial:skipped.length>0,unmapped:unique(skipped)});
  return {legacyKey:LEGACY_KEYS.savedViews,v2Key:V2_KEYS.savedSearches,state:skipped.length?"migrated-partial":"migrated",count:searches.length,unmapped:unique(skipped)};
}

function validUmmDraft(wrapper){
  const m=wrapper?.manifest;
  return wrapper?.draftSchema===2 && m?.schemaVersion===1 &&
    m?.content && nonEmpty(m.content.id,128) && nonEmpty(m.content.name,160) && nonEmpty(m.content.version,80) &&
    m?.target && nonEmpty(m.target.gameId,120) && nonEmpty(m.target.gameName,160) &&
    m?.creator && nonEmpty(m.creator.id,160) && nonEmpty(m.creator.displayName,160) &&
    m?.compatibility && m?.rights && m?.provenance && Array.isArray(m?.files) &&
    m?.distribution?.state==="locked" && m?.distribution?.downloadable===false && m?.releaseReceipt===null;
}

function migrateCreatorDraft(storage){
  const current=readJson(storage,LEGACY_KEYS.creatorDraftV2);
  if(current.state==="ok"){
    if(!validUmmDraft(current.value)) return {legacyKey:LEGACY_KEYS.creatorDraftV2,state:"invalid-preserved"};
    if(destinationAlreadyPresent(storage,V2_KEYS.creatorDraft)) return {legacyKey:LEGACY_KEYS.creatorDraftV2,v2Key:V2_KEYS.creatorDraft,state:"already-present"};
    const m=current.value.manifest;
    const value={
      schemaVersion:1,
      state:"local-draft",
      source:{legacyKey:LEGACY_KEYS.creatorDraftV2,format:"universal-mod-manifest-v1"},
      contentItem:{id:m.content.id,name:m.content.name,kind:m.content.kind,summary:m.content.summary??null,creator:{...m.creator},game:{id:m.target.gameId,name:m.target.gameName}},
      release:{version:m.content.version,targetVersions:[...(m.target.versions||[])],loaders:[...(m.target.loaders||[])],compatibility:m.compatibility,rights:m.rights,provenance:m.provenance,files:m.files,distribution:{...m.distribution},releaseReceipt:null}
    };
    writeJson(storage,V2_KEYS.creatorDraft,value);
    return {legacyKey:LEGACY_KEYS.creatorDraftV2,v2Key:V2_KEYS.creatorDraft,state:"migrated"};
  }
  if(current.state==="invalid") return {legacyKey:LEGACY_KEYS.creatorDraftV2,state:"invalid-preserved"};
  const older=readJson(storage,LEGACY_KEYS.creatorDraftV1);
  if(older.state==="absent") return {legacyKey:LEGACY_KEYS.creatorDraftV1,state:"absent"};
  return {legacyKey:LEGACY_KEYS.creatorDraftV1,state:older.state==="invalid"?"invalid-preserved":"preserved-unmapped",reason:"explicit-user-save-required"};
}

function migrateCollection(storage){
  const legacy=readJson(storage,LEGACY_KEYS.collection);
  if(legacy.state==="absent") return {legacyKey:LEGACY_KEYS.collection,state:"absent"};
  const v=legacy.value;
  const valid=legacy.state==="ok" && v?.schemaVersion===1 && nonEmpty(v.id,128) && nonEmpty(v.name,160) &&
    stringArray(v.itemIds,512) && v.syncState==="local-only" && v.visibility==="private-local" && v.ownerProfileId===null;
  if(!valid) return {legacyKey:LEGACY_KEYS.collection,state:"invalid-preserved"};
  if(destinationAlreadyPresent(storage,V2_KEYS.collectionDrafts)) return {legacyKey:LEGACY_KEYS.collection,v2Key:V2_KEYS.collectionDrafts,state:"already-present"};
  const draft={schemaVersion:1,id:v.id,name:v.name,visibility:"private",syncState:"local-only",items:unique(v.itemIds).map(contentId=>({contentId}))};
  if(typeof v.description==="string" && v.description) draft.description=v.description.slice(0,1200);
  writeJson(storage,V2_KEYS.collectionDrafts,{schemaVersion:1,drafts:[draft]});
  return {legacyKey:LEGACY_KEYS.collection,v2Key:V2_KEYS.collectionDrafts,state:"migrated",count:draft.items.length};
}

function migrateCommunityDraft(storage){
  const legacy=readJson(storage,LEGACY_KEYS.communityDraft);
  if(legacy.state==="absent") return {legacyKey:LEGACY_KEYS.communityDraft,state:"absent"};
  const v=legacy.value;
  const valid=legacy.state==="ok" && v?.schemaVersion===1 && nonEmpty(v.id,128) &&
    ["discussion","review","comment"].includes(v.kind) && nonEmpty(v.targetId,128) && nonEmpty(v.body,8000) &&
    v.authorProfileId===null && v.syncState==="local-only" && v.publicationState==="local-draft" && v.moderationState==="not-submitted";
  if(!valid) return {legacyKey:LEGACY_KEYS.communityDraft,state:"invalid-preserved"};
  if(destinationAlreadyPresent(storage,V2_KEYS.communityDraft)) return {legacyKey:LEGACY_KEYS.communityDraft,v2Key:V2_KEYS.communityDraft,state:"already-present"};
  writeJson(storage,V2_KEYS.communityDraft,{...v,source:"legacy-community-draft-v1"});
  return {legacyKey:LEGACY_KEYS.communityDraft,v2Key:V2_KEYS.communityDraft,state:"migrated"};
}

function migratePreferences(storage){
  const legacy=readJson(storage,LEGACY_KEYS.preferences);
  if(legacy.state==="absent") return {legacyKey:LEGACY_KEYS.preferences,state:"absent"};
  const v=legacy.value;
  if(legacy.state!=="ok" || !v || typeof v!=="object" || Array.isArray(v)) return {legacyKey:LEGACY_KEYS.preferences,state:"invalid-preserved"};
  if(destinationAlreadyPresent(storage,V2_KEYS.preferences)) return {legacyKey:LEGACY_KEYS.preferences,v2Key:V2_KEYS.preferences,state:"already-present"};
  const recognized={};
  if(v.motion==="reduced" || v.reducedMotion===true) recognized.reducedMotion=true;
  if(typeof v.ambience==="boolean") recognized.ambience=v.ambience;
  if(!Object.keys(recognized).length) return {legacyKey:LEGACY_KEYS.preferences,state:"preserved-unmapped",reason:"no-v2-equivalent"};
  writeJson(storage,V2_KEYS.preferences,{schemaVersion:1,...recognized});
  return {legacyKey:LEGACY_KEYS.preferences,v2Key:V2_KEYS.preferences,state:"migrated"};
}

export function migrateLegacyBrowserState(storage=globalThis.localStorage){
  if(!storage || typeof storage.getItem!=="function" || typeof storage.setItem!=="function"){
    return {schemaVersion:1,status:"unavailable",markerWritten:false,items:[]};
  }
  const items=[];
  const operations=[migrateFavorites,migrateSavedViews,migrateCreatorDraft,migrateCollection,migrateCommunityDraft,migratePreferences];
  for(const operation of operations){
    try { items.push(operation(storage)); }
    catch { items.push({state:"write-failed-preserved"}); }
  }
  const problemStates=new Set(["invalid-preserved","preserved-unmapped","migrated-partial","write-failed-preserved"]);
  const migrated=items.some(x=>["migrated","migrated-partial","already-present"].includes(x.state));
  const partial=items.some(x=>problemStates.has(x.state));
  const status=partial?"partial":migrated?"complete":"noop";
  const report={schemaVersion:1,status,nonDestructive:true,legacyDeleted:false,items,completedAt:new Date().toISOString()};
  let markerWritten=false;
  try { writeJson(storage,MARKER_KEY,report); markerWritten=true; } catch {}
  return {...report,markerWritten};
}

export { MARKER_KEY };
