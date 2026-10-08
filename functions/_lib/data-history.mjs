const KINDS=new Set(["profile","notification-preferences","game-profile","content","release","collection","modpack","community-submission","moderation","appeal"]);
const ACTIONS=new Set(["created","updated","preferences-updated","submitted","published","withdrawn","revoked","moderation-decision","appeal-outcome","sync-conflict"]);

const clean=(value,max)=>{
  if(typeof value!=="string") return null;
  const v=value.trim();
  return v&&v.length<=max?v:null;
};

export function validateDataHistoryEvent(input){
  if(!input||typeof input!=="object"||Array.isArray(input)) return {ok:false,reason:"history-invalid"};
  const ownerIdentitySub=clean(input.ownerIdentitySub,220);
  const entityId=clean(input.entityId,220);
  const sourceReceiptId=input.sourceReceiptId==null?null:clean(input.sourceReceiptId,220);
  const occurredAt=clean(input.occurredAt,40);
  if(!ownerIdentitySub||!entityId||!occurredAt||Number.isNaN(Date.parse(occurredAt))) return {ok:false,reason:"history-fields-invalid"};
  if(!KINDS.has(input.entityKind)) return {ok:false,reason:"history-kind-invalid"};
  if(!ACTIONS.has(input.action)) return {ok:false,reason:"history-action-invalid"};
  const fields=input.changedFields??[];
  if(!Array.isArray(fields)||fields.length>64||fields.some(x=>!clean(x,80))) return {ok:false,reason:"history-fields-invalid"};
  return {ok:true,value:{
    ownerIdentitySub,entityKind:input.entityKind,entityId,action:input.action,
    changedFields:[...new Set(fields.map(x=>x.trim()))].sort(),
    sourceReceiptId,occurredAt:new Date(occurredAt).toISOString()
  }};
}

function stable(value){
  if(Array.isArray(value)) return "["+value.map(stable).join(",")+"]";
  if(value&&typeof value==="object") return "{"+Object.keys(value).sort().map(k=>JSON.stringify(k)+":"+stable(value[k])).join(",")+"}";
  return JSON.stringify(value);
}

async function sha256Hex(value){
  const bytes=new TextEncoder().encode(value);
  const digest=await crypto.subtle.digest("SHA-256",bytes);
  return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join("");
}

export async function recordDataHistory(env,input){
  if(!env?.MODARYX_DB) return {ok:false,status:503,reason:"d1-binding-missing"};
  const valid=validateDataHistoryEvent(input);
  if(!valid.ok) return {ok:false,status:400,reason:valid.reason};
  const v=valid.value;
  try{
    const previous=await env.MODARYX_DB.prepare(
      `SELECT history_id,revision FROM modaryx_v2_data_history
       WHERE owner_identity_sub=? AND entity_kind=? AND entity_id=?
       ORDER BY revision DESC LIMIT 1`
    ).bind(v.ownerIdentitySub,v.entityKind,v.entityId).first();
    const revision=Number(previous?.revision||0)+1;
    const historyId="mx_history_"+crypto.randomUUID().replaceAll("-","");
    const digest=await sha256Hex(stable({
      entityKind:v.entityKind,entityId:v.entityId,action:v.action,revision,
      changedFields:v.changedFields,previousHistoryId:previous?.history_id||null,
      sourceReceiptId:v.sourceReceiptId,occurredAt:v.occurredAt
    }));
    const now=new Date().toISOString();
    await env.MODARYX_DB.prepare(
      `INSERT INTO modaryx_v2_data_history (
        history_id,owner_identity_sub,entity_kind,entity_id,action,revision,changed_fields_json,
        previous_history_id,source_receipt_id,snapshot_digest_sha256,occurred_at,created_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(
      historyId,v.ownerIdentitySub,v.entityKind,v.entityId,v.action,revision,JSON.stringify(v.changedFields),
      previous?.history_id||null,v.sourceReceiptId,digest,v.occurredAt,now
    ).run();
    return {ok:true,status:201,historyId,revision,digest};
  }catch{
    return {ok:false,status:503,reason:"history-storage-unavailable"};
  }
}

export function publicDataHistory(row){
  let changedFields=[];
  try{
    const parsed=JSON.parse(row.changed_fields_json||"[]");
    if(Array.isArray(parsed)) changedFields=parsed.filter(x=>typeof x==="string");
  }catch{}
  return {
    id:row.history_id,entityKind:row.entity_kind,entityId:row.entity_id,action:row.action,
    revision:Number(row.revision),changedFields,previousHistoryId:row.previous_history_id||null,
    sourceReceiptId:row.source_receipt_id||null,digest:row.snapshot_digest_sha256,
    occurredAt:row.occurred_at
  };
}
