const TYPES=new Set([
  "FOLLOWED_RELEASE","COMPATIBILITY_CHANGED","CONTENT_REVOKED","DEPENDENCY_UNAVAILABLE",
  "COMMUNITY_REPLY","COMMUNITY_MENTION","SUPPORT_UPDATE","MODERATION_UPDATE",
  "CREATOR_RELEASE_SUBMITTED","CREATOR_VALIDATION_FAILED","CREATOR_PUBLISHED","CREATOR_REMOVED",
  "CREATOR_APPEAL_STATUS","CREATOR_REPORT_ATTENTION",
  "PROFILE_CONFLICT","PROFILE_DEPENDENCY_MISSING","PROFILE_UPDATE_AVAILABLE","PROFILE_SYNC_CONFLICT",
  "PUBLISHER_RESPONSE","RIGHTS_APPROVED_SCOPED","RIGHTS_APPROVED_WITH_LIMITS","RIGHTS_MORE_INFO",
  "LEGAL_REVIEW_REQUIRED","RIGHTS_DECLINED","RIGHTS_EXPIRING","RIGHTS_EXPIRED","RIGHTS_REVOKED"
]);
const PRIORITIES=new Set(["CRITICAL","IMPORTANT","NORMAL","SILENT"]);
const SOURCE_KINDS=new Set(["content","community","creator","profile","rights","moderation","system"]);
const ALLOWED_KEYS=new Set(["recipientIdentitySub","eventType","priority","title","summary","href","stateLabel","affectedScopes","sourceKind","sourceId","occurredAt"]);

const text=(value,max,{required=false}={})=>{
  if(value===undefined||value===null) return required?null:"";
  if(typeof value!=="string") return null;
  const normalized=value.trim();
  if(required&&!normalized) return null;
  if(normalized.length>max) return null;
  return normalized;
};

export function validateNotificationEvent(input){
  if(!input||typeof input!=="object"||Array.isArray(input)) return {ok:false,reason:"notification-invalid"};
  for(const key of Object.keys(input)) if(!ALLOWED_KEYS.has(key)) return {ok:false,reason:"notification-field-forbidden"};
  const recipientIdentitySub=text(input.recipientIdentitySub,220,{required:true});
  const title=text(input.title,160,{required:true});
  const summary=text(input.summary??"",600);
  const sourceId=text(input.sourceId,180,{required:true});
  const stateLabel=input.stateLabel===undefined||input.stateLabel===null?"":text(input.stateLabel,80);
  const occurredAt=text(input.occurredAt,40,{required:true});
  if(!recipientIdentitySub||!title||summary===null||!sourceId||stateLabel===null||!occurredAt||Number.isNaN(Date.parse(occurredAt))) {
    return {ok:false,reason:"notification-fields-invalid"};
  }
  if(!TYPES.has(input.eventType)) return {ok:false,reason:"notification-type-invalid"};
  if(!PRIORITIES.has(input.priority)) return {ok:false,reason:"notification-priority-invalid"};
  if(!SOURCE_KINDS.has(input.sourceKind)) return {ok:false,reason:"notification-source-invalid"};
  if(typeof input.href!=="string"||!input.href.startsWith("/")||input.href.startsWith("//")||input.href.length>240) return {ok:false,reason:"notification-href-invalid"};
  const scopes=input.affectedScopes??[];
  if(!Array.isArray(scopes)||scopes.length>32||scopes.some(x=>typeof x!=="string"||!x.trim()||x.length>100)) return {ok:false,reason:"notification-scopes-invalid"};
  return {ok:true,value:{
    recipientIdentitySub,eventType:input.eventType,priority:input.priority,title,summary,
    href:input.href,stateLabel:stateLabel||null,affectedScopes:[...new Set(scopes.map(x=>x.trim()))],
    sourceKind:input.sourceKind,sourceId,occurredAt:new Date(occurredAt).toISOString()
  }};
}

