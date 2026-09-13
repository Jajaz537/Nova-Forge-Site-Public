const STORAGE_KEY = 'nova-forge:vitals-session:v1';
const targets = { lcpMs: 2500, inpMs: 200, cls: 0.1 };
let lcpMs = null;
let maxClsWindow = 0;
let currentClsWindow = 0;
let clsWindowStart = 0;
let lastClsTime = 0;
const interactions = new Map();

function persist() {
  try {
    const durations = [...interactions.values()].sort((a, b) => a - b);
    let inpMs = null;
    if (durations.length) {
      const rank = Math.max(0, Math.ceil(durations.length * 0.98) - 1);
      inpMs = durations[Math.min(rank, durations.length - 1)];
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      schema: 'nova-forge-vitals-session/v1',
      measuredAt: new Date().toISOString(),
      localSessionOnly: true,
      remoteTelemetrySent: false,
      fieldP75Claimed: false,
      values: { lcpMs, inpMs, cls: Number(maxClsWindow.toFixed(4)) },
      targets
    }));
  } catch {}
}

function observeLcp() {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) { lcpMs = Math.round(last.startTime); persist(); }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}
}

function observeCls() {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        const t = entry.startTime;
        if (!clsWindowStart || t - lastClsTime > 1000 || t - clsWindowStart > 5000) {
          clsWindowStart = t;
          currentClsWindow = entry.value;
        } else {
          currentClsWindow += entry.value;
        }
        lastClsTime = t;
        maxClsWindow = Math.max(maxClsWindow, currentClsWindow);
      }
      persist();
    });
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch {}
}

function observeInp() {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.interactionId) continue;
        interactions.set(entry.interactionId, Math.max(interactions.get(entry.interactionId) || 0, entry.duration));
      }
      persist();
    });
    observer.observe({ type: 'event', buffered: true, durationThreshold: 40 });
  } catch {}
}

if (typeof PerformanceObserver !== 'undefined') {
  observeLcp();
  observeCls();
  observeInp();
  addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') persist();
  });
}
