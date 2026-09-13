[CmdletBinding()]
param()
Set-StrictMode -Version Latest
$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$checks=New-Object System.Collections.Generic.List[string]
function Assert-True([bool]$Condition,[string]$Name){if(-not $Condition){throw "FAIL_SITE_SUPERNOVA_8C: $Name"};$checks.Add($Name);Write-Host "PASS $Name"}
$registry=(Get-Content -Raw (Join-Path $root 'data\seo-surfaces.json')|ConvertFrom-Json)
Assert-True ($registry.schemaVersion -eq 1) 'seo-registry-v1'
Assert-True ($registry.structuredDataMode -eq 'html-microdata-csp-safe') 'structured-data-csp-safe-microdata'
Assert-True ($registry.emptyCategoryPagesAllowed -eq $false) 'empty-category-pages-forbidden'
$surfaces=@($registry.surfaces)
Assert-True ($surfaces.Count -eq 9) 'exact-nine-seo-surfaces'
Assert-True (@($surfaces|Where-Object {$_.indexable -eq $true}).Count -eq 6) 'six-indexable-substantive-surfaces'
Assert-True (@($surfaces|Where-Object {$_.indexable -eq $false}).Count -eq 3) 'three-noindex-demo-previews'
foreach($surface in $surfaces){
  $path=Join-Path $root ([string]$surface.path)
  Assert-True (Test-Path $path) ('seo-file-'+(($surface.path -replace '[^a-zA-Z0-9]+','-').Trim('-')))
  $text=[IO.File]::ReadAllText($path)
  $canonical=[regex]::Escape([string]$surface.canonical)
  $canonicalPattern='<link\s+rel="canonical"\s+href="'+$canonical+'">'
  Assert-True ([regex]::Matches($text,$canonicalPattern,[Text.RegularExpressions.RegexOptions]::IgnoreCase).Count -eq 1) ('canonical-'+(($surface.path -replace '[^a-zA-Z0-9]+','-').Trim('-')))
  Assert-True ($text.Contains(('property="og:url" content="{0}"' -f $surface.canonical))) ('og-url-'+(($surface.path -replace '[^a-zA-Z0-9]+','-').Trim('-')))
  $expectedRobots=if($surface.indexable -eq $true){'index,follow,max-image-preview:large'}else{'noindex,follow'}
  Assert-True ($text.Contains(('name="robots" content="{0}"' -f $expectedRobots))) ('robots-'+(($surface.path -replace '[^a-zA-Z0-9]+','-').Trim('-')))
  Assert-True ($text.Contains(('itemscope itemtype="https://schema.org/{0}"' -f $surface.type))) ('microdata-type-'+(($surface.path -replace '[^a-zA-Z0-9]+','-').Trim('-')))
  Assert-True ($text -match '<h1\b[^>]*itemprop="name"') ('microdata-name-'+(($surface.path -replace '[^a-zA-Z0-9]+','-').Trim('-')))
  Assert-True ($text.Contains('itemprop="description"')) ('microdata-description-'+(($surface.path -replace '[^a-zA-Z0-9]+','-').Trim('-')))
  Assert-True (-not ($text -match 'application/ld\+json')) ('no-inline-jsonld-'+(($surface.path -replace '[^a-zA-Z0-9]+','-').Trim('-')))
}
$sitemap=[IO.File]::ReadAllText((Join-Path $root 'sitemap.xml'))
foreach($surface in @($surfaces|Where-Object {$_.indexable -eq $true})){Assert-True ($sitemap.Contains(('<loc>{0}</loc>' -f $surface.canonical))) ('sitemap-indexable-'+(($surface.path -replace '[^a-zA-Z0-9]+','-').Trim('-')))}
foreach($surface in @($surfaces|Where-Object {$_.indexable -eq $false})){Assert-True (-not $sitemap.Contains(('<loc>{0}</loc>' -f $surface.canonical))) ('sitemap-excludes-demo-'+(($surface.path -replace '[^a-zA-Z0-9]+','-').Trim('-')))}
Assert-True (-not ($sitemap -match '/(?:category|categories)/')) 'sitemap-no-empty-category-pages'
$robots=[IO.File]::ReadAllText((Join-Path $root 'robots.txt'))
Assert-True ($robots.Contains('Sitemap: https://getnovaforge.com/sitemap.xml')) 'robots-canonical-sitemap'
pwsh -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root 'eng\site\Test-NovaPublicBrand.ps1')
if($LASTEXITCODE -ne 0){throw "FAIL_SITE_SUPERNOVA_8C: brand-proof-exit-$LASTEXITCODE"}
$checks.Add('public-brand-proof')
Write-Host ("PASS_TARGETED_SITE_SUPERNOVA_LOT8C_WINDOWS_PROOF checks={0} seoSurfaces=9 indexable=6 demoNoindex=3" -f $checks.Count)
