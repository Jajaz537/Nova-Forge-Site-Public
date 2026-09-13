[CmdletBinding()]
param()
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$checks = New-Object System.Collections.Generic.List[string]
function Assert-True([bool]$Condition, [string]$Name) {
  if (-not $Condition) { throw "FAIL_SITE_SUPERNOVA_7B: $Name" }
  $checks.Add($Name); Write-Host "PASS $Name"
}
function Read-Text([string]$Path) { [IO.File]::ReadAllText((Join-Path $root $Path)) }

$local = Read-Text 'assets/local-data-control.mjs'
Assert-True ($local.Contains("STORAGE_PREFIXES = ['nova-forge:', 'nova_site_']")) 'privacy-owned-storage-prefixes'
Assert-True ($local.Contains("removeEntry(OPFS_ROOT, {recursive: true})")) 'privacy-opfs-bounded-purge'
Assert-True ($local.Contains('exportedFilesTouched: false')) 'privacy-exported-files-preserved'
Assert-True ($local.Contains('caches.delete')) 'privacy-cache-purge'
Assert-True ($local.Contains('indexedDB.deleteDatabase')) 'privacy-indexeddb-purge'

$workbench = Read-Text 'assets/creator-workbench.mjs'
Assert-True ($workbench.Contains('navigator.storage?.getDirectory')) 'opfs-api-used'
Assert-True ($workbench.Contains('navigator.storage?.estimate')) 'opfs-quota-visible'
Assert-True ($workbench.Contains('LOCAL_STAGE_MAX_BYTES = 64 * 1024 * 1024')) 'opfs-staging-bounded'
Assert-True ($workbench.Contains("state: 'quarantine-local'")) 'creator-upload-quarantine-state'
Assert-True ($workbench.Contains('releaseEligible: false')) 'creator-upload-no-premature-promotion'
Assert-True ($workbench.Contains('BLOCKED_EXTENSIONS')) 'creator-upload-active-types-fail-closed'

$upload = Read-Text 'assets/resumable-upload.mjs'
foreach ($needle in @('transport.status', 'SERVER_OFFSET_NOT_ACKNOWLEDGED', 'maxLifetimeMs', 'chunkSha256', 'WHOLE_OBJECT_DIGEST_MISMATCH', 'PROMOTION_BLOCKED_UNVERIFIED_OBJECT')) {
  Assert-True ($upload.Contains($needle)) ("resumable-" + ($needle -replace '[^a-zA-Z0-9]+','-').Trim('-').ToLowerInvariant())
}

$schema = (Read-Text 'schemas/passkey-recovery.schema.json' | ConvertFrom-Json)
Assert-True ($schema.'$id' -eq 'urn:nova-forge:schemas:passkey-recovery:v1') 'passkey-recovery-schema-id'
Assert-True ($schema.properties.credentialPolicy.properties.multipleCredentialsSupported.const -eq $true) 'passkey-multiple-credentials'
Assert-True ($schema.properties.credentialPolicy.properties.providerLockInAllowed.const -eq $false) 'passkey-provider-lockin-forbidden'
Assert-True ($schema.properties.privateKeyMaterialStoredByNova.const -eq $false) 'passkey-private-key-not-stored'

$shell = Read-Text 'assets/shell.js'
Assert-True ($shell.Contains("import('./creator-workbench.mjs')")) 'shell-loads-creator-workbench'
Assert-True ($shell.Contains("import('./local-data-control.mjs')")) 'shell-loads-local-data-control'
$sw = Read-Text 'sw.js'
Assert-True ($sw.Contains("'./assets/creator-workbench.mjs'")) 'pwa-caches-workbench'
Assert-True ($sw.Contains("'./schemas/passkey-recovery.schema.json'")) 'pwa-caches-recovery-contract'
Assert-True (-not $sw.Contains("'./assets/modaryx-mark.svg'")) 'pwa-no-legacy-brand-assets'

Push-Location $root
try {
  node --check ./assets/local-data-control.mjs
  node --check ./assets/creator-workbench.mjs
  node --check ./assets/resumable-upload.mjs
  node ./eng/site/test-resumable-upload.mjs
  if ($LASTEXITCODE -ne 0) { throw "Node Lot 7B proof failed with exit code $LASTEXITCODE" }
} finally { Pop-Location }

Write-Host ("PASS_TARGETED_SITE_SUPERNOVA_LOT7B_WINDOWS_PROOF checks={0}" -f $checks.Count)
