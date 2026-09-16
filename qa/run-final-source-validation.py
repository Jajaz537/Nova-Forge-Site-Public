#!/usr/bin/env python3
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QA = ROOT / "qa"
scripts = sorted(
    [
        *QA.glob("check-*.cjs"),
        *QA.glob("check-*.mjs"),
        *QA.glob("check-*.py"),
    ],
    key=lambda path: path.name,
)
results = []
for script in scripts:
    command = ["node", str(script)] if script.suffix in {".cjs", ".mjs"} else [sys.executable, str(script)]
    completed = subprocess.run(command, cwd=ROOT, text=True, capture_output=True, timeout=90, check=False)
    results.append(
        {
            "script": str(script.relative_to(ROOT)),
            "exitCode": completed.returncode,
            "stdout": completed.stdout,
            "stderr": completed.stderr,
        }
    )
report = {
    "executedAt": datetime.now(timezone.utc).isoformat(),
    "scope": "All current check-* source scripts; browser, physical-device and external-service claims excluded",
    "scripts": len(results),
    "passed": sum(item["exitCode"] == 0 for item in results),
    "failed": [item["script"] for item in results if item["exitCode"] != 0],
    "results": results,
}
(QA / "final-source-validation.json").write_text(
    json.dumps(report, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
    newline="\n",
)
print(json.dumps({key: report[key] for key in ("executedAt", "scope", "scripts", "passed", "failed")}, ensure_ascii=False, indent=2))
raise SystemExit(bool(report["failed"]))
