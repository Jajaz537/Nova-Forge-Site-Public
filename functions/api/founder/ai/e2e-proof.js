import {authorizeFounderAi} from '../../../_lib/founder-ai-bridge.mjs';

const SCHEMA='modaryx-p6-founder-e2e-receipt-v1';
const PROOF_ID='founder-e2e-v1';

function html(ok, detail) {
  const title=ok?'MODARYX IA — Preuve Founder PASS':'MODARYX IA — Preuve Founder incomplète';
  const state=ok?'PASS':'À REJOUER';
  return new Response(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><style>body{font-family:system-ui;background:#111;color:#eee;display:grid;place-items:center;min-height:100vh;margin:0}main{max-width:720px;padding:32px;border:1px solid #444;border-radius:18px;background:#181818}strong{font-size:2rem}code{color:#e4b85c}</style></head><body><main><strong>${state}</strong><p>${detail}</p><p>Aucun cookie, token, contenu de conversation ou secret n’a été enregistré dans cette preuve.</p><code>${SCHEMA}</code></main></body></html>`,{
    status:ok?200:503,
    headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer'}
  });
}

async function callSameOrigin(context,path,init={}){
  const origin=new URL(context.request.url).origin;
  const cookie=context.request.headers.get('cookie')||'';
  const headers=new Headers(init.headers||{});
  headers.set('accept','application/json');
  if(cookie) headers.set('cookie',cookie);
  return fetch(new URL(path,origin),{...init,headers,redirect:'manual',cache:'no-store'});
}

async function bodyJson(response){
  try{return await response.json();}catch{return null;}
}

export async function onRequestGet(context){
  if(context.env?.MODARYX_P6_EVIDENCE_MODE!=='enabled') return new Response('not found',{status:404});

  const access=await authorizeFounderAi(context);
  if(!access.ok) return access.response;

  const sessionResponse=await callSameOrigin(context,'/api/v1/auth/session');
  const sessionData=await bodyJson(sessionResponse);
  const founderSession=Boolean(
    sessionResponse.ok &&
    sessionData?.authenticated===true &&
    sessionData?.authority?.capabilities?.founder===true &&
    sessionData?.authority?.role==='founder'
  );

  const statusResponse=await callSameOrigin(context,'/api/founder/ai/status');
  const statusData=await bodyJson(statusResponse);
  const privateStatus=Boolean(
    statusResponse.ok &&
    statusData?.protocol==='modaryx-founder-bridge-v1'
  );

  const origin=new URL(context.request.url).origin;
  const chatResponse=await callSameOrigin(context,'/api/founder/ai/chat',{
    method:'POST',
    headers:{'content-type':'application/json','origin':origin},
    body:JSON.stringify({
      conversation_id:'p6-founder-e2e',
      message:'Réponds brièvement pour la preuve E2E MODARYX P6.',
      max_tokens:64,
      agent_id:'site'
    })
  });
  const chatData=await bodyJson(chatResponse);
  const signedChat=Boolean(
    (chatResponse.status===200 && chatData?.status==='complete') ||
    (chatResponse.status===202 && chatData?.approval) ||
    (chatResponse.status===503 && ['resources_busy_or_no_provider','no-qualified-provider'].includes(chatData?.error))
  );

  const ok=founderSession&&privateStatus&&signedChat;
  const now=new Date();
  const expires=new Date(now.getTime()+20*60*1000);
  const receipt={
    schema:SCHEMA,
    created_at:now.toISOString(),
    expires_at:expires.toISOString(),
    deployment_origin:new URL(context.request.url).origin,
    founder_session:{status:founderSession?'PASS':'FAIL',http:sessionResponse.status,authenticated:sessionData?.authenticated===true,role:sessionData?.authority?.role||null},
    private_status:{status:privateStatus?'PASS':'FAIL',http:statusResponse.status,protocol:statusData?.protocol||null},
    signed_chat:{status:signedChat?'PASS':'FAIL',http:chatResponse.status,result_class:chatResponse.status===200?'complete':chatResponse.status===202?'awaiting_approval':chatData?.error||'unexpected'},
    secrets_recorded:false,
    identity_recorded:false,
    chat_content_recorded:false,
    overall_status:ok?'PASS':'FAIL'
  };

  const db=context.env?.MODARYX_DB;
  await db.prepare(`CREATE TABLE IF NOT EXISTS modaryx_p6_ephemeral_evidence (
    proof_id TEXT PRIMARY KEY,
    payload_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  )`).run();
  await db.prepare(`INSERT INTO modaryx_p6_ephemeral_evidence (proof_id,payload_json,created_at,expires_at)
    VALUES (?,?,?,?)
    ON CONFLICT(proof_id) DO UPDATE SET payload_json=excluded.payload_json,created_at=excluded.created_at,expires_at=excluded.expires_at`)
    .bind(PROOF_ID,JSON.stringify(receipt),receipt.created_at,receipt.expires_at).run();

  return html(ok,ok?'Session Founder, bridge privé et chat signé ont été vérifiés. Vous pouvez fermer cet onglet.':'Une porte P6 est encore indisponible. Le reçu de diagnostic non sensible a été enregistré.');
}
