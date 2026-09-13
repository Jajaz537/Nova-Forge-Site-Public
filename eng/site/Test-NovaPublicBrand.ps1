[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$htmlFiles = @(Get-ChildItem -Path $root -Filter '*.html' -File | Sort-Object Name)
if ($htmlFiles.Count -lt 10) { throw "Expected public HTML surface, got $($htmlFiles.Count) files." }

$checks = 0
foreach ($file in $htmlFiles) {
    $text = [IO.File]::ReadAllText($file.FullName)
    if ($text -match '(?i)modaryx') { throw "Legacy public brand remains in $($file.Name)" }
    if ($text -match 'modaryxmods\.com') { throw "Legacy public domain remains in $($file.Name)" }
    $checks += 2
}

$index = [IO.File]::ReadAllText((Join-Path $root 'index.html'))
foreach ($needle in @('Nova Forge', 'Nova Forge OS', 'Nova Guide', 'https://getnovaforge.com/')) {
    if (-not $index.Contains($needle)) { throw "index.html missing required public identity: $needle" }
    $checks++
}
if ($index.Contains('NOVA FORGE MODS')) { throw 'Invalid doubled legacy/product label remains.' }
$checks++

Write-Host "PASS_TARGETED_NOVA_PUBLIC_BRAND_WORKTREE checks=$checks html=$($htmlFiles.Count)"
