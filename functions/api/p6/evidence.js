const PROOF_ID='founder-e2e-v1';

export async function onRequestGet(context){
  if(context.env?.MODARYX_P6_EVIDENCE_MODE!=='enabled') return new Response('not found',{status:404});
  const db=context.env?.MODARYX_DB;
  if(!db||typeof db.prepare!=='function') return new Response('not found',{status:404});

  let row;
  try{
    row=await db.prepare('SELECT payload_json,expires_at FROM modaryx_p6_ephemeral_evidence WHERE proof_id = ? LIMIT 1').bind(PROOF_ID).first();
  }catch{
    return new Response(JSON.stringify({ready:false}),{status:200,headers:{'content-type':'application/json','cache-control':'no-store'}});
  }
  if(!row) return new Response(JSON.stringify({ready:false}),{status:200,headers:{'content-type':'application/json','cache-control':'no-store'}});
  if(row.expires_at<=new Date().toISOString()){
    await db.prepare('DELETE FROM modaryx_p6_ephemeral_evidence WHERE proof_id = ?').bind(PROOF_ID).run();
    return new Response(JSON.stringify({ready:false,expired:true}),{status:200,headers:{'content-type':'application/json','cache-control':'no-store'}});
  }
  let receipt=null;
  try{receipt=JSON.parse(row.payload_json);}catch{}
  if(!receipt||receipt.schema!=='modaryx-p6-founder-e2e-receipt-v1') return new Response(JSON.stringify({ready:false}),{status:200,headers:{'content-type':'application/json','cache-control':'no-store'}});
  return new Response(JSON.stringify({ready:true,receipt}),{
    status:200,
    headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer'}
  });
}
