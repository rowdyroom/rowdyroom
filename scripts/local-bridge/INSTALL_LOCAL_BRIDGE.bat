@echo off
setlocal
title Install Rowdy Room Local Bridge

echo.
echo Installing Rowdy Room Local Bridge...
echo This bridge is localhost-only and limited to the RowdyRoom folder.
echo.

set ROOT=%USERPROFILE%\RowdyRoom
set BRIDGE=%ROOT%\rowdyroom-local-bridge.ps1
set ENVFILE=%ROOT%\.env.local
set TOKENFILE=%ROOT%\.bridge-token

mkdir "%ROOT%" >nul 2>nul
if not exist "%ENVFILE%" echo # Rowdy Room local environment file>"%ENVFILE%"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $root=Join-Path $env:USERPROFILE 'RowdyRoom'; $bridge=Join-Path $root 'rowdyroom-local-bridge.ps1'; $url='https://raw.githubusercontent.com/rowdyroom/rowdyroom/main/scripts/local-bridge/rowdyroom-local-bridge.ps1'; Invoke-WebRequest $url -OutFile $bridge; if(!(Test-Path (Join-Path $root '.bridge-token'))){ $token=[Convert]::ToBase64String([Guid]::NewGuid().ToByteArray()).Replace('=','').Replace('+','').Replace('/',''); Set-Content -Path (Join-Path $root '.bridge-token') -Value $token -Encoding UTF8 }; $token=(Get-Content (Join-Path $root '.bridge-token') -Raw).Trim(); $envFile=Join-Path $root '.env.local'; $text=Get-Content $envFile -Raw; if($text -notmatch '(?m)^ROWDYROOM_BRIDGE_TOKEN='){ Add-Content -Path $envFile -Value ('ROWDYROOM_BRIDGE_TOKEN=' + $token) }; if($text -notmatch '(?m)^ROWDYROOM_BRIDGE_URL='){ Add-Content -Path $envFile -Value 'ROWDYROOM_BRIDGE_URL=http://127.0.0.1:4777' }; Write-Host 'Bridge installed.' -ForegroundColor Green; Write-Host ('Bridge file: ' + $bridge) -ForegroundColor Cyan; Write-Host ('Env file: ' + $envFile) -ForegroundColor Cyan"

echo.
echo Starting Rowdy Room Local Bridge...
powershell -NoProfile -ExecutionPolicy Bypass -File "%BRIDGE%"

pause
