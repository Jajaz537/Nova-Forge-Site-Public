#!/usr/bin/env python3
from hashlib import sha256
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "SHA256SUMS.txt"
paths = []
for line in MANIFEST.read_text(encoding="utf-8").splitlines():
    if line.strip():
        paths.append(line.split(maxsplit=1)[1].lstrip("*"))
for new_path in (
    "./assets/modaryx-home-cinematic.css",
    "./assets/modaryx-cinematic-system.css",
    "./assets/modaryx-realm-canon-hero.png",
    "./assets/modaryx-studio-cinematic-fix.css",
    "./assets/modaryx-search-cinematic-fix.css",
    "./assets/verify-picker.css",
    "./data/integration-readiness.json",
    "./schemas/integration-readiness.schema.json",
):
    if new_path not in paths:
        paths.append(new_path)
missing = [path for path in paths if not (ROOT / path).is_file()]
if missing:
    raise SystemExit("Missing hashed files: " + ", ".join(missing))
lines = [
    f"{sha256((ROOT / path).read_bytes()).hexdigest()}  {path}"
    for path in sorted(paths)
]
MANIFEST.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
print(f"{len(lines)} public file hashes updated")
