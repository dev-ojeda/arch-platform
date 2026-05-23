<#
.SYNOPSIS
    Removes all "dist" directories from the workspace.

.DESCRIPTION
    Recursively scans the repository and deletes all directories named "dist".

    Features:
    - Safe deletion
    - Verbose output support
    - DryRun mode
    - Error handling
    - Colored logging
    - Supports ShouldProcess (-WhatIf / -Confirm)

.EXAMPLE
    ./cleanup-dist.ps1

.EXAMPLE
    ./cleanup-dist.ps1 -Verbose

.EXAMPLE
    ./cleanup-dist.ps1 -DryRun

.EXAMPLE
    ./cleanup-dist.ps1 -WhatIf

.NOTES
    Recommended for monorepos using:
    - pnpm
    - turbo
    - nx
    - lerna
#>

[CmdletBinding(SupportsShouldProcess)]
param(
  [switch]$DryRun,

  [switch]$VerboseOutput,

  [string]$RootPath = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------
# Logging Helpers
# ---------------------------------------------------------------------

function Write-Info {
  param([string]$Message)

  Write-Host "[INFO ] $Message" -ForegroundColor Cyan
}

function Write-Warn {
  param([string]$Message)

  Write-Host "[WARN ] $Message" -ForegroundColor Yellow
}

function Write-ErrorMessage {
  param([string]$Message)

  Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Success {
  param([string]$Message)

  Write-Host "[ OK  ] $Message" -ForegroundColor Green
}

function Write-DebugLog {
  param([string]$Message)

  if ($VerboseOutput) {
    Write-Host "[DEBUG] $Message" -ForegroundColor DarkGray
  }
}

# ---------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------

try {
  $ResolvedRoot = Resolve-Path -Path $RootPath
}
catch {
  Write-ErrorMessage "Root path not found: $RootPath"
  exit 1
}

Write-Info "Starting dist cleanup..."
Write-DebugLog "Resolved root path: $ResolvedRoot"

# ---------------------------------------------------------------------
# Find dist directories
# ---------------------------------------------------------------------

$DistDirectories = Get-ChildItem `
  -Path $ResolvedRoot `
  -Directory `
  -Recurse `
  -Force `
  -ErrorAction SilentlyContinue |
Where-Object {
  $_.Name -eq "dist"
}

if (-not $DistDirectories) {
  Write-Warn "No dist directories found."
  exit 0
}

Write-Info "Found $($DistDirectories.Count) dist director$(if($DistDirectories.Count -eq 1){'y'}else{'ies'})."

# ---------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------

$RemovedCount = 0
$FailedCount = 0

foreach ($Directory in $DistDirectories) {

  $TargetPath = $Directory.FullName

  Write-DebugLog "Processing: $TargetPath"

  if ($DryRun) {
    Write-Host "[DRYRUN] Would remove: $TargetPath" -ForegroundColor Magenta
    continue
  }

  if ($PSCmdlet.ShouldProcess($TargetPath, "Remove directory")) {

    try {
      Remove-Item `
        -Path $TargetPath `
        -Recurse `
        -Force `
        -ErrorAction Stop

      Write-Success "Removed: $TargetPath"

      $RemovedCount++
    }
    catch {
      Write-ErrorMessage "Failed to remove: $TargetPath"
      Write-ErrorMessage $_.Exception.Message

      $FailedCount++
    }
  }
}

# ---------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------

Write-Host ""
Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
Write-Info "Cleanup Summary"
Write-Host "--------------------------------------------------" -ForegroundColor DarkGray

Write-Host "Removed : $RemovedCount"
Write-Host "Failed  : $FailedCount"

if ($DryRun) {
  Write-Host "Mode    : DRY RUN" -ForegroundColor Magenta
}

Write-Host ""

if ($FailedCount -gt 0) {
  exit 1
}

Write-Success "Dist cleanup completed successfully."
exit 0