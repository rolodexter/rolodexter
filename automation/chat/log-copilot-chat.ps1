<#
#  Copyright (c) 2025 rolodexter
#  All rights reserved.
# 
#  This file is part of the rolodexter repository.
#  Unauthorized copying, modification, distribution, or use is prohibited.
#  See COPYRIGHT.md for complete terms.
#>
# log-copilot-chat.ps1
# Script to log GitHub Copilot Chat interactions to the chat history file

param (
    [Parameter(Mandatory=$true)]
    [string]$SessionTitle,
    
    [Parameter(Mandatory=$true)]
    [string]$HumanName,
    
    [Parameter(Mandatory=$true)]
    [string]$AIName,
    
    [Parameter(Mandatory=$true)]
    [string]$MessageContent,
    
    [Parameter(Mandatory=$true)]
    [string]$Sender, # "Human" or "AI"
    
    [Parameter(Mandatory=$false)]
    [string]$LogFile = "../../copilot-logs/chat-history.md"
)

# Get current date and time
$currentDate = Get-Date -Format "yyyy-MM-dd"
$currentTime = Get-Date -Format "HH:mm"

# Check if the log file exists
if (-not (Test-Path $LogFile)) {
    # Create the directory if it doesn't exist
    $logDir = Split-Path -Parent $LogFile
    if (-not (Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }
    
    # Create the log file with header
    @"
# Copilot Chat History

This file contains an automated log of Copilot Chat interactions within the rolodexter project.

## Format

Each chat session is logged with the following structure:

```
## [YYYY-MM-DD] Session Title

### Participants
- Human: [Name]
- AI: [rolodexter Identity]

### Conversation
[Timestamp] **Human**: Message content
[Timestamp] **AI**: Response content
```

---

"@ | Out-File -FilePath $LogFile -Encoding utf8
}

# Read the existing content
$content = Get-Content -Path $LogFile -Raw

# Check if the session already exists
$sessionHeader = "## [$currentDate] $SessionTitle"
if ($content -notmatch [regex]::Escape($sessionHeader)) {
    # Add new session
    @"

$sessionHeader

### Participants
- Human: $HumanName
- AI: $AIName

### Conversation
"@ | Out-File -FilePath $LogFile -Append -Encoding utf8
}

# Add the message
"[$currentTime] **$Sender**: $MessageContent" | Out-File -FilePath $LogFile -Append -Encoding utf8

Write-Host "Message logged successfully to $LogFile" 