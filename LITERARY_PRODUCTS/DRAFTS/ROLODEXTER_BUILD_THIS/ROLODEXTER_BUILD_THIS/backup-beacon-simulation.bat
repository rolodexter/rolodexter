@echo off

:: Create backup directory if it doesn't exist
if not exist "backup_working_version" mkdir "backup_working_version"

:: Copy Beacon simulation files
copy /Y "beacon.html" "backup_working_version\"
copy /Y "src\simulation\beacon.js" "backup_working_version\"
copy /Y "src\simulation\beacon.ts" "backup_working_version\"
copy /Y "src\styles\beacon.css" "backup_working_version\"
copy /Y "package.json" "backup_working_version\"

:: Timestamp for log
echo Backup completed at %date% %time%

echo Backup completed successfully!