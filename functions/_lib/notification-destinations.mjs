const CHANNELS=new Set(["EMAIL","PUSH"]);
const PROVIDERS={
  EMAIL:"Cloudflare Email Service",
  PUSH:"Web Push standard + VAPID"
};
const KEY_ENV="MODARYX_NOTIFICATION_DESTINATION_KEY_B64";
const KEY_VERSION=1;

function nonEmpty(value){
  return typeof value==="string"&&value.trim()?value.trim():null;
}

function bytesToBase64(bytes){
  let binary="";
  for(let i=0;i<bytes.length;i+=0x8000){
    binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
  }
  return btoa(binary);
}

function base64ToBytes(value){
  const raw=nonEmpty(value);
  if(!raw) return null;
  let normalized=raw.replace(/-/g,"+").replace(/_/g,"/");
  while(normalized.length%4) normalized+="=";
  if(!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) return null;
  try{
    const binary=atob(normalized);
    const out=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++) out[i]=binary.charCodeAt(i);
    return out;
  }catch{
    return null;
  }
}

async function sha256Hex(text){
  const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text)));
  return [...digest].map(x=>x.toString(16).padStart(2,"0")).join("");
}

function normalizeEmail(value){
  if(typeof value!=="string") return null;
  const trimmed=value.trim();
  if(!trimmed||trimmed.length>254||/[\r\n\0]/.test(trimmed)) return null;
  const at=trimmed.lastIndexOf("@");
  if(at<1||at===trimmed.length-1) return null;
  const local=trimmed.slice(0,at);
  const domain=trimmed.slice(at+1).toLowerCase();
  if(local.length>64||domain.length>253) return null;
  if(!/^[^\s@]+$/.test(local)) return null;
  if(!/^[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?$/i.test(domain)||!domain.includes(".")||domain.includes("..")) return null;
  return local+"@"+domain;
}

function safeHttpsEndpoint(value){
  if(typeof value!=="string"||value.length>4096) return null;
  try{
    const url=new URL(value);
    if(url.protocol!=="https:"||url.username||url.password||url.hash) return null;
    return url.href;
  }catch{
    return null;
  }
}

function base64UrlToken(value,{min=8,max=512}={}){
  if(typeof value!=="string"||value.length<min||value.length>max) return null;
  return /^[A-Za-z0-9_-]+$/.test(value)?value:null;
}

export function normalizeNotificationDestination(channel,destination){
  if(!CHANNELS.has(channel)) return {ok:false,reason:"channel-invalid"};
  if(channel==="EMAIL"){
    const source=typeof destination==="string"?destination:destination?.email;
    const email=normalizeEmail(source);
    if(!email) return {ok:false,reason:"email-invalid"};
    return {ok:true,value:{email},canonical:JSON.stringify({email})};
  }
  if(!destination||typeof destination!=="object"||Array.isArray(destination)) return {ok:false,reason:"push-subscription-invalid"};
  const endpoint=safeHttpsEndpoint(destination.endpoint);
  const p256dh=base64UrlToken(destination.keys?.p256dh,{min:32,max:512});
  const auth=base64UrlToken(destination.keys?.auth,{min:8,max:256});
  if(!endpoint||!p256dh||!auth) return {ok:false,reason:"push-subscription-invalid"};
  const value={endpoint,keys:{p256dh,auth}};
  return {ok:true,value,canonical:JSON.stringify(value)};
}

async function importVaultKey(env){
  const bytes=base64ToBytes(env?.[KEY_ENV]);
  if(!bytes||bytes.byteLength!==32) return null;
  try{
    return await crypto.subtle.importKey("raw",bytes,{name:"AES-GCM"},false,["encrypt","decrypt"]);
  }catch{
    return null;
  }
}

async function cryptContext(ownerIdentitySub,channel,digest){
  return new TextEncoder().encode(["modaryx-v2-notification-destination-v1",ownerIdentitySub,channel,digest].join("\n"));
}

async function encryptCanonical(env,{ownerIdentitySub,channel,canonical,digest}){
  const key=await importVaultKey(env);
  if(!key) return {ok:false,reason:"destination-vault-key-missing"};
  const iv=crypto.getRandomValues(new Uint8Array(12));
  try{
    const encrypted=await crypto.subtle.encrypt(
      {name:"AES-GCM",iv,additionalData:await cryptContext(ownerIdentitySub,channel,digest),tagLength:128},
      key,
      new TextEncoder().encode(canonical)
    );
    return {
      ok:true,
      ciphertextB64:bytesToBase64(new Uint8Array(encrypted)),
      ivB64:bytesToBase64(iv),
      keyVersion:KEY_VERSION
    };
  }catch{
    return {ok:false,reason:"destination-encryption-failed"};
  }
}

async function decryptCanonical(env,{ownerIdentitySub,channel,digest,ciphertextB64,ivB64}){
  const key=await importVaultKey(env);
  if(!key) return {ok:false,reason:"destination-vault-key-missing"};
  const ciphertext=base64ToBytes(ciphertextB64);
  const iv=base64ToBytes(ivB64);
  if(!ciphertext||!iv||iv.byteLength!==12) return {ok:false,reason:"destination-ciphertext-invalid"};
  try{
    const plaintext=await crypto.subtle.decrypt(
      {name:"AES-GCM",iv,additionalData:await cryptContext(ownerIdentitySub,channel,digest),tagLength:128},
      key,
      ciphertext
    );
    const canonical=new TextDecoder().decode(plaintext);
    const check=await sha256Hex(canonical);
    if(check!==digest) return {ok:false,reason:"destination-digest-mismatch"};
    return {ok:true,canonical};
  }catch{
    return {ok:false,reason:"destination-decryption-failed"};
  }
}

async function destinationId(ownerIdentitySub,channel,digest){
  const h=await sha256Hex(ownerIdentitySub+"\n"+channel+"\n"+digest);
  return "mx_destination_"+h.slice(0,32);
}

function publicShape(row){
  return {
    destinationId:row.destination_id,
    channel:row.channel,
    provider:row.provider_kind,
    state:row.state,
    keyVersion:Number(row.key_version),
    createdAt:row.created_at,
    updatedAt:row.updated_at,
    revokedAt:row.revoked_at||null
  };
}

export async function registerNotificationDestination(env,{ownerIdentitySub,channel,destination}={}){
  if(!env?.MODARYX_DB||typeof env.MODARYX_DB.prepare!=="function") return {ok:false,status:503,reason:"d1-binding-missing"};
  const owner=nonEmpty(ownerIdentitySub);
  if(!owner) return {ok:false,status:400,reason:"owner-invalid"};
  const normalized=normalizeNotificationDestination(channel,destination);
  if(!normalized.ok) return {ok:false,status:400,reason:normalized.reason};
  const digest=await sha256Hex(normalized.canonical);
  const encrypted=await encryptCanonical(env,{ownerIdentitySub:owner,channel,canonical:normalized.canonical,digest});
  if(!encrypted.ok) return {ok:false,status:503,reason:encrypted.reason};
  const id=await destinationId(owner,channel,digest);
  const provider=PROVIDERS[channel];
  const now=new Date().toISOString();
  try{
    await env.MODARYX_DB.prepare(
      `INSERT INTO modaryx_v2_notification_destinations (
        destination_id,owner_identity_sub,channel,provider_kind,destination_ref_digest_sha256,
        ciphertext_b64,iv_b64,key_version,state,created_at,updated_at,revoked_at
      ) VALUES (?,?,?,?,?,?,?,?, 'ACTIVE', ?, ?, NULL)
      ON CONFLICT(owner_identity_sub,channel,destination_ref_digest_sha256) DO UPDATE SET
        provider_kind=excluded.provider_kind,
        ciphertext_b64=excluded.ciphertext_b64,
        iv_b64=excluded.iv_b64,
        key_version=excluded.key_version,
        state='ACTIVE',
        updated_at=excluded.updated_at,
        revoked_at=NULL`
    ).bind(
      id,owner,channel,provider,digest,encrypted.ciphertextB64,encrypted.ivB64,
      encrypted.keyVersion,now,now
    ).run();
    const row=await env.MODARYX_DB.prepare(
      `SELECT destination_id,channel,provider_kind,key_version,state,created_at,updated_at,revoked_at
       FROM modaryx_v2_notification_destinations
       WHERE owner_identity_sub=? AND channel=? AND destination_ref_digest_sha256=? LIMIT 1`
    ).bind(owner,channel,digest).first();
    if(!row) return {ok:false,status:503,reason:"destination-vault-unavailable"};
    return {ok:true,status:201,destination:publicShape(row)};
  }catch{
    return {ok:false,status:503,reason:"destination-vault-unavailable"};
  }
}

export async function listNotificationDestinations(env,{ownerIdentitySub}={}){
  if(!env?.MODARYX_DB||typeof env.MODARYX_DB.prepare!=="function") return {ok:false,status:503,reason:"d1-binding-missing"};
  const owner=nonEmpty(ownerIdentitySub);
  if(!owner) return {ok:false,status:400,reason:"owner-invalid"};
  try{
    const result=await env.MODARYX_DB.prepare(
      `SELECT destination_id,channel,provider_kind,key_version,state,created_at,updated_at,revoked_at
       FROM modaryx_v2_notification_destinations
       WHERE owner_identity_sub=? ORDER BY updated_at DESC, destination_id ASC`
    ).bind(owner).all();
    return {ok:true,status:200,destinations:(result?.results||[]).map(publicShape)};
  }catch{
    return {ok:false,status:503,reason:"destination-vault-unavailable"};
  }
}

export async function revokeNotificationDestination(env,{ownerIdentitySub,destinationId:rawId}={}){
  if(!env?.MODARYX_DB||typeof env.MODARYX_DB.prepare!=="function") return {ok:false,status:503,reason:"d1-binding-missing"};
  const owner=nonEmpty(ownerIdentitySub);
  const id=nonEmpty(rawId);
  if(!owner||!id||!/^mx_destination_[a-f0-9]{32}$/.test(id)) return {ok:false,status:400,reason:"destination-id-invalid"};
  const now=new Date().toISOString();
  try{
    await env.MODARYX_DB.prepare(
      `UPDATE modaryx_v2_notification_destinations
       SET state='REVOKED',revoked_at=?,updated_at=?
       WHERE destination_id=? AND owner_identity_sub=? AND state='ACTIVE'`
    ).bind(now,now,id,owner).run();
    const row=await env.MODARYX_DB.prepare(
      `SELECT destination_id,channel,provider_kind,key_version,state,created_at,updated_at,revoked_at
       FROM modaryx_v2_notification_destinations
       WHERE destination_id=? AND owner_identity_sub=? LIMIT 1`
    ).bind(id,owner).first();
    if(!row) return {ok:false,status:404,reason:"destination-not-found"};
    return {ok:true,status:200,destination:publicShape(row)};
  }catch{
    return {ok:false,status:503,reason:"destination-vault-unavailable"};
  }
}

export async function resolveNotificationDestination(env,{ownerIdentitySub,channel,destinationRefDigestSha256}={}){
  if(!env?.MODARYX_DB||typeof env.MODARYX_DB.prepare!=="function") return {ok:false,reason:"d1-binding-missing"};
  const owner=nonEmpty(ownerIdentitySub);
  const digest=typeof destinationRefDigestSha256==="string"?destinationRefDigestSha256.trim().toLowerCase():"";
  if(!owner||!CHANNELS.has(channel)||!/^[a-f0-9]{64}$/.test(digest)) return {ok:false,reason:"destination-reference-invalid"};
  try{
    const row=await env.MODARYX_DB.prepare(
      `SELECT ciphertext_b64,iv_b64,key_version,state
       FROM modaryx_v2_notification_destinations
       WHERE owner_identity_sub=? AND channel=? AND destination_ref_digest_sha256=? LIMIT 1`
    ).bind(owner,channel,digest).first();
    if(!row||row.state!=="ACTIVE") return {ok:false,reason:"destination-not-active"};
    if(Number(row.key_version)!==KEY_VERSION) return {ok:false,reason:"destination-key-version-unsupported"};
    const decrypted=await decryptCanonical(env,{
      ownerIdentitySub:owner,channel,digest,ciphertextB64:row.ciphertext_b64,ivB64:row.iv_b64
    });
    if(!decrypted.ok) return decrypted;
    const value=JSON.parse(decrypted.canonical);
    const normalized=normalizeNotificationDestination(channel,value);
    if(!normalized.ok||normalized.canonical!==decrypted.canonical) return {ok:false,reason:"destination-payload-invalid"};
    return {ok:true,destination:normalized.value};
  }catch{
    return {ok:false,reason:"destination-vault-unavailable"};
  }
}

export async function notificationDestinationDigest(channel,destination){
  const normalized=normalizeNotificationDestination(channel,destination);
  if(!normalized.ok) return normalized;
  return {ok:true,digest:await sha256Hex(normalized.canonical)};
}

export const notificationDestinationKeyVersion=()=>KEY_VERSION;
export const notificationDestinationProviders=()=>({...PROVIDERS});
