import {backendState} from "./backend-config.mjs";
import {providerRegistryState} from "./provider-registry.mjs";
import {artifactStorageReadiness} from "./artifact-storage.mjs";
import {cwvRumReadiness} from "./cwv-rum.mjs";
import {evaluateExternalDeliveryReadiness} from "./notification-delivery.mjs";

const REQUIRED_TABLES=[
  "modaryx_v2_games","modaryx_v2_content_types","modaryx_v2_creators","modaryx_v2_teams",
  "modaryx_v2_content_items","modaryx_v2_releases","modaryx_v2_dependencies","modaryx_v2_compatibility_claims",
  "modaryx_v2_file_artifacts","modaryx_v2_collections","modaryx_v2_collection_items","modaryx_v2_modpacks",
  "modaryx_v2_game_profiles","modaryx_v2_search_documents",
  "modaryx_v2_notification_events","modaryx_v2_notification_preferences",
  "modaryx_v2_data_history","modaryx_v2_notification_delivery_outbox","modaryx_v2_notification_destinations",
  "modaryx_v2_rights_cases","modaryx_v2_rights_scope_decisions","modaryx_v2_rights_audit",
  "modaryx_v2_game_support_requests","modaryx_v2_game_support_records",
  "modaryx_v2_rights_contact_evidence","modaryx_v2_rights_response_evidence","modaryx_v2_rights_license_preflight",
  "modaryx_v2_rights_contact_suppressions","modaryx_v2_publisher_outbound_requests",
  "modaryx_v2_publisher_inbound_envelopes","modaryx_v2_rights_authorizing_reviews",
  "modaryx_v2_cwv_samples"
];

export const requiredProductionTables=()=>[...REQUIRED_TABLES];

async function inspectSchema(env){
  const db=env?.MODARYX_DB;
  if(!db||typeof db.prepare!=="function"){
    return {bindingPresent:false,querySucceeded:false,ready:false,requiredCount:REQUIRED_TABLES.length,presentCount:0,missing:[...REQUIRED_TABLES]};
  }
  try{
    const placeholders=REQUIRED_TABLES.map(()=>"?").join(",");
    const result=await db.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name IN (${placeholders})`
    ).bind(...REQUIRED_TABLES).all();
    const present=new Set((result?.results||[]).map(row=>row?.name).filter(Boolean));
    const missing=REQUIRED_TABLES.filter(name=>!present.has(name));
    return {
      bindingPresent:true,querySucceeded:true,ready:missing.length===0,
      requiredCount:REQUIRED_TABLES.length,presentCount:present.size,missing
    };
  }catch{
    return {bindingPresent:true,querySucceeded:false,ready:false,requiredCount:REQUIRED_TABLES.length,presentCount:0,missing:[...REQUIRED_TABLES]};
  }
}

export async function productionReadinessState(env={}){
  const backend=backendState(env);
  const providers=providerRegistryState(env);
  const artifact=artifactStorageReadiness(env);
  const delivery=evaluateExternalDeliveryReadiness(providers);
  const cwv=cwvRumReadiness(env);
  const schema=await inspectSchema(env);

  const backendFoundation=Boolean(
    backend.bindings.d1&&backend.auth0.loginConfigured&&
    backend.turnstile.secretConfigured&&backend.turnstile.siteKeyConfigured
  );
  const artifactReady=Boolean(artifact.readReady&&artifact.writeReady);
  const providerRuntimeReady=Boolean(
    providers.connectors.auth?.configured&&providers.connectors.antiAbuse?.configured&&artifactReady
  );

  return {
    schemaVersion:1,
    status:"PRE_CUTOVER_READINESS_ONLY",
    productionPass:false,
    secretsReturned:false,
    remoteMutationPerformed:false,
    technical:{
      backendFoundation:{ready:backendFoundation,state:backendFoundation?"FOUNDATION_READY":"FOUNDATION_INCOMPLETE"},
      d1Schema:schema,
      auth:{configured:Boolean(providers.connectors.auth?.configured),passkeyEvidence:"OPEN_REAL_DEVICE_PROOF"},
      antiAbuse:{configured:Boolean(providers.connectors.antiAbuse?.configured)},
      artifactStorage:{readReady:artifact.readReady,writeReady:artifact.writeReady,productionApproval:artifact.productionApproval},
      providers:{runtimeCoreReady:providerRuntimeReady,weatherState:providers.connectors.weather?.state||null,productionApproval:providers.productionApproval},
      notifications:{email:delivery.email,push:delivery.push},
      cwv:{
        collectorState:cwv.state,
        enabled:Boolean(cwv.enabled),
        fieldEvidence:cwv.fieldEvidence,
        productionP75:"OPEN_REAL_TRAFFIC_REQUIRED"
      },
      pwa:{state:"OPEN_PRODUCTION_BUILD_AND_ORIGIN_PROOF"},
      cutover:{state:"OPEN_EXPLICIT_RELEASE_ACTION_REQUIRED"}
    },
    blockerHints:{
      "backend-real":backendFoundation&&schema.ready?"TECHNICAL_PRECONDITIONS_MET_PRODUCTION_ORIGIN_PROOF_REQUIRED":"OPEN_PRECONDITIONS",
      "auth-passkeys-real":providers.connectors.auth?.configured?"OPEN_REAL_DEVICE_PASSKEY_PROOF":"OPEN_AUTH_CONFIG",
      "real-data-history":schema.ready?"OPEN_REAL_DATA_PIPELINE_AND_HISTORY_PROOF":"OPEN_REMOTE_SCHEMA",
      "providers-connectors-real":providerRuntimeReady?"OPEN_PROVIDER_PRODUCTION_APPROVAL_AND_REAL_TRAFFIC_PROOF":"OPEN_RUNTIME_CONNECTORS",
      "notifications-email-push-real":delivery.email.available&&delivery.push.available?"OPEN_REAL_DELIVERY_PROOF":"OPEN_PROVIDER_AND_DELIVERY",
      "pwa-service-worker-production":"OPEN_PRODUCTION_ACTIVATION_PROOF",
      "core-web-vitals-production":"OPEN_REAL_TRAFFIC_P75_PROOF",
      "cutover":"OPEN_EXPLICIT_CUTOVER"
    }
  };
}
