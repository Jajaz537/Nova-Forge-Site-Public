const SHA256_RE=/^[a-f0-9]{64}$/;

function validIdentity(identity){
  return Boolean(
    identity &&
    SHA256_RE.test(identity.manifestSha256||'') &&
    SHA256_RE.test(identity.artifactSha256||'')
  );
}

function cleanOriginId(value){
  return typeof value==='string' && value.trim().length>=3 && value.trim().length<=160
    ? value.trim()
    : null;
}

export function resolveVerifiedStorage({
  logicalIdentity,
  storageClass='hot',
  candidates=[]
}={}){
  if(!validIdentity(logicalIdentity)){
    return {
      schemaVersion:1,
      logicalIdentity:logicalIdentity||{manifestSha256:'',artifactSha256:''},
      storageClass,
      origins:[],
      verificationPolicy:{
        digestVerificationRequired:true,
        manifestBindingRequired:true,
        rejectDigestMismatch:true,
        rejectUntrustedMutableAlias:true
      },
      resolutionState:'failed',
      failureReason:'logical-identity-invalid'
    };
  }

  const origins=[];
  let verified=null;
  let sawDigestMismatch=false;
  let sawManifestMismatch=false;

  for(const candidate of Array.isArray(candidates)?candidates:[]){
    const originId=cleanOriginId(candidate?.originId);
    if(!originId) continue;

    const state=['active','degraded','disabled'].includes(candidate.state)?candidate.state:'disabled';
    const mutableAlias=Boolean(candidate.mutableAlias);
    origins.push({
      originId,
      kind:['https','object-storage','mirror','p2p','ipfs'].includes(candidate.kind)?candidate.kind:'https',
      locator:typeof candidate.locator==='string'&&candidate.locator?candidate.locator:'unavailable:',
      state,
      mutableAlias,
      providerLabel:typeof candidate.providerLabel==='string'?candidate.providerLabel:null
    });

    if(verified || state!=='active' || mutableAlias) continue;
    if(candidate.observedManifestSha256!==logicalIdentity.manifestSha256){
      sawManifestMismatch=true;
      continue;
    }
    if(candidate.observedArtifactSha256!==logicalIdentity.artifactSha256){
      sawDigestMismatch=true;
      continue;
    }

    verified={originId,verifiedArtifactSha256:logicalIdentity.artifactSha256};
  }

  const base={
    schemaVersion:1,
    logicalIdentity:{...logicalIdentity},
    storageClass:['hot','cold'].includes(storageClass)?storageClass:'hot',
    origins,
    verificationPolicy:{
      digestVerificationRequired:true,
      manifestBindingRequired:true,
      rejectDigestMismatch:true,
      rejectUntrustedMutableAlias:true
    }
  };

  if(verified){
    return {
      ...base,
      resolutionState:'verified',
      resolvedOriginId:verified.originId,
      verifiedArtifactSha256:verified.verifiedArtifactSha256
    };
  }

  const failureReason=sawDigestMismatch
    ? 'artifact-digest-mismatch'
    : sawManifestMismatch
      ? 'manifest-binding-mismatch'
      : 'no-verified-origin';

  return {...base,resolutionState:'failed',failureReason};
}

export function decideRepair({
  logicalIdentity,
  releaseState='active',
  resolvedCandidates=[]
}={}){
  const safeIdentity=validIdentity(logicalIdentity)
    ? {...logicalIdentity}
    : {manifestSha256:'',artifactSha256:''};

  const base={
    schemaVersion:1,
    logicalIdentity:safeIdentity,
    releaseState:['active','withdrawn','revoked'].includes(releaseState)?releaseState:'revoked',
    repairPolicy:{
      resolverVerificationRequired:true,
      digestMatchRequired:true,
      manifestBindingRequired:true,
      silentSubstitutionForbidden:true,
      revokedDistributionForbidden:true,
      mutableAliasTrustForbidden:true
    },
    candidateOrigins:[]
  };

  if(!validIdentity(logicalIdentity)){
    return {...base,result:{state:'digest-mismatch',distributable:false,reason:'logical-identity-invalid'}};
  }

  if(releaseState==='withdrawn'){
    return {...base,result:{state:'release-withdrawn',distributable:false,reason:'release-withdrawn'}};
  }
  if(releaseState==='revoked'){
    return {...base,result:{state:'release-revoked',distributable:false,reason:'release-revoked'}};
  }

  let exact=null;
  let mismatch=false;
  for(const candidate of Array.isArray(resolvedCandidates)?resolvedCandidates:[]){
    const originId=cleanOriginId(candidate?.originId);
    if(!originId) continue;
    const resolutionState=['unresolved','verified','failed'].includes(candidate.resolutionState)
      ? candidate.resolutionState
      : 'failed';
    const digest=SHA256_RE.test(candidate.verifiedArtifactSha256||'')
      ? candidate.verifiedArtifactSha256
      : null;
    const failureReason=typeof candidate.failureReason==='string' ? candidate.failureReason : null;
    base.candidateOrigins.push({
      originId,
      resolutionState,
      verifiedArtifactSha256:digest,
      failureReason
    });

    if(resolutionState==='verified'){
      if(digest===logicalIdentity.artifactSha256 && !exact){
        exact={originId,digest};
      }else if(digest!==logicalIdentity.artifactSha256){
        mismatch=true;
      }
    }
  }

  if(exact){
    return {
      ...base,
      result:{
        state:'repaired',
        distributable:true,
        selectedOriginId:exact.originId,
        verifiedArtifactSha256:exact.digest
      }
    };
  }

  if(mismatch){
    return {...base,result:{state:'digest-mismatch',distributable:false,reason:'verified-copy-digest-mismatch'}};
  }

  return {...base,result:{state:'no-verified-copy',distributable:false,reason:'no-exact-verified-copy'}};
}
