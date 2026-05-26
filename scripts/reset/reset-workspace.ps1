# scripts/reset/reset-workspace.ps1

<#
.SYNOPSIS
    Performs a destructive workspace reset.

.DESCRIPTION
    Stops active Node.js processes and removes generated artifacts.

    Optionally removes:
    - root node_modules

    Intended for:
    - corrupted installs
    - dependency graph resets
    - broken symlinks
    - clean CI reproduction
    - full workspace rebuilds

    This script is intentionally destructive.

.FEATURES
    - Safe removal
    - DryRun support
    - Verbose logging
    - ShouldProcess support
    - Process termination
    - Monorepo-aware traversal
    - Protected directory exclusions

.EXAMPLE
    ./reset-workspace.ps1

.EXAMPLE
    ./reset-workspace.ps1 -IncludeRootNodeModules

.EXAMPLE
    ./reset-workspace.ps1 -DryRun

.EXAMPLE
    ./reset-workspace.ps1 -WhatIf
#>

[CmdletBinding(SupportsShouldProcess)]
param(
  [switch]$IncludeRootNodeModules,

  [switch]$DryRun,

  [switch]$VerboseOutput,

  [string]$RootPath = '.'
)

Set-StrictMode -Version Latest

$ErrorActionPreference = 'Stop'

# =========================================================
# CONSTANTS
# =========================================================

$ExcludedDirectories = @(
  '.git',
  '.idea',
  '.vscode'
)

$CleanupDirectories = @(
  'dist',
  '.turbo',
  'coverage',
  '.next',
  'node_modules'
)

$cleanupFiles = @(
  '*.tsbuildinfo',
  '*.d.ts',
  '*.d.ts.map',
  '*.js.map'
)

# =========================================================
# LOGGER
# =========================================================

function Write-Log {
  param(
    [ValidateSet(
      'INFO',
      'WARN',
      'ERROR',
      'SUCCESS',
      'DEBUG'
    )]
    [string]$Level,

    [Parameter(Mandatory)]
    [string]$Message
  )

  if (
    $Level -eq 'DEBUG' -and
    -not $VerboseOutput
  ) {
    return
  }

  $Color = switch ($Level) {
    'INFO' { 'Cyan' }
    'WARN' { 'Yellow' }
    'ERROR' { 'Red' }
    'SUCCESS' { 'Green' }
    'DEBUG' { 'DarkGray' }
  }

  Write-Host "[$Level] $Message" `
    -ForegroundColor $Color
}

# =========================================================
# HELPERS
# =========================================================

function Test-ExcludedPath {
  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  foreach ($ExcludedDirectory in $ExcludedDirectories) {
    if (
      $Path -match
      [regex]::Escape($ExcludedDirectory)
    ) {
      return $true
    }
  }

  return $false
}

function Remove-WorkspacePath {
  [CmdletBinding(SupportsShouldProcess)]
  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    Write-Log `
      -Level DEBUG `
      -Message "Path not found: $Path"

    return $false
  }

  if ($DryRun) {
    Write-Host "[DRYRUN] Remove: $Path" `
      -ForegroundColor Magenta

    return $true
  }

  if (
    $PSCmdlet.ShouldProcess(
      $Path,
      'Remove workspace artifact'
    )
  ) {
    Remove-Item `
      -LiteralPath $Path `
      -Recurse `
      -Force `
      -ErrorAction Stop

    Write-Log `
      -Level SUCCESS `
      -Message "Removed: $Path"

    return $true
  }

  return $false
}

# =========================================================
# VALIDATION
# =========================================================

try {
  $WorkspaceRoot =
  (Resolve-Path -Path $RootPath).Path
}
catch {
  Write-Log `
    -Level ERROR `
    -Message "Root path not found: $RootPath"

  exit 1
}

$RootNodeModules =
Join-Path $WorkspaceRoot 'node_modules'

# =========================================================
# START
# =========================================================

Write-Host ''

Write-Host `
  '========================================' `
  -ForegroundColor Cyan

Write-Host `
  ' WORKSPACE RESET' `
  -ForegroundColor Cyan

Write-Host `
  '========================================' `
  -ForegroundColor Cyan

Write-Host ''

Write-Log `
  -Level INFO `
  -Message "Workspace root: $WorkspaceRoot"

# =========================================================
# STOP NODE PROCESSES
# =========================================================

