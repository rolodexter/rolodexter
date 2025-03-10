function Get-RelativePath {
    param($currentPath, $targetPath)
    $depth = ($currentPath.Substring($PWD.Path.Length + 1).Split([IO.Path]::DirectorySeparatorChar)).Count - 1
    "../" * $depth
}

function Format-Header {
    param($title, $rootPath)
    @"
# $title

<p align="center">
  <a href="$($rootPath)README.md">
    <img src="$($rootPath)assets/images/rolodexter_logo.jpg" alt="rolodexter Logo" width="80px" style="border-radius: 50%;">
  </a>
</p>

<p align="center">
  <a href="$($rootPath)README.md">Home</a> | <a href="$($rootPath)research/research.md">Research</a> | <a href="$($rootPath)techstack/techstack.md">Tech Stack</a> | <a href="$($rootPath)contact.md">Contact</a>
</p>

<details>
<summary>Notice</summary>

This repository is protected by copyright and subject to usage restrictions. See the [Copyright Notice]($($rootPath)COPYRIGHT.md) for details.
</details>

"@
}

# Special header for root README
$rootHeader = @"
# rolodexter

<p align="center">
  <a href="https://github.com/rolodexter/rolodexter">
    <img src="assets/images/rolodexter_logo.jpg" alt="rolodexter Logo" width="100px" style="border-radius: 50%;">
  </a>
</p>

<p align="center">
  <a href="README.md">Home</a> | <a href="research/research.md">Research</a> | <a href="techstack/techstack.md">Tech Stack</a> | <a href="contact.md">Contact</a>
</p>

<details>
<summary>Notice</summary>

This repository is protected by copyright and subject to usage restrictions. See the [Copyright Notice](COPYRIGHT.md) for details.
</details>

"@

# First handle the root README.md specially
$readmePath = Join-Path $PWD.Path "README.md"
if (Test-Path $readmePath) {
    $content = [System.IO.File]::ReadAllText($readmePath)
    if ($content -match "(?s)# rolodexter.*?(?=\r?\nThis is a)") {
        $content = $content -replace "(?s)# rolodexter.*?(?=\r?\nThis is a)", $rootHeader
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($readmePath, $content, $utf8NoBom)
    }
}

# Then handle all other .md files
Get-ChildItem -Path . -Recurse -Filter "*.md" | ForEach-Object {
    # Skip README.md in root directory
    if ($_.Name -eq "README.md" -and $_.DirectoryName -eq $PWD.Path) {
        return
    }
    
    # Calculate path to root
    $rootPath = Get-RelativePath $_.FullName $PWD.Path
    
    # Read the content
    $content = [System.IO.File]::ReadAllText($_.FullName)
    
    # Extract title and content
    if ($content -match "(?s)^#\s+(.+?)(\r?\n|\$)(.*)") {
        $title = $matches[1]
        $mainContent = $matches[3]
    } else {
        $title = $_.BaseName -replace "-", " " -replace "(?:^|_)(\w)", { $args[0].Groups[1].Value.ToUpper() }
        $mainContent = $content
    }
    
    # Special handling for COPYRIGHT.md
    if ($_.Name -eq "COPYRIGHT.md") {
        $title = "Copyright Notice"
    }
    
    # Remove any existing headers and duplicates
    $mainContent = $mainContent -replace "(?s)^#.*?\r?\n", ""  # Remove any existing title
    $mainContent = $mainContent -replace "(?s)<p align=""center"">.*?</p>\s*<p align=""center"">.*?</p>\s*<details>.*?</details>\s*", ""
    
    # Remove any remaining duplicate headers that might appear later in the file
    $mainContent = $mainContent -replace "(?s)<p align=""center"">.*?</p>\s*<p align=""center"">.*?</p>\s*<details>.*?</details>", ""
    
    # Format the new content
    $header = Format-Header $title $rootPath
    $newContent = $header + $mainContent.TrimStart()
    
    # Write with UTF-8 encoding without BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($_.FullName, $newContent, $utf8NoBom)
} 