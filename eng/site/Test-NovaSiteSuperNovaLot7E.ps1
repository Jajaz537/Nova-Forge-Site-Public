[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$checks = New-Object System.Collections.Generic.List[string]

function Pass([string]$Name) {
    $checks.Add($Name)
    Write-Host "PASS $Name"
}
function Assert-True([bool]$Condition, [string]$Name) {
    if (-not $Condition) { throw "FAIL_SITE_SUPERNOVA_7E: $Name" }
    Pass $Name
}
function Read-RepoText([string]$RelativePath) {
    return [IO.File]::ReadAllText((Join-Path $root $RelativePath))
}

$ledgerPath = Join-Path $root 'governance\SUPER-NOVA-SITE-LOT7E.json'
Assert-True (Test-Path $ledgerPath) 'lot7e-ledger-present'
$ledger = (Get-Content -Raw $ledgerPath | ConvertFrom-Json)
Assert-True ($ledger.schema -eq 'nova-forge-supernova-site-lot7e/v1') 'lot7e-ledger-schema'
Assert-True ($ledger.stage -eq 'pre-vf') 'lot7e-pre-vf-stage'
Assert-True ([int]$ledger.architectureOnlyRemaining -eq 0) 'architecture-only-eliminated'
Assert-True ($ledger.policy.providerNeutral -eq $true) 'provider-neutral'
Assert-True ($ledger.policy.noSilentOverage -eq $true) 'no-silent-overage'
Assert-True ($ledger.policy.failClosed -eq $true) 'fail-closed'
Assert-True ($ledger.policy.noFakeBackend -eq $true) 'no-fake-backend'

$expectedIds = @(
    'site.independent','site.mod-mini-hubs','site.creator-studio','site.universal-mod-manifest',
    'site.compatibility-graph','site.nova-experiences','site.web-smart-profile','site.zero-euro',
    'site.static-first','site.storage-broker','site.hyperscale-storage','site.federation',
    'site.offline-pwa','site.surge-mode','site.abuse-shield','site.moderation','site.dsa',
    'site.trust-vocabulary','site.search','site.media','site.hot-cold-community',
    'site.repair-network','site.passkeys'
)
$ideas = @($ledger.ideas)
Assert-True ($ideas.Count -eq 23) 'exact-23-retained-site-ideas'
$actualIds = @($ideas | ForEach-Object { [string]$_.id })
Assert-True (@($actualIds | Select-Object -Unique).Count -eq 23) 'site-idea-ids-unique'
foreach ($id in $expectedIds) {
    $row = @($ideas | Where-Object { $_.id -eq $id })
    Assert-True ($row.Count -eq 1) ("mapped-" + ($id -replace '\.','-'))
    Assert-True ($row[0].implementationState -eq 'IMPLEMENTED_TECHNICAL_PRE_VF') ("technical-" + ($id -replace '\.','-'))
    Assert-True (@($row[0].evidence).Count -gt 0) ("evidence-" + ($id -replace '\.','-'))
    Assert-True ($row[0].finalState -ne 'ARCHITECTURE_LOCKED_PRE_VF_SITE_BUILD_POST_OS') ("not-architecture-only-" + ($id -replace '\.','-'))
}

$dsa = $ideas | Where-Object { $_.id -eq 'site.dsa' } | Select-Object -First 1
Assert-True ($dsa.finalState -eq 'BLOCKED_EXTERNAL_HUMAN_ENDPOINT') 'dsa-real-human-endpoint-blocker-preserved'
$blockers = @($ledger.finalBlockers)
Assert-True ($blockers.Count -eq 1) 'single-explicit-lot7e-final-blocker'
Assert-True ($blockers[0].state -eq 'BLOCKED_REAL_HUMAN_ENDPOINT_REQUIRED') 'human-endpoint-not-faked'

foreach ($file in @(
    'assets/site-fabric.mjs',
    'schemas/storage-resolver.schema.json',
    'schemas/repair-network.schema.json',
    'schemas/universal-mod-manifest.schema.json',
    'schemas/compatibility-graph.schema.json',
    'schemas/smart-profile.schema.json',
    'schemas/account-security.schema.json',
    'schemas/passkey-recovery.schema.json',
    'assets/moderation-contract.mjs',
    'schemas/moderation-receipt.schema.json',
    'schemas/moderation-export.schema.json',
    'data/search-index.json',
    'assets/search.js',
    'sw.js',
    'site.webmanifest',
    'creator-studio.html',
    'community.html',
    'security/human-complaint-path.json'
)) {
    Assert-True (Test-Path (Join-Path $root $file)) ("evidence-file-" + (($file -replace '[^a-zA-Z0-9]+','-').Trim('-').ToLowerInvariant()))
}

$status = (Read-RepoText 'public-status.json' | ConvertFrom-Json)
Assert-True ($status.stage -eq 'pre-vf') 'public-status-pre-vf'
Assert-True ($status.hosting.mandatory_monthly_budget_eur -eq 0) 'zero-euro-mandatory-budget'
Assert-True ($status.principles.static_first -eq $true) 'static-first-status'
Assert-True ($status.runtime.same_origin_service_worker -eq $true) 'offline-pwa-service-worker'
Assert-True ($status.moderation.human_endpoint_state -eq 'blocked-real-endpoint-required') 'public-status-human-endpoint-blocker'
Assert-True ($status.site_fabric.engine -eq './assets/site-fabric.mjs') 'public-status-site-fabric-engine'
Assert-True ($status.site_fabric.architecture_only_remaining -eq 0) 'public-status-no-architecture-only'
Assert-True ($status.site_fabric.no_silent_overage -eq $true) 'public-status-no-silent-overage'
Assert-True ($status.site_fabric.provider_neutral -eq $true) 'public-status-provider-neutral'

$brandFiles = @(
    Get-ChildItem (Join-Path $root '*.html') -File
    Get-ChildItem (Join-Path $root 'assets') -Include '*.js','*.mjs' -File
)
foreach ($file in $brandFiles) {
    $text = [IO.File]::ReadAllText($file.FullName)
    Assert-True (-not ($text -match '(?i)MODARYX MODS|Modaryx OS|modaryxmods\.com')) ("runtime-brand-" + $file.Name)
}

$node = Get-Command node -ErrorAction Stop
& $node.Source (Join-Path $root 'eng\site\Test-NovaSiteSuperNovaLot7E.mjs')
if ($LASTEXITCODE -ne 0) { throw "FAIL_SITE_SUPERNOVA_7E: node-proof-exit-$LASTEXITCODE" }
Pass 'node-executable-site-fabric-proof'

Write-Host ("PASS_TARGETED_SITE_SUPERNOVA_LOT7E_WINDOWS_PROOF checks={0} ideas=23 architectureOnly=0 humanComplaint=BLOCKED_REAL_HUMAN_ENDPOINT_REQUIRED" -f $checks.Count)
