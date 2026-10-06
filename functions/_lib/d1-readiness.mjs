const GROUPS={
  v1Foundation:[
    "modaryx_profiles","modaryx_community_submissions","modaryx_auth_transactions",
    "modaryx_sessions","modaryx_moderation_receipts"
  ],
  v2Core:[
    "modaryx_v2_games","modaryx_v2_content_types","modaryx_v2_creators","modaryx_v2_teams",
    "modaryx_v2_content_items","modaryx_v2_releases","modaryx_v2_dependencies",
    "modaryx_v2_compatibility_claims","modaryx_v2_file_artifacts","modaryx_v2_collections",
    "modaryx_v2_collection_items","modaryx_v2_modpacks","modaryx_v2_game_profiles",
    "modaryx_v2_search_documents"
  ],
  v2Notifications:["modaryx_v2_notification_events","modaryx_v2_notification_preferences"],
  v2History:["modaryx_v2_data_history"],
  v2Delivery:["modaryx_v2_notification_delivery_outbox"]
};

const emptyGroup=(expected)=>({expected:expected.length,present:0,complete:false});

function summarize(present){
  const set=new Set(present);
  const groups=Object.fromEntries(Object.entries(GROUPS).map(([name,expected])=>{
    const count=expected.filter(table=>set.has(table)).length;
    return [name,{expected:expected.length,present:count,complete:count===expected.length}];
  }));
  const ordered=["v1Foundation","v2Core","v2Notifications","v2History","v2Delivery"];
  let level="NONE";
  let contiguous=true;
  for(const name of ordered){
    if(contiguous&&groups[name].complete){
      level={
        v1Foundation:"V1_FOUNDATION",
        v2Core:"V2_CORE",
        v2Notifications:"V2_NOTIFICATIONS",
        v2History:"V2_HISTORY",
        v2Delivery:"V2_DELIVERY"
      }[name];
    }else if(groups[name].present>0){
      contiguous=false;
      level="PARTIAL";
    }else{
      contiguous=false;
    }
  }
  return {
    schemaVersion:1,
    bindingPresent:true,
    queryState:"OK",
    migrationLevel:level,
    groups,
    latestCandidateComplete:Object.values(groups).every(group=>group.complete),
    productionApproval:"OPEN"
  };
}

export async function d1SchemaReadiness(env={}){
  const db=env?.MODARYX_DB;
  if(!db||typeof db.prepare!=="function"){
    return {
      schemaVersion:1,
      bindingPresent:false,
      queryState:"BINDING_MISSING",
      migrationLevel:"UNKNOWN",
      groups:Object.fromEntries(Object.entries(GROUPS).map(([name,expected])=>[name,emptyGroup(expected)])),
      latestCandidateComplete:false,
      productionApproval:"OPEN"
    };
  }
  try{
    const rows=await db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'modaryx_%'"
    ).all();
    const names=(rows?.results||[]).map(row=>row?.name).filter(name=>typeof name==="string");
    return summarize(names);
  }catch{
    return {
      schemaVersion:1,
      bindingPresent:true,
      queryState:"QUERY_FAILED",
      migrationLevel:"UNKNOWN",
      groups:Object.fromEntries(Object.entries(GROUPS).map(([name,expected])=>[name,emptyGroup(expected)])),
      latestCandidateComplete:false,
      productionApproval:"OPEN"
    };
  }
}

export const d1ReadinessExpectedCounts=()=>Object.fromEntries(
  Object.entries(GROUPS).map(([name,expected])=>[name,expected.length])
);