export async function recordInAppNotification(env,input){
  if(!env?.MODARYX_DB) return {ok:false,status:503,reason:"d1-binding-missing"};
  const validated=validateNotificationEvent(input);
  if(!validated.ok) return {ok:false,status:400,reason:validated.reason};
  const n=validated.value;
  const id="mx_notification_"+crypto.randomUUID().replaceAll("-","");
  const now=new Date().toISOString();
  try{
    await env.MODARYX_DB.prepare(
      `INSERT OR IGNORE INTO modaryx_v2_notification_events (
        event_id, recipient_identity_sub, event_type, priority, title, summary, href,
        state_label, affected_scopes_json, source_kind, source_id, occurred_at, read_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`
    ).bind(id,n.recipientIdentitySub,n.eventType,n.priority,n.title,n.summary,n.href,n.stateLabel,JSON.stringify(n.affectedScopes),n.sourceKind,n.sourceId,n.occurredAt,now).run();
    const row=await env.MODARYX_DB.prepare(
      `SELECT event_id FROM modaryx_v2_notification_events
       WHERE recipient_identity_sub=? AND source_kind=? AND source_id=? AND event_type=? LIMIT 1`
    ).bind(n.recipientIdentitySub,n.sourceKind,n.sourceId,n.eventType).first();
    if(!row?.event_id) return {ok:false,status:503,reason:"notification-storage-unavailable"};
    return {ok:true,status:201,id:row.event_id,created:row.event_id===id};
  }catch{
    return {ok:false,status:503,reason:"notification-storage-unavailable"};
  }
}

export function publicNotification(row){
  let scopes=[];
  try{
    const parsed=JSON.parse(row.affected_scopes_json||"[]");
    if(Array.isArray(parsed)) scopes=parsed.filter(x=>typeof x==="string");
  }catch{}
  return {
    id:row.event_id,type:row.event_type,priority:row.priority,title:row.title,summary:row.summary||"",
    href:row.href,stateLabel:row.state_label||null,affectedScopes:scopes,
    source:{kind:row.source_kind,id:row.source_id},occurredAt:row.occurred_at,readAt:row.read_at||null
  };
}

export const defaultNotificationPreferences=()=>({
  product:true,community:true,creator:true,profile:true,rights:true,marketing:false
});

export function validateNotificationPreferences(input){
  if(!input||typeof input!=="object"||Array.isArray(input)) return {ok:false,reason:"preferences-invalid"};
  const allowed=new Set(["version","preferences"]);
  for(const key of Object.keys(input)) if(!allowed.has(key)) return {ok:false,reason:"preferences-field-forbidden"};
  if(!Number.isInteger(input.version)||input.version<0) return {ok:false,reason:"preferences-version-invalid"};
  const prefs=input.preferences;
  const names=["product","community","creator","profile","rights","marketing"];
  if(!prefs||typeof prefs!=="object"||Array.isArray(prefs)) return {ok:false,reason:"preferences-invalid"};
  if(Object.keys(prefs).some(k=>!names.includes(k))) return {ok:false,reason:"preferences-field-forbidden"};
  if(names.some(k=>typeof prefs[k]!=="boolean")) return {ok:false,reason:"preferences-invalid"};
  return {ok:true,value:{version:input.version,preferences:Object.fromEntries(names.map(k=>[k,prefs[k]]))}};
}

export function moderationDecisionNotification({recipientIdentitySub,submissionId,outcome,moderationState,receiptId,occurredAt}){
  if(!recipientIdentitySub||!submissionId||!receiptId||!occurredAt) return null;
  const map={
    publish:{title:"Votre contribution a été publiée",summary:"Une décision de modération a autorisé sa publication.",priority:"NORMAL"},
    hold:{title:"Votre contribution reste en revue",summary:"Une décision de modération maintient une revue supplémentaire.",priority:"IMPORTANT"},
    reject:{title:"Votre contribution a été refusée",summary:"Une décision de modération a refusé sa publication.",priority:"IMPORTANT"}
  };
  const copy=map[outcome];
  if(!copy) return null;
  return {
    recipientIdentitySub,eventType:"MODERATION_UPDATE",priority:copy.priority,title:copy.title,summary:copy.summary,
    href:"/community",stateLabel:String(moderationState||"").toUpperCase(),affectedScopes:[],
    sourceKind:"moderation",sourceId:receiptId,occurredAt
  };
}

export function appealOutcomeNotification({recipientIdentitySub,submissionId,result,moderationState,receiptId,occurredAt}){
  if(!recipientIdentitySub||!submissionId||!receiptId||!occurredAt) return null;
  const map={
    upheld:{title:"Votre recours a été examiné",summary:"La décision précédente a été maintenue.",priority:"IMPORTANT"},
    modified:{title:"Votre recours a modifié la décision",summary:"La décision précédente a été modifiée après nouvelle revue.",priority:"IMPORTANT"},
    reversed:{title:"Votre recours a rétabli votre contribution",summary:"La décision précédente a été infirmée après nouvelle revue.",priority:"NORMAL"}
  };
  const copy=map[result];
  if(!copy) return null;
  return {
    recipientIdentitySub,eventType:"MODERATION_UPDATE",priority:copy.priority,title:copy.title,summary:copy.summary,
    href:"/community",stateLabel:String(moderationState||"").toUpperCase(),affectedScopes:[],
    sourceKind:"moderation",sourceId:receiptId,occurredAt
  };
}
