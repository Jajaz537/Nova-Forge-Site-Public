[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$htmlFiles = @(Get-ChildItem -Path $root -Filter '*.html' -File | Sort-Object FullName)
$runtimeFiles = @(Get-ChildItem -Path (Join-Path $root 'assets') -File | Where-Object { $_.Extension -in @('.js','.mjs') } | Sort-Object FullName)
$files = @($htmlFiles + $runtimeFiles)
if ($htmlFiles.Count -eq 0 -or $runtimeFiles.Count -eq 0) { throw 'Public HTML/runtime surface not found.' }

$changed = 0
foreach ($file in $files) {
    $text = [IO.File]::ReadAllText($file.FullName)
    $next = $text
    $next = $next.Replace('https://modaryxmods.com', 'https://getnovaforge.com')
    $next = $next.Replace('modaryx-mark-192.png', 'nova-mark-192.png')
    $next = $next.Replace('modaryx-mark-512.png', 'nova-mark-512.png')
    $next = $next.Replace('modaryx-mark.svg', 'nova-mark.svg')
    $next = [regex]::Replace($next, 'v=modaryx-[A-Za-z0-9._-]+', 'v=nova-forge-20260913', 'IgnoreCase')
    $next = $next.Replace('MODARYX MODS', 'Nova Forge')
    $next = $next.Replace('MODARYX', 'NOVA FORGE')
    $next = $next.Replace('Modaryx OS', 'Nova Forge OS')
    $next = $next.Replace('Modaryx Guide', 'Nova Guide')
    $next = $next.Replace('Modaryx', 'Nova Forge')
    $next = $next.Replace('<div class="guide-orb">M</div>', '<div class="guide-orb">N</div>')
    if ($next -ne $text) {
        [IO.File]::WriteAllText($file.FullName, $next, [Text.UTF8Encoding]::new($false))
        $changed++
        $relative = [IO.Path]::GetRelativePath($root, $file.FullName)
        Write-Host "UPDATED $relative"
    }
}
Write-Host "NOVA_REBRAND_CHANGED_FILES=$changed html=$($htmlFiles.Count) runtime=$($runtimeFiles.Count)"
