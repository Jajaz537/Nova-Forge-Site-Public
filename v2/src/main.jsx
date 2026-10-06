import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./premium-editorial.css";
import "./product-blue-violet.css";
import { migrateLegacyBrowserState } from "./storage-migration.js";
import { registerV2PwaIfEnabled } from "./pwa-registration.js";
import { startFieldCwvCollection } from "./cwv-rum.js";

try {
  migrateLegacyBrowserState(window.localStorage);
} catch {
  // Browser storage can be denied; the app must remain usable and migration stays unclaimed.
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Production PWA activation stays opt-in until the cutover gate is explicitly lifted.
void registerV2PwaIfEnabled().catch(() => {
  // Offline support is fail-soft; registration failure must not break the product shell.
});


// Field CWV RUM remains doubly gated: the Vite flag and the server-side MODARYX_CWV_RUM_ENABLED binding must both be enabled.
// Default builds collect nothing and the production p75 blocker remains OPEN until real traffic evidence exists.
try {
  startFieldCwvCollection({
    enabled: import.meta.env.VITE_MODARYX_FIELD_CWV === "1",
    endpoint: "/api/v1/rum/cwv",
  });
} catch {
  // Observability must never break the product shell.
}
