@echo off
setlocal
title Install Rowdy Room Bridge Autostart

echo.
echo Installing Rowdy Room Local Bridge autostart...
echo This makes the bridge start automatically when you log into Windows.
echo.

set CONFIG=%USERPROFILE%\RowdyRoom
set BRIDGE=%CONFIG%\rowdyroom-local-bridge-v3.ps1
mkdir "%CONFIG%" >nul 2>nul

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $config=Join-Path $env:USERPROFILE 'RowdyRoom'; $bridge=Join-Path $config 'rowdyroom-local-bridge-v3.ps1'; if(!(Test-Path $bridge)){ Invoke-WebRequest 'https://raw.githubusercontent.com/rowdyroom/rowdyroom/main/scripts/local-bridge/rowdyroom-local-bridge-v3.ps1' -OutFile $bridge }; $action=New-ScheduledTaskAction -Execute 'powershell.exe' -Argument ('-NoProfile -ExecutionPolicy Bypass -File "' + $bridge + '"'); $trigger=New-ScheduledTaskTrigger -AtLogOn; $settings=New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew; Register-ScheduledTask -TaskName 'RowdyRoomLocalBridge' -Action $action -Trigger $trigger -Settings $settings -Description 'Starts the Rowdy Room localhost bridge at Windows login.' -Force | Out-Null; Write-Host 'Autostart task installed: RowdyRoomLocalBridge' -ForegroundColor Green"

echo.
echo Done.
pause
