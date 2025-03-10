<#
#  Copyright (c) 2025 rolodexter
#  All rights reserved.
# 
#  This file is part of the rolodexter repository.
#  Unauthorized copying, modification, distribution, or use is prohibited.
#  See COPYRIGHT.md for complete terms.
#>
# create-circular-logo.ps1
# Script to create a circular version of the logo using ImageMagick
# Note: This requires ImageMagick to be installed on the system

# Check if ImageMagick is installed
try {
    $magickPath = (Get-Command magick -ErrorAction Stop).Source
    Write-Host "ImageMagick found at: $magickPath"
}
catch {
    Write-Host "ImageMagick is not installed. Please install it from https://imagemagick.org/script/download.php"
    exit 1
}

# Paths
$sourceImage = Join-Path (Get-Item -Path $PSScriptRoot).Parent.FullName "assets\images\square_logo.jpg"
$circularImage = Join-Path (Get-Item -Path $PSScriptRoot).Parent.FullName "assets\images\circular_logo.png"

# Check if source image exists
if (-not (Test-Path $sourceImage)) {
    Write-Host "Source image not found at: $sourceImage"
    exit 1
}

# Create a circular version of the logo with a blue border
$command = "magick `"$sourceImage`" -alpha set -background none " +
           "( -clone 0 -alpha extract -draw `"circle 50%,50% 50%,0`" -alpha shape ) " +
           "-compose copy_opacity -composite " +
           "-fill `"#0066cc`" -stroke `"#0066cc`" -strokewidth 5 -draw `"circle 50%,50% 50%,0`" " +
           "`"$circularImage`""

# Execute the command
Write-Host "Creating circular logo..."
Write-Host $command
Invoke-Expression $command

# Check if the circular image was created
if (Test-Path $circularImage) {
    Write-Host "Circular logo created successfully at: $circularImage"
}
else {
    Write-Host "Failed to create circular logo"
    exit 1
}

# Instructions for updating README.md
Write-Host "`nTo use the circular logo in README.md, update the image tag to:"
Write-Host "![rolodexter Logo](assets/images/circular_logo.png)" 