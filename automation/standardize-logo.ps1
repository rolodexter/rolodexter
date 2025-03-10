<#
#  Copyright (c) 2025 rolodexter
#  All rights reserved.
# 
#  This file is part of the rolodexter repository.
#  Unauthorized copying, modification, distribution, or use is prohibited.
#  See COPYRIGHT.md for complete terms.
#>
# standardize-logo.ps1
# Script to standardize the logo across all Markdown files in the repository

# Function to determine the relative path to the root directory
function Get-RelativePath {
    param (
        [string]$FilePath
    )
    
    # Get the file's directory relative to the repository root
    $repoRoot = (Get-Item -Path $PSScriptRoot).Parent.FullName
    $fileDir = (Get-Item -Path $FilePath).DirectoryName
    
    # Calculate the relative path from the file to the repo root
    $relativePath = ""
    if ($fileDir -ne $repoRoot) {
        $pathDiff = $fileDir.Substring($repoRoot.Length).TrimStart("\")
        $depth = ($pathDiff -split "\\").Count
        $relativePath = "../" * $depth
    }
    
    return $relativePath
}

# Get all Markdown files in the repository
$mdFiles = Get-ChildItem -Path (Get-Item -Path $PSScriptRoot).Parent.FullName -Recurse -Filter "*.md"

foreach ($file in $mdFiles) {
    Write-Host "Processing $($file.FullName)..."
    
    # Skip the README.md file as it's already been updated manually
    if ($file.Name -eq "README.md") {
        Write-Host "Skipping README.md as it's already been updated manually."
        continue
    }
    
    # Get the relative path to the root directory
    $relativePath = Get-RelativePath -FilePath $file.FullName
    
    # Create the standardized header with the correct relative path
    $header = @"
<p align="center">
  <a href="${relativePath}README.md">
    <img src="${relativePath}assets/images/square_logo.jpg" alt="rolodexter Logo" width="100px" style="border-radius: 50%;">
  </a>
</p>

"@
    
    # Read the current content of the file
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if the file already has a logo header
    if ($content -match '<p align="center">[\s\S]*?<img src=.*?(SQUARE_LOGO\.jpg|rolodexter_logo\.jpg|square_logo\.jpg).*?>[\s\S]*?</p>') {
        Write-Host "File already has a logo header. Replacing it..."
        $content = $content -replace '<p align="center">[\s\S]*?<img src=.*?(SQUARE_LOGO\.jpg|rolodexter_logo\.jpg|square_logo\.jpg).*?>[\s\S]*?</p>', $header.Trim()
    } else {
        # Add the header to the beginning of the file
        $content = $header + $content
    }
    
    # Write the updated content back to the file
    Set-Content -Path $file.FullName -Value $content
    
    Write-Host "Updated $($file.Name) with standardized logo header."
}

Write-Host "Logo standardization complete!" 