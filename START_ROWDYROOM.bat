@echo off
setlocal
title Rowdy Room Launcher
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\windows\start-rowdyroom.ps1"
pause
