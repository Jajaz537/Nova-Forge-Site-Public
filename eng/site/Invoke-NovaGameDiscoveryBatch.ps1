[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$files = @(Get-ChildItem -Path $root -Filter '*.html' -File | Sort-Object Name)
if ($files.Count -lt 10) { throw "Expected root public HTML surface, got $($files.Count) files." }

$changed = 0
$navTouched = 0
foreach ($file in $files) {
    $text = [IO.File]::ReadAllText($file.FullName)
    $next = $text
    $navMatch = [regex]::Match($next, '<nav\b[^>]*aria-label="Navigation principale"[^>]*>[\s\S]*?</nav>', 'IgnoreCase')
    if ($navMatch.Success) {
        $nav = $navMatch.Value
        if ($nav -notmatch '(?i)href="(?:\./|/)games/"') {
            $updatedNav = $nav
            $indexPattern = [regex]::new('<a\b[^>]*href="#catalogue"[^>]*>[\s\S]*?</a>', [Text.RegularExpressions.RegexOptions]::IgnoreCase)
            $catalogPattern = [regex]::new('<a\b[^>]*href="\./catalog\.html"[^>]*>[\s\S]*?</a>', [Text.RegularExpressions.RegexOptions]::IgnoreCase)
            if ($indexPattern.IsMatch($updatedNav)) {
                $updatedNav = $indexPattern.Replace($updatedNav, { param($m) $m.Value + "`n      " + '<a href="./games/">Jeux</a>' }, 1)
            }
            elseif ($catalogPattern.IsMatch($updatedNav)) {
                $updatedNav = $catalogPattern.Replace($updatedNav, { param($m) $m.Value + '<a href="./games/">Jeux</a>' }, 1)
            }
            else {
                throw "Primary navigation has no safe Games insertion point: $($file.Name)"
            }
            $next = $next.Substring(0, $navMatch.Index) + $updatedNav + $next.Substring($navMatch.Index + $navMatch.Length)
            $navTouched++
        }
    }

    if ($file.Name -eq 'index.html') {
        if ($next -notmatch '(?i)href="\./assets/game-hub\.css"') {
            $needle = '<link rel="stylesheet" href="./assets/nova-premium-hd.css">'
            if (-not $next.Contains($needle)) { throw 'index.html missing Premium HD stylesheet anchor.' }
            $next = $next.Replace($needle, $needle + "`n  " + '<link rel="stylesheet" href="./assets/game-hub.css">')
        }

        if ($next -notmatch 'id="games"') {
            $editionsNeedle = '    <section class="editions" id="os" aria-labelledby="editions-title">'
            if (-not $next.Contains($editionsNeedle)) { throw 'index.html missing canonical OS editions insertion anchor.' }
            $games = @'
    <section class="game-section home-games-stage" id="games" aria-labelledby="home-games-title">
      <div class="shell game-shell">
        <div class="game-section-head">
          <div><p class="eyebrow">Jeux en vedette</p><h2 class="section-title" id="home-games-title">Deux hubs dédiés.<br>Zéro faux catalogue.</h2></div>
          <p>GTA 6 et Red Dead Redemption 2 disposent maintenant de hubs éditoriaux dédiés. Le support technique, la compatibilité et la distribution restent séparés : aucun mod public vérifié n’est inventé pour remplir les pages.</p>
        </div>
        <div class="game-grid">
          <article class="game-card"><p class="game-kicker">Hub dédié</p><h3>GTA 6</h3><p>Architecture de découverte prête, adapter Nova Forge non validé et compatibilité explicitement inconnue.</p><div class="game-actions"><a href="./gta-6/">Explorer GTA 6</a></div></article>
          <article class="game-card"><p class="game-kicker">Hub dédié</p><h3>Red Dead Redemption 2</h3><p>Surface éditoriale multigaming prête, sans release publique Nova Forge ou compatibilité technique inventée.</p><div class="game-actions"><a href="./red-dead-redemption-2/">Explorer RDR2</a></div></article>
          <article class="game-card"><p class="game-kicker">Tous les jeux</p><h3>Architecture extensible</h3><p>Les autres jeux restent dans le catalogue tant qu’un hub substantiel n’est pas justifié. Aucune page SEO vide n’est générée.</p><div class="game-actions"><a href="./games/">Voir tous les jeux</a></div></article>
        </div>
        <p class="game-note">État pré-VF : 0 mod public vérifié sur les deux hubs dédiés. Aucun téléchargement n’est exposé sans identité, intégrité, droits, provenance et preuve de distribution suffisants.</p>
      </div>
    </section>

'@
            $next = $next.Replace($editionsNeedle, $games + $editionsNeedle)
        }
    }

    if ($next -ne $text) {
        [IO.File]::WriteAllText($file.FullName, $next, [Text.UTF8Encoding]::new($false))
        $changed++
        Write-Host "UPDATED $($file.Name)"
    }
}

if ($navTouched -eq 0 -and $changed -eq 0) {
    Write-Host 'PASS_SUPERNOVA_GAME_DISCOVERY_BATCH_NO_CHANGES_NEEDED'
    exit 0
}
if ($navTouched -lt 8) { throw "Expected at least 8 root primary navigations to gain Games, got $navTouched." }
Write-Host "PASS_SUPERNOVA_GAME_DISCOVERY_BATCH_APPLIED changed=$changed navTouched=$navTouched"
