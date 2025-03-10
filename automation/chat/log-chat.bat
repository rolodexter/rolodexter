@echo off
REM log-chat.bat - Wrapper for log-copilot-chat.ps1

REM Check if parameters are provided
if "%~5"=="" (
    echo Usage: log-chat.bat "Session Title" "Human Name" "AI Name" "Message Content" "Sender"
    echo Example: log-chat.bat "Repository Setup" "Joe Maristela" "rolodexterVS" "Let's set up the repo structure" "Human"
    exit /b 1
)

REM Call the PowerShell script with parameters
powershell -ExecutionPolicy Bypass -File "%~dp0log-copilot-chat.ps1" -SessionTitle "%~1" -HumanName "%~2" -AIName "%~3" -MessageContent "%~4" -Sender "%~5"

REM Check if the script executed successfully
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to log chat message.
    exit /b 1
)

echo Chat message logged successfully. 