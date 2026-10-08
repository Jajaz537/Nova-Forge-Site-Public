const CASE_ID=/^mx_rights_case_[a-f0-9]{32}$/;
const HEX64=/^[a-f0-9]{64}$/;
const MAX_MESSAGE_BYTES=10*1024*1024;
const MAX_HEADERS_BYTES=256*1024;

const bytesOf=value=>{
  if(value instanceof Uint8Array) return value;
  if(value instanceof ArrayBuffer) return new Uint8Array(value);
  if(ArrayBuffer.isView(value)) return new Uint8Array(value.buffer,value.byteOffset,value.byteLength);
  if(typeof value==="string") return new TextEncoder().encode(value);
  return null;
};
const hex=buffer=>[...new Uint8Array(buffer)].map(v=>v.toString(16).padStart(2,"0")).join("");
const sha256Hex=async bytes=>hex(await crypto.subtle.digest("SHA-256",bytes));

export function publisherInboundArchiveReadiness(env={}){
  const binding=env?.MODARYX_INBOUND_ARCHIVE;
  return {
    schemaVersion:1,
    bindingPresent:Boolean(binding),
    writeReady:Boolean(binding&&typeof binding.put==="function"),
    readReady:Boolean(binding&&typeof binding.get==="function"),
    mailbox:false,
    webhookReceiver:false,
    parser:false,
    attachmentScanner:false,
    responseRouter:false,
    productionApproval:"OPEN"
  };
}

export async function archivePublisherInboundCandidate(env,{
  caseId,logicalRequestId,rawMessage,rawHeaders,receivedAt
}={}){
  const ready=publisherInboundArchiveReadiness(env);
  if(!ready.writeReady) return {ok:false,status:503,reason:"inbound-archive-binding-missing"};
  if(!CASE_ID.test(caseId||"")) return {ok:false,status:400,reason:"rights-case-id-invalid"};
  if(typeof logicalRequestId!=="string"||!logicalRequestId.trim()||logicalRequestId.length>180) return {ok:false,status:400,reason:"logical-request-id-invalid"};
  const message=bytesOf(rawMessage);
  const headers=bytesOf(rawHeaders);
  if(!message||message.byteLength===0||message.byteLength>MAX_MESSAGE_BYTES) return {ok:false,status:400,reason:"raw-message-size-invalid"};
  if(!headers||headers.byteLength===0||headers.byteLength>MAX_HEADERS_BYTES) return {ok:false,status:400,reason:"raw-headers-size-invalid"};
  const received=new Date(receivedAt||"");
  if(Number.isNaN(received.getTime())) return {ok:false,status:400,reason:"received-at-invalid"};

  const [rawMessageSha256,rawHeadersSha256,logicalDigest]=await Promise.all([
    sha256Hex(message),sha256Hex(headers),sha256Hex(new TextEncoder().encode(logicalRequestId.trim()))
  ]);
  const base=`v2/rights-inbound/quarantine/${caseId}/${logicalDigest}/${rawMessageSha256}`;
  try{
    await env.MODARYX_INBOUND_ARCHIVE.put(base+"/message.eml",message,{
      httpMetadata:{contentType:"message/rfc822"},
      customMetadata:{
        caseId,logicalRequestDigestSha256:logicalDigest,rawMessageSha256,
        quarantineState:"RAW_MESSAGE_QUARANTINED",receivedAt:received.toISOString()
      }
    });
    await env.MODARYX_INBOUND_ARCHIVE.put(base+"/headers.bin",headers,{
      httpMetadata:{contentType:"application/octet-stream"},
      customMetadata:{
        caseId,logicalRequestDigestSha256:logicalDigest,rawHeadersSha256,
        quarantineState:"RAW_MESSAGE_QUARANTINED",receivedAt:received.toISOString()
      }
    });
    const archiveRefDigestSha256=await sha256Hex(new TextEncoder().encode(base));
    return {
      ok:true,status:201,state:"INBOUND_RECEIVED",quarantineState:"RAW_MESSAGE_QUARANTINED",
      correlationState:"CORRELATION_PENDING",provenanceState:"PROVENANCE_UNVERIFIED",
      interpretationState:"BLOCKED",rawMessageSha256,rawHeadersSha256,archiveRefDigestSha256,
      receivedAt:received.toISOString(),authorizes:false
    };
  }catch{
    return {ok:false,status:503,reason:"inbound-archive-write-failed"};
  }
}

export function evaluatePublisherInboundEvidence({
  correlationMatched=false,knownContactMatch=false,officialDomainMatch=false,
  spf="unknown",dkim="unknown",dmarc="unknown",archivePresent=false,
  attachmentScanRequired=false,attachmentScanPassed=false
}={}){
  const authPass=[spf,dkim,dmarc].every(x=>x==="pass");
  const provenanceVerified=knownContactMatch&&officialDomainMatch&&authPass;
  const attachmentReady=!attachmentScanRequired||attachmentScanPassed;
  const correlationState=correlationMatched?"CORRELATED":"CORRELATION_PENDING";
  const provenanceState=provenanceVerified?"PROVENANCE_VERIFIED":"PROVENANCE_UNVERIFIED";
  const ready=Boolean(archivePresent&&correlationMatched&&provenanceVerified&&attachmentReady);
  return {
    correlationState,provenanceState,
    interpretationState:ready?"READY_FOR_INTERPRETATION":"BLOCKED",
    readyForInterpretation:ready,
    authorizes:false,
    blockers:[
      !archivePresent?"raw-archive-missing":null,
      !correlationMatched?"correlation-missing":null,
      !provenanceVerified?"provenance-unverified":null,
      !attachmentReady?"attachment-scan-pending":null
    ].filter(Boolean)
  };
}

export const publisherInboundNetworkReceiverImplemented=()=>false;
