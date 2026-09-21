import {observeStorageOrigin} from './storage-transport.mjs';
import {resolveVerifiedStorage,decideRepair} from './storage-repair-engine.mjs';

const SHA256_RE=/^[a-f0-9]{64}$/;

function validIdentity(identity){
  return Boolean(identity && SHA256_RE.test(identity.manifestSha256||'') && SHA256_RE.test(identity.artifactSha256||''));
}

function cleanOrigin(origin){
  if(!origin || typeof origin!=='object') return null;
  if(typeof origin.originId!=='string' || origin.originId.trim().length<3 || origin.originId.trim().length>160) return null;
  return {
    originId:origin.originId.trim(),
    kind:['https','object-storage','mirror','p2p','ipfs'].includes(origin.kind)?origin.kind:'https',
    providerLabel:typeof origin.providerLabel==='string'?origin.providerLabel:null,
    state:['active','degraded','disabled'].includes(origin.state)?origin.state:'disabled',
    mutableAlias:Boolean(origin.mutableAlias),
    manifestUrl:typeof origin.manifestUrl==='string'?origin.manifestUrl:null,
    artifactUrl:typeof origin.artifactUrl==='string'?origin.artifactUrl:null
  };
}

export async function resolveAndPlanRepair({
  logicalIdentity,
  releaseState='active',
  origins=[],
  fetchImpl=fetch,
  manifestMaxBytes=4*1024*1024,
  artifactMaxBytes=64*1024*1024
}={}){
  if(!validIdentity(logicalIdentity)){
    return {
      ok:false,
      reason:'logical-identity-invalid',
      resolution:resolveVerifiedStorage({logicalIdentity,candidates:[]}),
      repair:decideRepair({logicalIdentity,releaseState,resolvedCandidates:[]}),
      observations:[]
    };
  }
  if(!Array.isArray(origins) || origins.length>8){
    return {ok:false,reason:'origin-set-invalid',resolution:null,repair:null,observations:[]};
  }

  if(releaseState==='withdrawn' || releaseState==='revoked'){
    const repair=decideRepair({logicalIdentity,releaseState,resolvedCandidates:[]});
    return {
      ok:true,
      reason:null,
      resolution:null,
      repair,
      observations:[],
      networkSkipped:true
    };
  }

  const normalized=origins.map(cleanOrigin).filter(Boolean);
  const observations=await Promise.all(normalized.map(async origin=>{
    if(origin.state!=='active'){
      return {...origin,ok:false,reason:'origin-not-active'};
    }
    if(origin.mutableAlias){
      return {...origin,ok:false,reason:'mutable-alias-forbidden'};
    }
    if(!origin.manifestUrl || !origin.artifactUrl){
      return {...origin,ok:false,reason:'origin-endpoint-missing'};
    }
    const observed=await observeStorageOrigin({
      originId:origin.originId,
      manifestUrl:origin.manifestUrl,
      artifactUrl:origin.artifactUrl,
      logicalIdentity,
      fetchImpl,
      manifestMaxBytes,
      artifactMaxBytes
    });
    return observed.ok
      ? {...origin,ok:true,reason:null,...observed.observation}
      : {...origin,ok:false,reason:observed.reason};
  }));

  const resolverCandidates=observations.map(item=>({
    originId:item.originId,
    kind:item.kind,
    locator:item.artifactUrl||'unavailable:',
    providerLabel:item.providerLabel,
    state:item.ok?'active':'disabled',
    mutableAlias:item.mutableAlias,
    observedManifestSha256:item.observedManifestSha256,
    observedArtifactSha256:item.observedArtifactSha256
  }));

  const resolution=resolveVerifiedStorage({
    logicalIdentity,
    candidates:resolverCandidates
  });

  const resolvedCandidates=observations.map(item=>({
    originId:item.originId,
    resolutionState:resolution.resolutionState==='verified' && resolution.resolvedOriginId===item.originId ? 'verified' : 'failed',
    verifiedArtifactSha256:resolution.resolutionState==='verified' && resolution.resolvedOriginId===item.originId
      ? resolution.verifiedArtifactSha256
      : null,
    failureReason:item.ok ? (resolution.resolvedOriginId===item.originId?null:'not-selected') : item.reason
  }));

  const repair=decideRepair({
    logicalIdentity,
    releaseState,
    resolvedCandidates
  });

  return {
    ok:true,
    reason:null,
    resolution,
    repair,
    observations:observations.map(item=>({
      originId:item.originId,
      ok:item.ok,
      reason:item.reason,
      observedManifestSha256:item.observedManifestSha256||null,
      observedArtifactSha256:item.observedArtifactSha256||null,
      artifactBytes:Number.isSafeInteger(item.artifactBytes)?item.artifactBytes:null
    })),
    networkSkipped:false
  };
}
