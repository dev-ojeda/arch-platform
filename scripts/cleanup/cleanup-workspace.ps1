# scripts/cleanup/cleanup-workspace.ps1

<#
.SYNOPSIS
    Cleans generated workspace artifacts.

.DESCRIPTION
    Removes generated directories and files commonly produced by:
    - TypeScript
    - Turbo
    - Next.js
    - Vitest
    - TSUP

    This script intentionally DOES NOT:
    - remove node_modules
    - stop running processes
    - modify lockfiles

    For destructive operations use:
    scripts/reset/reset-workspace.ps1

.FEATURES
    - Safe cleanup
    - DryRun support
    - Verbose logging
    - ShouldProcess support
    - Monorepo-aware traversal
    - Excluded directory protection

.EXAMPLE
    ./cleanup-workspace.ps1

.EXAMPLE
    ./cleanup-workspace.ps1 -DryRun

.EXAMPLE
    ./cleanup-workspace.ps1 -VerboseOutput

.EXAMPLE
    ./cleanup-workspace.ps1 -WhatIf
#>

[CmdletBinding(SupportsShouldProcess)]
param(
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
  '.vscode',
  'node_modules'
)

$CleanupDirectories = @(
  'dist',
  '.turbo',
  'coverage',
  '.next',
  '.arch',
  '.arch-cache'
)

$CleanupFiles = @(
  '*.tsbuildinfo',
  '*.tmp',
  '*.cache'
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
      'Remove generated artifact'
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

# =========================================================
# START
# =========================================================

Write-Host ''

Write-Host `
  '========================================' `
  -ForegroundColor Cyan

Write-Host `
  ' WORKSPACE CLEANUP' `
  -ForegroundColor Cyan

Write-Host `
  '========================================' `
  -ForegroundColor Cyan

Write-Host ''

Write-Log `
  -Level INFO `
  -Message "Workspace root: $WorkspaceRoot"

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

  $DirectoriesToRemove += $Directories
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
      -Message "Failed to remove directory: $($Directory.FullName)"

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
      -Message "Failed to remove file: $($File.FullName)"

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
  ' CLEANUP SUMMARY' `
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

if ($FailedItems -gt 0) {
  Write-Log `
    -Level WARN `
    -Message 'Cleanup completed with warnings'

  exit 1
}

Write-Log `
  -Level SUCCESS `
  -Message 'Workspace cleanup completed successfully'

Write-Host ''