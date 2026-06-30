$ErrorActionPreference = 'Stop'

$ConfigRoot = Join-Path $env:USERPROFILE 'RowdyRoom'
$ConfigEnvPath = Join-Path $ConfigRoot '.env.local'
$TokenPath = Join-Path $ConfigRoot '.bridge-token'
$Port = 4777
$Prefix = "http://127.0.0.1:$Port/"

function Read-EnvValue($Path, $Name) {
  if (!(Test-Path $Path)) { return $null }
  $match = Get-Content $Path | Where-Object { $_ -match ('^' + [regex]::Escape($Name) + '=') } | Select-Object -First 1
  if (!$match) { return $null }
  return ($match -replace ('^' + [regex]::Escape($Name) + '='), '')
}

function Choose-StorageRoot {
  $configured = Read-EnvValue $ConfigEnvPath 'ROWDYROOM_STORAGE_ROOT'
  if ($configured -and (Test-Path (Split-Path $configured -Qualifier))) { return $configured }
  if (Test-Path 'D:\') { return 'D:\RowdyRoom' }
  if (Test-Path 'F:\') { return 'F:\RowdyRoom' }
  return $ConfigRoot
}

$StorageRoot = Choose-StorageRoot
$CodeRoot = Join-Path $StorageRoot 'code'
$WorkRoot = Join-Path $StorageRoot 'work'
$Backups = Join-Path $StorageRoot 'backups'
$EnvPath = Join-Path $StorageRoot '.env.local'
$ApprovedRoots = @($ConfigRoot, $StorageRoot)
if (Test-Path 'D:\') { $ApprovedRoots += 'D:\RowdyRoom' }
if (Test-Path 'F:\') { $ApprovedRoots += 'F:\RowdyRoom' }
$ApprovedRoots = $ApprovedRoots | Select-Object -Unique

$AllowedEnvNames = @(
  'OPENAI_API_KEY','ANTHROPIC_API_KEY','XAI_API_KEY','GEMINI_API_KEY','YOUTUBE_API_KEY',
  'YOUTUBE_SEARCH_DAILY_LIMIT','YOUTUBE_SEARCH_PEAK_PER_MINUTE','SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_MODEL','ANTHROPIC_MODEL','XAI_MODEL','GEMINI_MODEL','OLLAMA_BASE_URL',
  'ROWDYROOM_BRIDGE_URL','ROWDYROOM_STORAGE_ROOT'
)

New-Item -ItemType Directory -Force -Path $ConfigRoot, $StorageRoot, $CodeRoot, $WorkRoot, $Backups | Out-Null
if (!(Test-Path $ConfigEnvPath)) { '# Rowdy Room local environment file' | Set-Content -Path $ConfigEnvPath -Encoding UTF8 }
if (!(Test-Path $EnvPath)) { Copy-Item $ConfigEnvPath $EnvPath -Force }
if (!(Test-Path $TokenPath)) {
  $Token = [Convert]::ToBase64String([Guid]::NewGuid().ToByteArray()).Replace('=', '').Replace('+', '').Replace('/', '')
  Set-Content -Path $TokenPath -Value $Token -Encoding UTF8
} else {
  $Token = (Get-Content $TokenPath -Raw).Trim()
}

function Write-Json($Context, $StatusCode, $Object) {
  $json = $Object | ConvertTo-Json -Depth 8
  $bytes = [Text.Encoding]::UTF8.GetBytes($json)
  $Context.Response.StatusCode = $StatusCode
  $Context.Response.ContentType = 'application/json; charset=utf-8'
  $Context.Response.Headers.Add('Access-Control-Allow-Origin', 'http://localhost:3000')
  $Context.Response.Headers.Add('Access-Control-Allow-Headers', 'content-type,x-rowdyroom-token')
  $Context.Response.Headers.Add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  $Context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $Context.Response.Close()
}

function Read-BodyJson($Context) {
  $reader = New-Object IO.StreamReader($Context.Request.InputStream, $Context.Request.ContentEncoding)
  $text = $reader.ReadToEnd()
  if ([string]::IsNullOrWhiteSpace($text)) { return @{} }
  return $text | ConvertFrom-Json
}

function Save-EnvValue($Name, $Value) {
  if ($AllowedEnvNames -notcontains $Name) { throw "Environment name is not approved: $Name" }
  foreach ($target in @($ConfigEnvPath, $EnvPath)) {
    $lines = @()
    if (Test-Path $target) { $lines = @(Get-Content $target) }
    $found = $false
    $updated = $lines | ForEach-Object {
      if ($_ -match ('^' + [regex]::Escape($Name) + '=')) { $found = $true; "$Name=$Value" } else { $_ }
    }
    if (!$found) { $updated += "$Name=$Value" }
    Set-Content -Path $target -Value $updated -Encoding UTF8
  }
}

function Get-EnvMap {
  $map = @{}
  if (Test-Path $EnvPath) {
    Get-Content $EnvPath | ForEach-Object {
      if ($_ -match '^([^#][^=]+)=(.*)$') { $map[$matches[1].Trim()] = $matches[2] }
    }
  }
  return $map
}

function Backup-Env {
  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $dest = Join-Path $Backups ".env.local.$stamp.bak"
  Copy-Item $EnvPath $dest -Force
  return $dest
}

function Stop-RowdyNode {
  $stopped = 0
  Get-CimInstance Win32_Process -Filter "name = 'node.exe'" | Where-Object { $_.CommandLine -like '*RowdyRoom*' -or $_.CommandLine -like '*rowdyroom-main*' } | ForEach-Object {
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    $stopped += 1
  }
  return $stopped
}

function Refresh-Code {
  $zip = Join-Path $StorageRoot 'rowdyroom-main.zip'
  $url = 'https://github.com/rowdyroom/rowdyroom/archive/refs/heads/main.zip'
  $project = Join-Path $CodeRoot 'rowdyroom-main'
  Remove-Item $zip -Force -ErrorAction SilentlyContinue
  Remove-Item $CodeRoot -Recurse -Force -ErrorAction SilentlyContinue
  New-Item -ItemType Directory -Force -Path $CodeRoot | Out-Null
  Invoke-WebRequest $url -OutFile $zip
  Expand-Archive $zip -DestinationPath $CodeRoot -Force
  Copy-Item $EnvPath (Join-Path $project '.env.local') -Force
  return $project
}

function Start-RowdyApp($PortNumber) {
  $project = Join-Path $CodeRoot 'rowdyroom-main'
  if (!(Test-Path (Join-Path $project 'package.json'))) { throw 'Rowdy Room code is not downloaded yet.' }
  Copy-Item $EnvPath (Join-Path $project '.env.local') -Force
  $cmd = "cd /d `"$project`" && npm install && npm run dev -- -p $PortNumber"
  Start-Process -FilePath 'cmd.exe' -ArgumentList '/k', $cmd -WindowStyle Normal | Out-Null
}

Save-EnvValue -Name 'ROWDYROOM_STORAGE_ROOT' -Value $StorageRoot
Save-EnvValue -Name 'ROWDYROOM_BRIDGE_URL' -Value "http://127.0.0.1:$Port"

$listener = New-Object Net.HttpListener
$listener.Prefixes.Add($Prefix)
$listener.Start()
Write-Host "Rowdy Room Local Bridge running at $Prefix" -ForegroundColor Green
Write-Host "Config folder: $ConfigRoot" -ForegroundColor Cyan
Write-Host "Storage folder: $StorageRoot" -ForegroundColor Cyan
Write-Host "Approved folders:" -ForegroundColor Yellow
$ApprovedRoots | ForEach-Object { Write-Host " - $_" -ForegroundColor Yellow }

while ($listener.IsListening) {
  $context = $listener.GetContext()
  try {
    if ($context.Request.HttpMethod -eq 'OPTIONS') { Write-Json $context 200 @{ ok = $true }; continue }
    $path = $context.Request.Url.AbsolutePath.Trim('/').ToLowerInvariant()
    $provided = $context.Request.Headers['x-rowdyroom-token']
    if ($path -ne 'health' -and $provided -ne $Token) { Write-Json $context 401 @{ ok = $false; error = 'Missing or invalid local bridge token.' }; continue }

    if ($context.Request.HttpMethod -eq 'GET' -and $path -eq 'health') {
      Write-Json $context 200 @{ ok = $true; bridge = 'rowdyroom-local-bridge-v2'; configRoot = $ConfigRoot; storageRoot = $StorageRoot; approvedRoots = $ApprovedRoots; port = $Port; tokenRequired = $true }
      continue
    }
    if ($context.Request.HttpMethod -eq 'GET' -and $path -eq 'env/status') {
      $env = Get-EnvMap; $status = @{}
      foreach ($name in $AllowedEnvNames) { $status[$name] = [bool]($env[$name]) }
      Write-Json $context 200 @{ ok = $true; env = $status; envPath = $EnvPath; storageRoot = $StorageRoot; approvedRoots = $ApprovedRoots }
      continue
    }
    if ($context.Request.HttpMethod -eq 'POST' -and $path -eq 'env/set') {
      $body = Read-BodyJson $context; Backup-Env | Out-Null; Save-EnvValue -Name ([string]$body.name) -Value ([string]$body.value)
      Write-Json $context 200 @{ ok = $true; updated = [string]$body.name }
      continue
    }
    if ($context.Request.HttpMethod -eq 'POST' -and $path -eq 'project/refresh') { $project = Refresh-Code; Write-Json $context 200 @{ ok = $true; project = $project; storageRoot = $StorageRoot }; continue }
    if ($context.Request.HttpMethod -eq 'POST' -and $path -eq 'server/stop') { $count = Stop-RowdyNode; Write-Json $context 200 @{ ok = $true; stopped = $count }; continue }
    if ($context.Request.HttpMethod -eq 'POST' -and $path -eq 'server/start') { $body = Read-BodyJson $context; $portNumber = if ($body.port) { [int]$body.port } else { 3000 }; Start-RowdyApp -PortNumber $portNumber; Write-Json $context 200 @{ ok = $true; started = $true; port = $portNumber; storageRoot = $StorageRoot }; continue }

    Write-Json $context 404 @{ ok = $false; error = 'Unknown bridge endpoint.' }
  } catch {
    Write-Json $context 500 @{ ok = $false; error = $_.Exception.Message }
  }
}
