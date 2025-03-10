# Copyright (c) 2025 rolodexter
# All rights reserved.
# See COPYRIGHT.md for complete terms.

# Script for implementing copyright notice and headers across the repository

# Define the repository root
$repoRoot = (Get-Item -Path $PSScriptRoot).Parent.FullName

# Function to add copyright header to source files
function Add-CopyrightHeader {
    param(
        [string]$filePath,
        [string]$fileExtension
    )

    $fileContent = Get-Content -Path $filePath -Raw
    
    # Skip if file already has a copyright notice
    if ($fileContent -match "Copyright.*?rolodexter") {
        Write-Host "  - Skipping $($filePath) (already has copyright notice)"
        return
    }
    
    # Determine comment style based on file extension
    $commentStart = ""
    $commentEnd = ""
    $commentLine = ""
    
    switch ($fileExtension) {
        { $_ -in ".js", ".java", ".cs" } {
            $commentStart = "/*"
            $commentEnd = " */"
            $commentLine = " * "
        }
        { $_ -in ".py", ".sh" } {
            $commentStart = "#"
            $commentEnd = ""
            $commentLine = "# "
        }
        { $_ -in ".ps1" } {
            $commentStart = "<#"
            $commentEnd = "#>"
            $commentLine = "# "
        }
        { $_ -in ".bat" } {
            $commentStart = "REM"
            $commentEnd = ""
            $commentLine = "REM "
        }
        default {
            Write-Host "  - Skipping $($filePath) (unsupported file type)"
            return
        }
    }
    
    # Create copyright header
    $copyrightHeader = @"
$commentStart
$commentLine Copyright (c) 2025 rolodexter
$commentLine All rights reserved.
$commentLine
$commentLine This file is part of the rolodexter repository.
$commentLine Unauthorized copying, modification, distribution, or use is prohibited.
$commentLine See COPYRIGHT.md for complete terms.
$commentEnd

"@
    
    # Add header to file
    $updatedContent = $copyrightHeader + $fileContent
    Set-Content -Path $filePath -Value $updatedContent -NoNewline
    Write-Host "  - Added copyright header to $($filePath)"
}

# Process all source files
Write-Host "Adding copyright headers to source files..."
$sourceFiles = Get-ChildItem -Path $repoRoot -Recurse -Include "*.js", "*.py", "*.ps1", "*.sh", "*.bat", "*.cs", "*.java" |
    Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*\.git*" }

foreach ($file in $sourceFiles) {
    Add-CopyrightHeader -filePath $file.FullName -fileExtension $file.Extension
}

Write-Host "Copyright implementation complete!" 