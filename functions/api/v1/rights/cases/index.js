import {json} from "../../../../_lib/api-security.mjs";
import {authorizeRightsAdmin,rightsActorKey} from "../../../../_lib/rights-admin.mjs";
import {validateRightsCaseCreate} from "../../../../_lib/rights-registry.mjs";

const parse=value=>{try{const v=JSON.parse(value||"[]");return Array.isArray(v)?v:[]}catch{return []}};
const publicCase=row=>({
  caseId:row.case_id,gameId:row.game_id,gameName:row.game_name,publisherName:row.publisher_name,
  state:row.state,requestedScopes:parse(row.requested_scopes_json),productSurfaces:parse(row.product_surfaces_json),
  contactState:row.contact_state,createdAt:row.created_at,updatedAt:row.updated_at
});

export async function onRequestGet(context){
  const access=await authorizeRightsAdmin(context,{requireRecentAuthentication:false});
  if(!access.ok) return json({error:access.reason},access.status);
  try{
    const rows=await context.env.MODARYX_DB.prepare(
      `SELECT case_id,game_id,game_name,publisher_name,state,requested_scopes_json,
        product_surfaces_json,contact_state,created_at,updated_at
       FROM modaryx_v2_rights_cases ORDER BY updated_at DESC LIMIT 100`
    ).all();
    return json({schemaVersion:1,items:(rows?.results||[]).map(publicCase)});
  }catch{
    return json({error:"rights-registry-storage-unavailable"},503);
  }
}

export async function onRequestPost(context){
  const access=await authorizeRightsAdmin(context,{readBody:true,maxBytes:16_000,requireRecentAuthentication:true});
  if(!access.ok) return json({error:access.reason},access.status);
  const validated=validateRightsCaseCreate(access.body);
  if(!validated.ok) return json({error:validated.reason},400);
  const v=validated.value;
  const caseId="mx_rights_case_"+crypto.randomUUID().replaceAll("-","");
  const auditId="mx_rights_audit_"+crypto.randomUUID().replaceAll("-","");
  const actorKey=await rightsActorKey(access.identity.sub);
  const now=new Date().toISOString();
  try{
    await context.env.MODARYX_DB.batch([
      context.env.MODARYX_DB.prepare(
        `INSERT INTO modaryx_v2_rights_cases (
          case_id,game_id,game_name,publisher_name,state,requested_scopes_json,
          product_surfaces_json,contact_state,created_by_actor_key,created_at,updated_at
        ) VALUES (?,?,?,?, 'RIGHTS_CASE_CREATED', ?, ?, 'CONTACT_NOT_FOUND', ?, ?, ?)`
      ).bind(caseId,v.gameId,v.gameName,v.publisherName,JSON.stringify(v.requestedScopes),JSON.stringify(v.productSurfaces),actorKey,now,now),
      context.env.MODARYX_DB.prepare(
        `INSERT INTO modaryx_v2_rights_audit (
          audit_id,case_id,event_type,actor_key,payload_json,created_at
        ) VALUES (?,?,'CASE_CREATED',?,?,?)`
      ).bind(auditId,caseId,actorKey,JSON.stringify({gameId:v.gameId,requestedScopes:v.requestedScopes,productSurfaces:v.productSurfaces}),now)
    ]);
    const row=await context.env.MODARYX_DB.prepare(
      `SELECT case_id,game_id,game_name,publisher_name,state,requested_scopes_json,
        product_surfaces_json,contact_state,created_at,updated_at
       FROM modaryx_v2_rights_cases WHERE case_id=? LIMIT 1`
    ).bind(caseId).first();
    return json({schemaVersion:1,item:publicCase(row)},201);
  }catch{
    return json({error:"rights-case-create-failed"},409);
  }
}
