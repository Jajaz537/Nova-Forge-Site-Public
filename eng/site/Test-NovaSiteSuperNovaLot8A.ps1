[CmdletBinding()]
param()
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$checks = New-Object System.Collections.Generic.List[string]
function Assert-True([bool]$Condition,[string]$Name){if(-not $Condition){throw "FAIL_SITE_SUPERNOVA_8A: $Name"};$checks.Add($Name);Write-Host "PASS $Name"}
function Read-Text([string]$Path){[IO.File]::ReadAllText((Join-Path $root $Path))}

$pages = @{
  'games/index.html'='https://getnovaforge.com/games/'
  'gta-6/index.html'='https://getnovaforge.com/gta-6/'
  'gta-6/mods/index.html'='https://getnovaforge.com/gta-6/mods/'
  'red-dead-redemption-2/index.html'='https://getnovaforge.com/red-dead-redemption-2/'
  'red-dead-redemption-2/mods/index.html'='https://getnovaforge.com/red-dead-redemption-2/mods/'
}
foreach($entry in $pages.GetEnumerator()){
  $full=Join-Path $root $entry.Key
  Assert-True (Test-Path $full) ("page-exists-" + ($entry.Key -replace '[^a-zA-Z0-9]+','-').Trim('-'))
  $text=[IO.File]::ReadAllText($full)
  Assert-True ($text.Contains('<title>') -and $text.Contains('Nova Forge')) ("page-nova-title-" + ($entry.Key -replace '[^a-zA-Z0-9]+','-').Trim('-'))
  Assert-True ($text.Contains(('rel="canonical" href="{0}"' -f $entry.Value))) ("canonical-" + ($entry.Key -replace '[^a-zA-Z0-9]+','-').Trim('-'))
  Assert-True (-not ($text -match '(?i)modaryx|modaryxmods\.com')) ("no-legacy-brand-" + ($entry.Key -replace '[^a-zA-Z0-9]+','-').Trim('-'))
  Assert-True (-not ($text -match '(?i)href\s*=\s*["''][^"'']*(downloads|\.exe)')) ("no-distribution-link-" + ($entry.Key -replace '[^a-zA-Z0-9]+','-').Trim('-'))
}

$gtaMods=Read-Text 'gta-6/mods/index.html'
$rdrMods=Read-Text 'red-dead-redemption-2/mods/index.html'
foreach($pair in @(@('gta6',$gtaMods),@('rdr2',$rdrMods))){
  Assert-True ($pair[1] -match '>0<') ("zero-public-mods-"+$pair[0])
  Assert-True ($pair[1].Contains('Prévue · non publiée')) ("planned-categories-not-published-"+$pair[0])
  Assert-True (-not ($pair[1] -match '(?i)href=["''][^"'']*/(textures|gameplay|tools|visual|vehicles|utilitaires)/')) ("no-empty-category-links-"+$pair[0])
}

$registry=(Read-Text 'data/game-hubs.json'|ConvertFrom-Json)
Assert-True ($registry.schemaVersion -eq 1 -and $registry.stage -eq 'pre-vf') 'game-registry-v1-pre-vf'
Assert-True ($registry.policy.noFakeCatalogVolume -eq $true) 'policy-no-fake-volume'
Assert-True ($registry.policy.unknownCompatibilityStaysUnknown -eq $true) 'policy-unknown-stays-unknown'
Assert-True ($registry.policy.emptySeoCategoryPagesForbidden -eq $true) 'policy-no-empty-seo-pages'
Assert-True ($registry.policy.verifiedArtifactRequiredForDownload -eq $true) 'policy-verified-artifact-required'
$games=@($registry.games)
$expected=@('gta-6','red-dead-redemption-2','skyrim-se','cyberpunk-2077','minecraft')
Assert-True ($games.Count -eq 5) 'exact-five-game-registry-entries'
foreach($id in $expected){Assert-True (@($games|Where-Object id -eq $id).Count -eq 1) ("registry-"+$id)}
Assert-True (@($games|Where-Object {$_.distributionAvailable -ne $false}).Count -eq 0) 'all-distribution-fail-closed'
Assert-True (($games|Where-Object id -eq 'gta-6').publicModsPublished -eq 0) 'gta6-zero-public-mods-registry'
Assert-True (($games|Where-Object id -eq 'red-dead-redemption-2').publicModsPublished -eq 0) 'rdr2-zero-public-mods-registry'

$schema=Read-Text 'schemas/game-hubs.schema.json'
Assert-True ($schema.Contains('urn:nova-forge:schemas:game-hubs:v1')) 'game-hubs-schema-id'
Assert-True ($schema.Contains('"distributionAvailable": {"const": false}')) 'schema-distribution-fail-closed'

$sitemap=Read-Text 'sitemap.xml'
foreach($url in $pages.Values){Assert-True ($sitemap.Contains("<loc>$url</loc>")) ("sitemap-"+($url -replace 'https://getnovaforge.com/','' -replace '[^a-zA-Z0-9]+','-').Trim('-'))}
$search=(Read-Text 'data/search-index.json'|ConvertFrom-Json)
$searchIds=@($search.entries|ForEach-Object {$_.id})
foreach($id in @('page:games','page:gta-6','page:gta-6-mods','page:red-dead-redemption-2','page:red-dead-redemption-2-mods')){Assert-True ($searchIds -contains $id) ("search-index-"+($id -replace ':','-'))}

pwsh -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root 'eng\site\Test-NovaPublicBrand.ps1')
if($LASTEXITCODE -ne 0){throw "FAIL_SITE_SUPERNOVA_8A: public-brand-proof-exit-$LASTEXITCODE"}
$checks.Add('public-brand-proof')
Write-Host ("PASS_TARGETED_SITE_SUPERNOVA_LOT8A_WINDOWS_PROOF checks={0} hubs=5 publicMods=0" -f $checks.Count)
