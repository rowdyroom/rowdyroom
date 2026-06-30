@echo off
setlocal
title Install Rowdy Room Local Bridge - D/F Storage

echo.
echo Installing Rowdy Room Local Bridge with D/F drive support...
echo This keeps small config on C and puts work/code on D:\RowdyRoom if available, then F:\RowdyRoom, then C as fallback.
echo.

set CONFIG=%USERPROFILE%\RowdyRoom
set ENVFILE=%CONFIG%\.env.local
set TOKENFILE=%CONFIG%\.bridge-token
set BRIDGE=%CONFIG%\rowdyroom-local-bridge-v2.ps1

mkdir "%CONFIG%" >nul 2>nul
if not exist "%ENVFILE%" echo # Rowdy Room local environment file>"%ENVFILE%"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $config=Join-Path $env:USERPROFILE 'RowdyRoom'; $envFile=Join-Path $config '.env.local'; $bridge=Join-Path $config 'rowdyroom-local-bridge-v2.ps1'; if(Test-Path 'D:\'){ $storage='D:\RowdyRoom' } elseif(Test-Path 'F:\'){ $storage='F:\RowdyRoom' } else { $storage=$config }; New-Item -ItemType Directory -Force -Path $config,$storage | Out-Null; $url='https://raw.githubusercontent.com/rowdyroom/rowdyroom/main/scripts/local-bridge/rowdyroom-local-bridge-v2.ps1'; Invoke-WebRequest $url -OutFile $bridge; if(!(Test-Path (Join-Path $config '.bridge-token'))){ $token=[Convert]::ToBase64String([Guid]::NewGuid().ToByteArray()).Replace('=','').Replace('+','').Replace('/',''); Set-Content -Path (Join-Path $config '.bridge-token') -Value $token -Encoding UTF8 }; $token=(Get-Content (Join-Path $config '.bridge-token') -Raw).Trim(); $text=Get-Content $envFile -Raw; $pairs=@{ 'ROWDYROOM_BRIDGE_TOKEN'=$token; 'ROWDYROOM_BRIDGE_URL'='http://127.0.0.1:4777'; 'ROWDYROOM_STORAGE_ROOT'=$storage }; foreach($k in $pairs.Keys){ if($text -match ('(?m)^' + [regex]::Escape($k) + '=')){ $lines=Get-Content $envFile; $lines=$lines | ForEach-Object { if($_ -match ('^' + [regex]::Escape($k) + '=')){ $k + '=' + $pairs[$k] } else { $_ } }; Set-Content -Path $envFile -Value $lines -Encoding UTF8 } else { Add-Content -Path $envFile -Value ($k + '=' + $pairs[$k]) } }; Copy-Item $envFile (Join-Path $storage '.env.local') -Force; Write-Host 'Bridge installed.' -ForegroundColor Green; Write-Host ('Config folder: ' + $config) -ForegroundColor Cyan; Write-Host ('Storage folder: ' + $storage) -ForegroundColor Cyan; Write-Host ('Bridge file: ' + $bridge) -ForegroundColor Cyan"

echo.
echo Starting Rowdy Room Local Bridge...
echo Keep this window open while using local bridge actions.
powershell -NoProfile -ExecutionPolicy Bypass -File "%BRIDGE%"

pause
