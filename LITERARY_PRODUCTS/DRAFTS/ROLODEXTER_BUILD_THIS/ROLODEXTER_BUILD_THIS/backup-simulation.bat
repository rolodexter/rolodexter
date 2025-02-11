@echo off
echo Backing up working version of the simulation...

:: Create backup directory if it doesn't exist
if not exist "backup_working_version" mkdir "backup_working_version"

:: Copy main simulation files
copy /Y "web-simulation.js" "backup_working_version\"
copy /Y "index.html" "backup_working_version\"
copy /Y "package.json" "backup_working_version\"
copy /Y "start-local-server.bat" "backup_working_version\"

:: Timestamp for log
echo Backup completed at %date% %time%

echo Backup completed successfully!