Write-Log `
  -Level INFO `
  -Message 'Stopping Node.js processes'

Get-Process node -ErrorAction SilentlyContinue |
ForEach-Object {
  try {
    if ($DryRun) {
      Write-Host `
        "[DRYRUN] Stop process: $($_.Id)" `
        -ForegroundColor Magenta

      return
    }

    Stop-Process `
      -Id $_.Id `
      -Force `
      -ErrorAction Stop

    Write-Log `
      -Level SUCCESS `
      -Message "Stopped process: $($_.Id)"
  }
  catch {
    Write-Log `
      -Level WARN `
      -Message "Failed to stop process: $($_.Id)"

    if ($VerboseOutput) {
      Write-Host `
        $_.Exception.Message `
        -ForegroundColor DarkRed
    }
  }
}

# =========================================================
# DISCOVERY
# =========================================================

$DirectoriesToRemove = @()

foreach ($Target in $CleanupDirectories) {

  Write-Log `
    -Level DEBUG `
    -Message "Scanning directories: $Target"

  $Directories =
  Get-ChildItem `
    -Path $WorkspaceRoot `
    -Directory `
    -Recurse `
    -Force `
    -Filter $Target `
    -ErrorAction SilentlyContinue |
  Where-Object {
    -not (
      Test-ExcludedPath `
        -Path $_.FullName
    )
  }

  foreach ($Directory in $Directories) {

    $DirectoryPath = $Directory.FullName

    if (
      $DirectoryPath -eq $RootNodeModules -and
      -not $IncludeRootNodeModules
    ) {
      Write-Log `
        -Level DEBUG `
        -Message 'Skipping root node_modules'

      continue
    }

    $DirectoriesToRemove += $Directory
  }
}

$FilesToRemove = @()

foreach ($Pattern in $CleanupFiles) {

  Write-Log `
    -Level DEBUG `
    -Message "Scanning files: $Pattern"

  $Files =
  Get-ChildItem `
    -Path $WorkspaceRoot `
    -File `
    -Recurse `
    -Force `
    -Filter $Pattern `
    -ErrorAction SilentlyContinue |
  Where-Object {
    -not (
      Test-ExcludedPath `
        -Path $_.FullName
    )
  }

  $FilesToRemove += $Files
}

# =========================================================
# CLEANUP
# =========================================================

$RemovedDirectories = 0
$RemovedFiles = 0
$FailedItems = 0

foreach ($Directory in $DirectoriesToRemove) {

  try {
    $Removed =
    Remove-WorkspacePath `
      -Path $Directory.FullName

    if ($Removed) {
      $RemovedDirectories++
    }
  }
  catch {
    Write-Log `
      -Level ERROR `
      -Message (
      "Failed to remove directory: " +
      $Directory.FullName
    )

    Write-Log `
      -Level ERROR `
      -Message $_.Exception.Message

    $FailedItems++
  }
}

foreach ($File in $FilesToRemove) {

  try {
    $Removed =
    Remove-WorkspacePath `
      -Path $File.FullName

    if ($Removed) {
      $RemovedFiles++
    }
  }
  catch {
    Write-Log `
      -Level ERROR `
      -Message (
      "Failed to remove file: " +
      $File.FullName
    )

    Write-Log `
      -Level ERROR `
      -Message $_.Exception.Message

    $FailedItems++
  }
}

# =========================================================
# SUMMARY
# =========================================================

Write-Host ''

Write-Host `
  '----------------------------------------' `
  -ForegroundColor DarkGray

Write-Host `
  ' RESET SUMMARY' `
  -ForegroundColor Cyan

Write-Host `
  '----------------------------------------' `
  -ForegroundColor DarkGray

Write-Host ''

Write-Host "Directories removed : $RemovedDirectories"
Write-Host "Files removed       : $RemovedFiles"
Write-Host "Failures            : $FailedItems"

if ($DryRun) {
  Write-Host ''
  Write-Host 'Mode : DRY RUN' `
    -ForegroundColor Magenta
}

Write-Host ''

if ($IncludeRootNodeModules) {
  Write-Log `
    -Level WARN `
    -Message 'Root node_modules removal enabled'
}

if ($FailedItems -gt 0) {
  Write-Log `
    -Level WARN `
    -Message 'Workspace reset completed with warnings'

  exit 1
}

Write-Log `
  -Level SUCCESS `
  -Message 'Workspace reset completed successfully'

Write-Host ''