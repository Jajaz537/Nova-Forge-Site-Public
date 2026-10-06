import {json, readJson} from '../../../_lib/api-security.mjs';
import {authorizeFounderAi, requestFounderBridge} from '../../../_lib/founder-ai-bridge.mjs';

const allowed=new Set(['conversation_id','message','max_tokens','agent_id']);
function validText(value,max){return typeof value==='string'&&value.length>=1&&value.length<=max;}
export async function onRequestPost(context){
  const access=await authorizeFounderAi(context,{write:true});
  if(!access.ok) return access.response;
  const parsed=await readJson(context.request,70_000);
  if(!parsed.ok) return json({error:parsed.reason},parsed.status);
  const body=parsed.value;
  if(!body||Array.isArray(body)||typeof body!=='object'||Object.keys(body).some(key=>!allowed.has(key))) return json({error:'invalid-chat-payload'},400);
  if(!validText(body.conversation_id,128)||!validText(body.message,65536)) return json({error:'invalid-chat-payload'},400);
  if(body.max_tokens!==undefined&&(!Number.isInteger(body.max_tokens)||body.max_tokens<1||body.max_tokens>4096)) return json({error:'invalid-chat-payload'},400);
  if(body.agent_id!==undefined&&!validText(body.agent_id,64)) return json({error:'invalid-chat-payload'},400);
  return requestFounderBridge(context,'POST','/v1/chat',body);
}
