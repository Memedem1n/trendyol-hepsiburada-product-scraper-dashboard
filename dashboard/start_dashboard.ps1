Set-Location -Path $PSScriptRoot
$projectRoot = Split-Path -Parent $PSScriptRoot

$existing = Get-CimInstance Win32_Process -Filter "name='python.exe'" |
  Where-Object { $_.CommandLine -match '-m http\.server 8787' }
if ($existing) {
  $existing | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Milliseconds 300
}

$stdoutLog = Join-Path $PSScriptRoot "server_stdout.log"
$stderrLog = Join-Path $PSScriptRoot "server_stderr.log"
if (Test-Path $stdoutLog) { Remove-Item $stdoutLog -Force -ErrorAction SilentlyContinue }
if (Test-Path $stderrLog) { Remove-Item $stderrLog -Force -ErrorAction SilentlyContinue }

$proc = Start-Process -FilePath python `
  -ArgumentList '-m', 'http.server', '8787' `
  -WorkingDirectory $projectRoot `
  -RedirectStandardOutput $stdoutLog `
  -RedirectStandardError $stderrLog `
  -PassThru

$ready = $false
for ($i = 0; $i -lt 20; $i++) {
  Start-Sleep -Milliseconds 300
  if ($proc.HasExited) { break }
  try {
    $resp = Invoke-WebRequest -Uri "http://localhost:8787/dashboard/" -UseBasicParsing -TimeoutSec 2
    if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) {
      $ready = $true
      break
    }
  } catch {}
}

if (-not $ready) {
  Write-Host "Dashboard sunucusu baslatilamadi. Portu kullanan baska bir uygulama olabilir."
  if (Test-Path $stderrLog) {
    Write-Host "Hata logu:"
    Get-Content $stderrLog -Tail 80
  }
  exit 1
}

Write-Host "Dashboard sunucusu acildi."
Write-Host "PID: $($proc.Id)"
Write-Host "URL: http://localhost:8787/dashboard/"
Write-Host "Loglar:"
Write-Host "  $stdoutLog"
Write-Host "  $stderrLog"

Start-Process "http://localhost:8787/dashboard/"
