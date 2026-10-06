import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./premium-editorial.css";
import "./product-blue-violet.css";
import { migrateLegacyBrowserState } from "./storage-migration.js";
import { registerV2PwaIfEnabled } from "./pwa-registration.js";

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
