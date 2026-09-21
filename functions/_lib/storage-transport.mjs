const SHA256_RE=/^[a-f0-9]{64}$/;

function safeHttpsUrl(value){
  try{
    const url=new URL(value);
    if(url.protocol!=='https:' || url.username || url.password || url.hash) return null;
    return url;
  }catch{
    return null;
  }
}

function toHex(buffer){
  return [...new Uint8Array(buffer)].map(v=>v.toString(16).padStart(2,'0')).join('');
}

async function digestHex(bytes){
  return toHex(await crypto.subtle.digest('SHA-256',bytes));
}

async function readBounded(response,maxBytes){
  const lengthHeader=response.headers?.get?.('content-length');
  if(lengthHeader && /^\d+$/.test(lengthHeader) && Number(lengthHeader)>maxBytes){
    return {ok:false,reason:'response-too-large'};
  }

  if(response.body?.getReader){
    const reader=response.body.getReader();
    const chunks=[];
    let total=0;
    while(true){
      const {done,value}=await reader.read();
      if(done) break;
      total+=value.byteLength;
      if(total>maxBytes){
        try{await reader.cancel();}catch{}
        return {ok:false,reason:'response-too-large'};
      }
      chunks.push(value);
    }
    const bytes=new Uint8Array(total);
    let offset=0;
    for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
    return {ok:true,bytes};
  }

  const raw=new Uint8Array(await response.arrayBuffer());
  if(raw.byteLength>maxBytes) return {ok:false,reason:'response-too-large'};
  return {ok:true,bytes:raw};
}

export async function fetchBoundedHttps({
  url,
  fetchImpl=fetch,
  maxBytes=64*1024*1024,
  accept='application/octet-stream'
}={}){
  const target=safeHttpsUrl(url);
  if(!target) return {ok:false,reason:'transport-url-invalid'};
  if(!Number.isSafeInteger(maxBytes) || maxBytes<1) return {ok:false,reason:'transport-limit-invalid'};

  let response;
  try{
    response=await fetchImpl(target,{
      method:'GET',
      redirect:'error',
      credentials:'omit',
      referrerPolicy:'no-referrer',
      headers:{accept}
    });
  }catch{
    return {ok:false,reason:'transport-unavailable'};
  }
  if(!response?.ok) return {ok:false,reason:'transport-http-'+String(response?.status||0)};

  const read=await readBounded(response,maxBytes);
  if(!read.ok) return read;
  return {
    ok:true,
    reason:null,
    bytes:read.bytes,
    sha256:await digestHex(read.bytes),
    contentType:response.headers?.get?.('content-type')||null
  };
}

export async function fetchVerifiedBlob({
  url,
  expectedSha256,
  fetchImpl=fetch,
  maxBytes=64*1024*1024,
  accept='application/octet-stream'
}={}){
  if(!SHA256_RE.test(expectedSha256||'')) return {ok:false,reason:'expected-digest-invalid'};
  const fetched=await fetchBoundedHttps({url,fetchImpl,maxBytes,accept});
  if(!fetched.ok) return fetched;
  if(fetched.sha256!==expectedSha256){
    return {ok:false,reason:'transport-digest-mismatch',observedSha256:fetched.sha256};
  }
  return fetched;
}

export async function observeStorageOrigin({
  originId,
  manifestUrl,
  artifactUrl,
  logicalIdentity,
  fetchImpl=fetch,
  manifestMaxBytes=4*1024*1024,
  artifactMaxBytes=64*1024*1024
}={}){
  if(typeof originId!=='string' || originId.trim().length<3) return {ok:false,reason:'origin-id-invalid'};
  if(!logicalIdentity || !SHA256_RE.test(logicalIdentity.manifestSha256||'') || !SHA256_RE.test(logicalIdentity.artifactSha256||'')){
    return {ok:false,reason:'logical-identity-invalid'};
  }

  const manifest=await fetchVerifiedBlob({
    url:manifestUrl,
    expectedSha256:logicalIdentity.manifestSha256,
    fetchImpl,
    maxBytes:manifestMaxBytes,
    accept:'application/json'
  });
  if(!manifest.ok) return {ok:false,reason:'manifest-'+manifest.reason};

  const artifact=await fetchVerifiedBlob({
    url:artifactUrl,
    expectedSha256:logicalIdentity.artifactSha256,
    fetchImpl,
    maxBytes:artifactMaxBytes
  });
  if(!artifact.ok) return {ok:false,reason:'artifact-'+artifact.reason};

  return {
    ok:true,
    reason:null,
    observation:{
      originId:originId.trim(),
      observedManifestSha256:manifest.sha256,
      observedArtifactSha256:artifact.sha256,
      artifactBytes:artifact.bytes.byteLength
    }
  };
}
