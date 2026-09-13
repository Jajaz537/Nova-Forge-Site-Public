[CmdletBinding()]
param()
Set-StrictMode -Version Latest
$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$registry=(Get-Content -Raw (Join-Path $root 'data\seo-surfaces.json')|ConvertFrom-Json)
$changed=0
function Replace-FirstIgnoreCase([string]$InputText,[string]$Pattern,[string]$Replacement){
  $rx=[regex]::new($Pattern,[Text.RegularExpressions.RegexOptions]::IgnoreCase)
  return $rx.Replace($InputText,$Replacement,1)
}
foreach($surface in @($registry.surfaces)){
  $path=Join-Path $root ([string]$surface.path)
  if(-not(Test-Path $path)){throw "SEO surface missing: $($surface.path)"}
  $text=[IO.File]::ReadAllText($path)
  $next=$text
  $titleMatch=[regex]::Match($next,'<title>([^<]+)</title>','IgnoreCase')
  $descMatch=[regex]::Match($next,'<meta\s+name="description"\s+content="([^"]+)"\s*/?>','IgnoreCase')
  if(-not $titleMatch.Success){throw "SEO title missing: $($surface.path)"}
  if(-not $descMatch.Success){throw "SEO description missing: $($surface.path)"}
  $title=$titleMatch.Groups[1].Value
  $desc=$descMatch.Groups[1].Value
  $robots=if($surface.indexable -eq $true){'index,follow,max-image-preview:large'}else{'noindex,follow'}
  if($next -notmatch '<meta\s+name="robots"'){
    $anchor=$descMatch.Value
    $next=$next.Replace($anchor,$anchor+"`n  "+('<meta name="robots" content="{0}">' -f $robots))
  }
  if($next -notmatch '<link\s+rel="canonical"'){
    $titleTag=$titleMatch.Value
    $next=$next.Replace($titleTag,$titleTag+"`n  "+('<link rel="canonical" href="{0}">' -f $surface.canonical))
  }
  $canonicalTag='<link rel="canonical" href="{0}">' -f $surface.canonical
  $ogTags=@(
    @{pattern='<meta\s+property="og:title"';tag=('<meta property="og:title" content="{0}">' -f $title)},
    @{pattern='<meta\s+property="og:description"';tag=('<meta property="og:description" content="{0}">' -f $desc)},
    @{pattern='<meta\s+property="og:url"';tag=('<meta property="og:url" content="{0}">' -f $surface.canonical)},
    @{pattern='<meta\s+property="og:type"';tag='<meta property="og:type" content="website">'}
  )
  foreach($og in $ogTags){
    if($next -notmatch [string]$og.pattern){
      if(-not $next.Contains($canonicalTag)){throw "Canonical anchor missing while adding Open Graph metadata: $($surface.path)"}
      $next=$next.Replace($canonicalTag,$canonicalTag+"`n  "+[string]$og.tag)
    }
  }
  if($next -notmatch '<main\b[^>]*\sitemscope(?:\s|>)'){
    $schema='https://schema.org/'+[string]$surface.type
    $next=Replace-FirstIgnoreCase $next '<main\b([^>]*)>' ('<main$1 itemscope itemtype="'+$schema+'">')
  }
  if($next -notmatch '<h1\b[^>]*\sitemprop="name"'){
    $next=Replace-FirstIgnoreCase $next '<h1\b([^>]*)>' '<h1$1 itemprop="name">'
  }
  if($next -notmatch '\sitemprop="description"'){
    if($next -match '<p\b[^>]*class="[^"]*game-lede[^"]*"[^>]*>'){
      $next=Replace-FirstIgnoreCase $next '<p\b([^>]*class="[^"]*game-lede[^"]*"[^>]*)>' '<p$1 itemprop="description">'
    } elseif($next -match '<p\b[^>]*id="project-summary"[^>]*>'){
      $next=Replace-FirstIgnoreCase $next '<p\b([^>]*id="project-summary"[^>]*)>' '<p$1 itemprop="description">'
    } elseif($next -match '<p\b[^>]*class="section-intro"[^>]*>'){
      $next=Replace-FirstIgnoreCase $next '<p\b([^>]*class="section-intro"[^>]*)>' '<p$1 itemprop="description">'
    } else {throw "No safe structured description target: $($surface.path)"}
  }
  if($next -ne $text){[IO.File]::WriteAllText($path,$next,[Text.UTF8Encoding]::new($false));$changed++;Write-Host "UPDATED $($surface.path)"}
}

$sitemapPath=Join-Path $root 'sitemap.xml'
$sitemap=[IO.File]::ReadAllText($sitemapPath)
$nextMap=$sitemap
foreach($surface in @($registry.surfaces|Where-Object {$_.indexable -eq $false})){
  $escaped=[regex]::Escape([string]$surface.canonical)
  $nextMap=[regex]::Replace($nextMap,"\s*<url><loc>$escaped</loc></url>",'','IgnoreCase')
}
if($nextMap -ne $sitemap){[IO.File]::WriteAllText($sitemapPath,$nextMap,[Text.UTF8Encoding]::new($false));$changed++;Write-Host 'UPDATED sitemap.xml'}
if($changed -eq 0){Write-Host 'PASS_SUPERNOVA_SEO_SURFACE_BATCH_NO_CHANGES_NEEDED'}else{Write-Host "PASS_SUPERNOVA_SEO_SURFACE_BATCH_APPLIED changed=$changed"}
