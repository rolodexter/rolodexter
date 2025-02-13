# Start local dev server and initialize Beacon platform
@echo off
echo Starting Beacon Platform...
start "Beacon Server" npx http-server -p 3000 --cors -c-1
timeout /t 2
start "" http://localhost:3000/beacon.html