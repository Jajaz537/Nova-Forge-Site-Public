const productionPwaEnabled = import.meta.env.VITE_MODARYX_PWA_PRODUCTION === "1";

export function isV2PwaProductionEnabled() {
  return productionPwaEnabled;
}

export async function registerV2PwaIfEnabled({
  navigatorRef = globalThis.navigator,
  locationRef = globalThis.location,
} = {}) {
  if (!productionPwaEnabled) return { state: "DISABLED_BY_GATE" };
  if (!navigatorRef || !("serviceWorker" in navigatorRef)) return { state: "UNSUPPORTED" };

  const hostname = locationRef?.hostname || "";
  const protocol = locationRef?.protocol || "";
  const secure = protocol === "https:" || hostname === "localhost" || hostname === "127.0.0.1";
  if (!secure) return { state: "BLOCKED_INSECURE_ORIGIN" };

  const registration = await navigatorRef.serviceWorker.register("/sw-v2.js", {
    scope: "/",
    updateViaCache: "none",
  });
  return { state: "REGISTERED", scope: registration.scope };
}
