[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$checks = New-Object System.Collections.Generic.List[string]
function Assert-True([bool]$Condition,[string]$Name){if(-not $Condition){throw "FAIL_SITE_SUPERNOVA_8B: $Name"};$checks.Add($Name);Write-Host "PASS $Name"}

$indexPath = Join-Path $root 'index.html'
$index = [IO.File]::ReadAllText($indexPath)
Assert-True ($index.Contains('href="./assets/game-hub.css"')) 'home-game-hub-stylesheet'
Assert-True ($index.Contains('<a href="./games/">Jeux</a>')) 'home-primary-nav-games'
Assert-True ($index.Contains('id="games"')) 'home-featured-games-section'
Assert-True ($index.Contains('href="./gta-6/"')) 'home-gta6-link'
Assert-True ($index.Contains('href="./red-dead-redemption-2/"')) 'home-rdr2-link'
Assert-True ($index.Contains('href="./games/"')) 'home-all-games-link'
Assert-True ($index.Contains('Zéro faux catalogue')) 'home-no-fake-catalogue-copy'
Assert-True ($index.Contains('0 mod public vérifié')) 'home-zero-verified-mods-copy'

$trustIndex = $index.IndexOf('<div class="trust-rail"', [StringComparison]::Ordinal)
$gamesIndex = $index.IndexOf('<section class="game-section home-games-stage" id="games"', [StringComparison]::Ordinal)
$osIndex = $index.IndexOf('<section class="editions" id="os"', [StringComparison]::Ordinal)
Assert-True ($trustIndex -ge 0 -and $gamesIndex -gt $trustIndex -and $osIndex -gt $gamesIndex) 'home-order-trust-games-os-preserved'

$gamesSectionEnd = $index.IndexOf('</section>', $gamesIndex, [StringComparison]::Ordinal)
Assert-True ($gamesSectionEnd -gt $gamesIndex) 'home-games-section-bounded'
$gamesSection = $index.Substring($gamesIndex, $gamesSectionEnd - $gamesIndex + 10)
Assert-True (-not ($gamesSection -match '(?i)href\s*=\s*["''][^"'']*(downloads|\.exe)')) 'home-games-no-download-link'
Assert-True (-not ($gamesSection -match '(?i)modaryx')) 'home-games-no-legacy-brand'

$rootHtml = @(Get-ChildItem -Path $root -Filter '*.html' -File | Sort-Object Name)
$navFiles = New-Object System.Collections.Generic.List[string]
foreach ($file in $rootHtml) {
    $text = [IO.File]::ReadAllText($file.FullName)
    $navMatch = [regex]::Match($text, '<nav\b[^>]*aria-label="Navigation principale"[^>]*>[\s\S]*?</nav>', 'IgnoreCase')
    if (-not $navMatch.Success) { continue }
    $navFiles.Add($file.Name)
    Assert-True ($navMatch.Value -match '(?i)href="(?:\./|/)games/"') ("root-nav-games-" + ($file.BaseName -replace '[^a-zA-Z0-9]+','-'))
}
Assert-True ($navFiles.Count -ge 8) 'root-nav-surface-count'

foreach ($path in @('games\index.html','gta-6\index.html','gta-6\mods\index.html','red-dead-redemption-2\index.html','red-dead-redemption-2\mods\index.html')) {
    Assert-True (Test-Path (Join-Path $root $path)) ("game-surface-present-" + (($path -replace '[^a-zA-Z0-9]+','-').Trim('-')))
}

pwsh -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root 'eng\site\Test-NovaPublicBrand.ps1')
if ($LASTEXITCODE -ne 0) { throw "FAIL_SITE_SUPERNOVA_8B: public-brand-proof-exit-$LASTEXITCODE" }
$checks.Add('public-brand-proof')
Write-Host ("PASS_TARGETED_SITE_SUPERNOVA_LOT8B_WINDOWS_PROOF checks={0} rootNav={1} featuredGames=2" -f $checks.Count,$navFiles.Count)
