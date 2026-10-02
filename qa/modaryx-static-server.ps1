param(
  [int]$Port = 4173,
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'

$routes = @{
  '/' = @('index.html', 'text/html; charset=utf-8')
  '/index.html' = @('index.html', 'text/html; charset=utf-8')
  '/univers.html' = @('univers.html', 'text/html; charset=utf-8')
  '/compagnons.html' = @('compagnons.html', 'text/html; charset=utf-8')
  '/aventures.html' = @('aventures.html', 'text/html; charset=utf-8')
  '/lieux.html' = @('lieux.html', 'text/html; charset=utf-8')
  '/factions.html' = @('factions.html', 'text/html; charset=utf-8')
  '/communaute.html' = @('communaute.html', 'text/html; charset=utf-8')
  '/404.html' = @('404.html', 'text/html; charset=utf-8')
  '/site.webmanifest' = @('site.webmanifest', 'application/manifest+json; charset=utf-8')
  '/favicon.svg' = @('favicon.svg', 'image/svg+xml')
  '/assets/modaryx-public-home.css' = @('assets/modaryx-public-home.css', 'text/css; charset=utf-8')
  '/assets/modaryx-public-route.css' = @('assets/modaryx-public-route.css', 'text/css; charset=utf-8')
  '/assets/modaryx-finishline-canon.png' = @('assets/modaryx-finishline-canon.png', 'image/png')
  '/assets/modaryx-mark.svg' = @('assets/modaryx-mark.svg', 'image/svg+xml')
  '/assets/modaryx-mark-192.png' = @('assets/modaryx-mark-192.png', 'image/png')
  '/assets/modaryx-mark-512.png' = @('assets/modaryx-mark-512.png', 'image/png')
}

$assets = @{}
foreach ($entry in $routes.GetEnumerator()) {
  $relative = $entry.Value[0]
  $contentType = $entry.Value[1]
  $path = Join-Path $Root $relative
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    throw "STATIC_ASSET_MISSING"
  }
  $assets[$entry.Key] = @{
    Body = [System.IO.File]::ReadAllBytes($path)
    ContentType = $contentType
  }
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()
Write-Host ("MODARYX_STATIC_READY http://127.0.0.1:" + $Port)

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $reader = [System.IO.StreamReader]::new(
        $stream,
        [System.Text.Encoding]::ASCII,
        $false,
        4096,
        $true
      )

      $requestLine = $reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

      do {
        $headerLine = $reader.ReadLine()
      } while ($null -ne $headerLine -and $headerLine.Length -gt 0)

      $parts = $requestLine.Split(' ')
      if ($parts.Count -lt 2) { continue }

      $method = $parts[0]
      $rawTarget = $parts[1]
      $pathname = ($rawTarget -split '\?', 2)[0]

      if ($method -ne 'GET' -and $method -ne 'HEAD') {
        $body = [System.Text.Encoding]::UTF8.GetBytes('Method not allowed')
        $header = "HTTP/1.1 405 Method Not Allowed`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        if ($method -ne 'HEAD') { $stream.Write($body, 0, $body.Length) }
        continue
      }

      $asset = $assets[$pathname]
      if ($null -eq $asset) {
        $body = [System.Text.Encoding]::UTF8.GetBytes('Not found')
        $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        if ($method -ne 'HEAD') { $stream.Write($body, 0, $body.Length) }
        continue
      }

      $body = $asset.Body
      $header = "HTTP/1.1 200 OK`r`nContent-Type: $($asset.ContentType)`r`nContent-Length: $($body.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n"
      $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      if ($method -ne 'HEAD') {
        $stream.Write($body, 0, $body.Length)
      }
    }
    finally {
      $client.Close()
    }
  }
}
finally {
  $listener.Stop()
}
