[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$htmlFiles = @(Get-ChildItem -Path $root -Filter '*.html' -File -Recurse | Where-Object { $_.FullName -notmatch '[\\/]\.git[\\/]' } | Sort-Object FullName)
$runtimeFiles = @(Get-ChildItem -Path (Join-Path $root 'assets') -File | Where-Object { $_.Extension -in @('.js','.mjs') } | Sort-Object FullName)
$jsonFiles = @(
    Get-ChildItem -Path $root -Filter '*.json' -File
    Get-ChildItem -Path (Join-Path $root 'data') -Filter '*.json' -File
    Get-ChildItem -Path (Join-Path $root 'schemas') -Filter '*.json' -File
    Get-ChildItem -Path (Join-Path $root 'security') -Filter '*.json' -File
) | Sort-Object FullName -Unique
if ($htmlFiles.Count -lt 15) { throw "Expected expanded public HTML surface, got $($htmlFiles.Count) files." }
if ($runtimeFiles.Count -lt 10) { throw "Expected public runtime surface, got $($runtimeFiles.Count) files." }
if ($jsonFiles.Count -lt 10) { throw "Expected public JSON surface, got $($jsonFiles.Count) files." }

$checks = 0
foreach ($file in @($htmlFiles + $runtimeFiles + $jsonFiles)) {
    $text = [IO.File]::ReadAllText($file.FullName)
    $relative = [IO.Path]::GetRelativePath($root, $file.FullName)
    if ($text -match '(?i)modaryx') { throw "Legacy public brand remains in $relative" }
    if ($text -match '(?i)modaryxmods\.com') { throw "Legacy public domain remains in $relative" }
    $checks += 2
}

$index = [IO.File]::ReadAllText((Join-Path $root 'index.html'))
foreach ($needle in @('Nova Forge', 'Nova Forge OS', 'Nova Guide', 'https://getnovaforge.com/')) {
    if (-not $index.Contains($needle)) { throw "index.html missing required public identity: $needle" }
    $checks++
}
if ($index.Contains('NOVA FORGE MODS')) { throw 'Invalid doubled legacy/product label remains.' }
$checks++

Write-Host "PASS_TARGETED_NOVA_PUBLIC_BRAND_WORKTREE checks=$checks html=$($htmlFiles.Count) runtime=$($runtimeFiles.Count) json=$($jsonFiles.Count)"
