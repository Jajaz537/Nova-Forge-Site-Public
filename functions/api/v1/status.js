import {backendState} from '../../_lib/backend-config.mjs';

const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer'
  }
});

export async function onRequestGet(context) {
  const state = backendState(context.env || {});
  return json({
    schemaVersion: 1,
    service: 'modaryx-backend',
    stage: state.stage,
    bindings: state.bindings,
    auth0: state.auth0,
    turnstile: state.turnstile,
    remoteWritesReady: state.remoteWritesReady,
    guarantees: {
      secretsReturned: false,
      productionEnabledByThisEndpoint: false
    }
  });
}
