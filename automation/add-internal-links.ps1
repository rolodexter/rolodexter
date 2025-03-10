# add-internal-links.ps1
# Script to add internal links for component identities across all Markdown files

# Function to determine the relative path to the identities directory
function Get-RelativePath {
    param (
        [string]$FilePath
    )
    
    # Get the file's directory relative to the repository root
    $repoRoot = (Get-Item -Path $PSScriptRoot).Parent.FullName
    $fileDir = (Get-Item -Path $FilePath).DirectoryName
    
    # Calculate the relative path from the file to the identities directory
    $relativePath = ""
    if ($fileDir -ne $repoRoot) {
        $pathDiff = $fileDir.Substring($repoRoot.Length).TrimStart("\")
        $depth = ($pathDiff -split "\\").Count
        $relativePath = "../" * $depth
    }
    
    return $relativePath + "identities/"
}

# Get all Markdown files in the repository
$mdFiles = Get-ChildItem -Path (Get-Item -Path $PSScriptRoot).Parent.FullName -Recurse -Filter "*.md"

foreach ($file in $mdFiles) {
    Write-Host "Processing $($file.FullName)..."
    
    # Skip the identity files themselves to avoid self-referencing
    if ($file.FullName -like "*\identities\*") {
        Write-Host "Skipping identity file: $($file.Name)"
        continue
    }
    
    # Get the relative path to the identities directory
    $relativePath = Get-RelativePath -FilePath $file.FullName
    
    # Read the current content of the file
    $content = Get-Content -Path $file.FullName -Raw
    
    # Define the identity links with the correct relative path
    $identityLinks = @{
        "Joe Maristela" = "[Joe Maristela]($($relativePath)joe-maristela.md)"
        "rolodexterGPT" = "[rolodexterGPT]($($relativePath)rolodexterGPT.md)"
        "rolodexterVS" = "[rolodexterVS]($($relativePath)rolodexterVS.md)"
        "rolodexterGIT" = "[rolodexterGIT]($($relativePath)rolodexterGIT.md)"
        "rolodexterAPI" = "[rolodexterAPI]($($relativePath)rolodexterAPI.md)"
    }
    
    # Replace plain text mentions with links, but avoid replacing text that's already linked
    foreach ($key in $identityLinks.Keys) {
        # This regex pattern matches the identity name that's not already part of a Markdown link
        $pattern = "(?<!\[)(?<!\]\()$key(?!\]|\))"
        $content = [regex]::Replace($content, $pattern, $identityLinks[$key])
    }
    
    # Write the updated content back to the file
    Set-Content -Path $file.FullName -Value $content
    
    Write-Host "Updated $($file.Name) with internal links for component identities."
}

Write-Host "Internal linking complete!" 