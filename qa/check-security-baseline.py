#!/usr/bin/env python3
"""Deterministic source security gate for the static MODARYX surface.

This gate does not claim Cloudflare, browser, network, or server-side validation.
"""

from html.parser import HTMLParser
from pathlib import Path
import json
import re


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_PAGES = sorted(ROOT.glob("*.html")) + sorted((ROOT / "games").glob("*.html"))
EXPECTED_CSP = {
    "default-src": "'self'",
    "script-src": "'self'",
    "style-src": "'self'",
    "img-src": "'self' data:",
    "connect-src": "'self'",
    "worker-src": "'self'",
    "manifest-src": "'self'",
    "object-src": "'none'",
    "base-uri": "'none'",
    "form-action": "'none'",
    "frame-src": "'none'",
}


class SecurityPage(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.csp = None
        self.inline_script = False
        self.inline_style = False
        self.event_handlers = []
        self.style_attributes = []
        self._script_without_src = False
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "meta" and values.get("http-equiv", "").lower() == "content-security-policy":
            self.csp = values.get("content")
        if tag == "script" and not values.get("src"):
            self._script_without_src = True
        if tag == "style":
            self.inline_style = True
        for key in values:
            if key.lower().startswith("on"):
                self.event_handlers.append(key)
            if key.lower() == "style":
                self.style_attributes.append(key)

    def handle_endtag(self, tag):
        if tag == "script":
            self._script_without_src = False

    def handle_data(self, data):
        if self._script_without_src and data.strip():
            self.inline_script = True


def parse_csp(value):
    directives = {}
    for chunk in (value or "").split(";"):
        parts = chunk.strip().split(None, 1)
        if parts:
            directives[parts[0]] = parts[1] if len(parts) == 2 else ""
    return directives


errors = []
page_results = []
for path in PUBLIC_PAGES:
    parser = SecurityPage(path.read_text(encoding="utf-8"))
    relative = str(path.relative_to(ROOT))
    directives = parse_csp(parser.csp)
    missing = [name for name, value in EXPECTED_CSP.items() if directives.get(name) != value]
    page_errors = []
    if missing:
        page_errors.append("CSP manquante ou différente: " + ", ".join(missing))
    if parser.inline_script:
        page_errors.append("script inline")
    if parser.inline_style or parser.style_attributes:
        page_errors.append("style inline")
    if parser.event_handlers:
        page_errors.append("gestionnaire événement inline")
    errors.extend(f"{relative}: {message}" for message in page_errors)
    page_results.append({"page": relative, "errors": page_errors})

javascript = "\n".join(path.read_text(encoding="utf-8") for path in [*sorted((ROOT / "assets").glob("*.js")), ROOT / "sw.js"])
for sink in (r"\.innerHTML\s*=", r"\.outerHTML\s*=", r"insertAdjacentHTML\s*\(", r"document\.write\s*\(", r"\beval\s*\(", r"new\s+Function\s*\("):
    if re.search(sink, javascript):
        errors.append(f"Sink DOM/JS interdit détecté: {sink}")

cutover = (ROOT / ".github/workflows/cloudflare-modaryx-cutover.yml").read_text(encoding="utf-8")
http3 = (ROOT / ".github/workflows/cloudflare-modaryx-http3-off.yml").read_text(encoding="utf-8")
workflow_findings = []
if "actions/checkout@v4" in cutover:
    workflow_findings.append("MOYENNE: actions/checkout utilise le tag mutable v4")
if 'github.event_name }}" != "workflow_dispatch"' not in cutover or '"$mode" != "status"' not in cutover:
    workflow_findings.append("MOYENNE: le workflow cutover ne refuse pas explicitement les modes mutatifs sur push")
if re.search(r"(?m)^\s+push:\s*$", http3):
    workflow_findings.append("MOYENNE: la désactivation HTTP/3 peut être déclenchée par push sur main")

server_surfaces = [
    path for path in ROOT.rglob("*")
    if path.is_file()
    and ".git" not in path.parts
    and (path.name == "_worker.js" or any(part in {"functions", "workers", "api"} for part in path.parts))
]

report = {
    "result": "PASS" if not errors else "FAIL",
    "scope": "Static source gate only; Cloudflare account, native browser, TLS origin and external services excluded",
    "publicPages": len(PUBLIC_PAGES),
    "pages": page_results,
    "dangerousDomSinks": 0 if not any("Sink DOM/JS" in error for error in errors) else None,
    "serverRuntimeFiles": [str(path.relative_to(ROOT)) for path in server_surfaces],
    "serverInjectionSurface": "NON APPLICABLE in current repository" if not server_surfaces else "REVIEW REQUIRED",
    "workflowFindings": workflow_findings,
    "errors": errors,
}
(ROOT / "qa/security-baseline-checks.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
print(json.dumps({key: report[key] for key in ("result", "scope", "publicPages", "dangerousDomSinks", "serverRuntimeFiles", "workflowFindings", "errors")}, ensure_ascii=False, indent=2))
raise SystemExit(bool(errors))
