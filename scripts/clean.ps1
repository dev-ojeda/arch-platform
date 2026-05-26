[CmdletBinding(SupportsShouldProcess)]
param(
  [switch]$IncludeNodeModules,
  [switch]$SkipDist,
  [switch]$SkipTurbo,
  [switch]$SkipTsBuildInfo
)

$ErrorActionPreference = 'Stop'

$workspaceRoot = (Resolve-Path '.').Path

$excludedDirectories = @(
  '.git',
  '.vscode',
  '.idea'
)

$protectedDirectories = @(
  (Join-Path $workspaceRoot 'node_modules')
)

$directoryTargets = @()

if ($IncludeNodeModules) {
  $directoryTargets += 'node_modules'
}

if (-not $SkipDist) {
  $directoryTargets += 'dist'
}

if (-not $SkipTurbo) {
  $directoryTargets += '.turbo'
}

$fileTargets = @()

if (-not $SkipTsBuildInfo) {
  $fileTargets += '*.tsbuildinfo'
}

$removedDirectories = 0
$removedFiles = 0

Write-Host ''
Write-Host '======================================='
Write-Host ' Workspace Cleanup'
Write-Host '======================================='
Write-Host ''

function Test-ExcludedDirectory {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  foreach ($excludedDirectory in $excludedDirectories) {
    if ($Path -match [regex]::Escape($excludedDirectory)) {
      return $true
    }
  }

  return $false
}

function Test-ProtectedDirectory {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  foreach ($protectedDirectory in $protectedDirectories) {
    if ($Path -eq $protectedDirectory) {
      return $true
    }
  }

  return $false
}

function Remove-WorkspaceDirectory {
  [CmdletBinding(SupportsShouldProcess)]
  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  if ($PSCmdlet.ShouldProcess($Path, 'Remove directory')) {
    Write-Host "[DEL] $Path"

    Remove-Item `
      -Path $Path `
      -Recurse `
      -Force `
      -ErrorAction Stop
  }
}

function Remove-WorkspaceFile {
  [CmdletBinding(SupportsShouldProcess)]
  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  if ($PSCmdlet.ShouldProcess($Path, 'Remove file')) {
    Write-Host "[DEL] $Path"

    Remove-Item `
      -Path $Path `
      -Force `
      -ErrorAction Stop
  }
}

function Get-WorkspaceDirectories {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [string]$Name
  )

  Get-ChildItem `
    -Path $workspaceRoot `
    -Directory `
    -Recurse `
    -Force `
    -Filter $Name `
    -ErrorAction SilentlyContinue |
  Where-Object {
    -not (Test-ExcludedDirectory -Path $_.FullName)
  } |
  Where-Object {
    -not (Test-ProtectedDirectory -Path $_.FullName)
  }
}

function Get-WorkspaceFiles {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [string]$Pattern
  )

  Get-ChildItem `
    -Path $workspaceRoot `
    -File `
    -Recurse `
    -Force `
    -Filter $Pattern `
    -ErrorAction SilentlyContinue |
  Where-Object {
    -not (Test-ExcludedDirectory -Path $_.FullName)
  }
}

foreach ($target in $directoryTargets) {
  Get-WorkspaceDirectories -Name $target |
  ForEach-Object {
    try {
      Remove-WorkspaceDirectory -Path $_.FullName
      $removedDirectories++
    }
    catch {
      Write-Warning "Failed to remove directory: $($_.FullName)"
      Write-Warning $_.Exception.Message
    }
  }
}

foreach ($target in $fileTargets) {
  Get-WorkspaceFiles -Pattern $target |
  ForEach-Object {
    try {
      Remove-WorkspaceFile -Path $_.FullName
      $removedFiles++
    }
    catch {
      Write-Warning "Failed to remove file: $($_.FullName)"
      Write-Warning $_.Exception.Message
    }
  }
}

Write-Host ''
Write-Host '======================================='
Write-Host ' Cleanup Summary'
Write-Host '======================================='
Write-Host ''

Write-Host "Removed directories : $removedDirectories"
Write-Host "Removed files       : $removedFiles"

Write-Host ''

if ($IncludeNodeModules) {
  Write-Host '[INFO] Package node_modules cleanup enabled'
  Write-Host '[INFO] Root node_modules preserved'
  Write-Host ''
}

Write-Host 'Workspace cleanup completed'
Write-Host ''