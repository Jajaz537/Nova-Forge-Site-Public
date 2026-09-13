[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$checks = New-Object System.Collections.Generic.List[string]

function Assert-True {
    param([bool]$Condition, [string]$Name)
    if (-not $Condition) { throw "FAIL_SITE_SUPERNOVA_7A: $Name" }
    $checks.Add($Name)
    Write-Host "PASS $Name"
}

function Read-RepoText([string]$RelativePath) {
    return [IO.File]::ReadAllText((Join-Path $root $RelativePath))
}

$headers = Read-RepoText '_headers'
Assert-True ($headers.Contains('https://getnovaforge.com/')) 'canonical-origin-getnovaforge'
Assert-True (-not $headers.Contains('modaryxmods.com')) 'canonical-origin-no-modaryx'
foreach ($directive in @("default-src 'self'", "script-src 'self'", "object-src 'none'", "base-uri 'none'", "frame-ancestors 'none'", 'upgrade-insecure-requests')) {
    Assert-True ($headers.Contains($directive)) ("csp-" + ($directive -replace '[^a-zA-Z0-9]+','-').Trim('-').ToLowerInvariant())
}
Assert-True ($headers.Contains('Cross-Origin-Opener-Policy: same-origin')) 'coop-same-origin'
Assert-True ($headers.Contains('Cross-Origin-Resource-Policy: same-origin')) 'corp-same-origin'

$manifest = (Read-RepoText 'site.webmanifest' | ConvertFrom-Json)
Assert-True ($manifest.name -like 'Nova Forge*') 'pwa-nova-forge-name'
Assert-True ($manifest.short_name -eq 'Nova Forge') 'pwa-nova-forge-short-name'
$iconSources = @($manifest.icons | ForEach-Object { [string]$_.src })
Assert-True (@($iconSources | Where-Object { $_ -notmatch 'nova-mark' }).Count -eq 0) 'pwa-nova-icons-only'

$sitemap = Read-RepoText 'sitemap.xml'
Assert-True ($sitemap.Contains('https://getnovaforge.com/')) 'sitemap-getnovaforge'
Assert-True (-not $sitemap.Contains('modaryxmods.com')) 'sitemap-no-modaryx'
$robots = Read-RepoText 'robots.txt'
Assert-True ($robots.Contains('Sitemap: https://getnovaforge.com/sitemap.xml')) 'robots-sitemap-canonical'

$favicon = Read-RepoText 'favicon.svg'
Assert-True ($favicon.Contains('aria-label="Nova Forge"')) 'favicon-nova-forge'
Assert-True (-not $favicon.Contains('MODARYX')) 'favicon-no-modaryx'

$shell = Read-RepoText 'assets/shell.js'
Assert-True (-not $shell.Contains('.innerHTML')) 'shell-no-innerhtml-sink'
Assert-True ($shell.Contains('saveData')) 'prefetch-respects-save-data'
Assert-True (($shell -match "'slow-2g'\s*,\s*'2g'") -or ($shell.Contains("'slow-2g'") -and $shell.Contains("'2g'"))) 'prefetch-respects-slow-network'
Assert-True ($shell -match 'url\.origin\s*!==\s*location\.origin') 'prefetch-same-origin-only'
Assert-True ($shell -match 'prefetched\.size\s*>=\s*6') 'prefetch-bounded-count'

$tokens = Read-RepoText 'assets/tokens.css'
Assert-True ($tokens.Contains('@view-transition')) 'view-transition-progressive-contract'
Assert-True ($tokens.Contains('prefers-reduced-motion: reduce')) 'view-transition-reduced-motion-fallback'

$cutover = (Read-RepoText 'domain-cutover.json' | ConvertFrom-Json)
Assert-True ($cutover.canonicalOrigin -eq 'https://getnovaforge.com') 'cutover-canonical-origin'
$status = (Read-RepoText 'public-status.json' | ConvertFrom-Json)
Assert-True ($status.schema -eq 'nova-forge-public-site-status/v1') 'public-status-nova-schema'
Assert-True ($status.principles.fail_closed -eq $true) 'public-status-fail-closed'
Assert-True ($status.runtime.third_party_runtime_dependency_required -eq $false) 'public-status-no-third-party-runtime'

Write-Host ("PASS_TARGETED_SITE_SUPERNOVA_LOT7A_WINDOWS_PROOF checks={0}" -f $checks.Count)
