Set-Location -Path $PSScriptRoot

$targets = Get-CimInstance Win32_Process -Filter "name='python.exe'" |
  Where-Object { $_.CommandLine -match '-m http\.server 8787' }

if (-not $targets) {
  Write-Host "8787 portunda calisan dashboard sunucusu bulunamadi."
  exit 0
}

$targets | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Write-Host "Dashboard sunucusu durduruldu. Kapatilan surec sayisi: $($targets.Count)"
