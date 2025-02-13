@echo off

:: Create backup directory if it doesn't exist
if not exist "backup_working_version" mkdir "backup_working_version"

:: Copy Beacon simulation files
copy /Y "beacon.html" "backup_working_version\"
copy /Y "src\simulation\beacon.js" "backup_working_version\"
copy /Y "src\simulation\beacon.ts" "backup_working_version\"
copy /Y "src\simulation\chat.ts" "backup_working_version\"
copy /Y "src\simulation\marketVisuals.ts" "backup_working_version\"
copy /Y "src\styles\beacon.css" "backup_working_version\"
copy /Y "src\styles\chat.css" "backup_working_version\"
copy /Y "package.json" "backup_working_version\"
copy /Y "README.md" "backup_working_version\"
copy /Y "CHANGELOG.md" "backup_working_version\"

:: Create debug log directory if it doesn't exist
if not exist "debug" mkdir "debug"

:: Timestamp for log
echo Backup completed at %date% %time% > "debug\terminal_simulation.log"
echo Files backed up: >> "debug\terminal_simulation.log"
echo - beacon.html >> "debug\terminal_simulation.log"
echo - beacon.js >> "debug\terminal_simulation.log"
echo - beacon.ts >> "debug\terminal_simulation.log"
echo - chat.ts >> "debug\terminal_simulation.log"
echo - marketVisuals.ts >> "debug\terminal_simulation.log"
echo - beacon.css >> "debug\terminal_simulation.log"
echo - chat.css >> "debug\terminal_simulation.log"
echo - package.json >> "debug\terminal_simulation.log"
echo - README.md >> "debug\terminal_simulation.log"
echo - CHANGELOG.md >> "debug\terminal_simulation.log"

echo Backup completed successfully!