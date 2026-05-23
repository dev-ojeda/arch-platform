# scripts/reset-workspace.ps1

[CmdletBinding()]
param(
  [switch]$DryRun,
  [switch]$VerboseOutput
)

$ErrorActionPreference = "Stop"

# ========================================
# HELPERS
# ========================================

function Write-Info {
  param([string]$Message)

  Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
  param([string]$Message)

  Write-Host "[OK]   $Message" -ForegroundColor Green
}

function Write-WarningMessage {
  param([string]$Message)

  Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-ErrorMessage {
  param([string]$Message)

  Write-Host "[ERR]  $Message" -ForegroundColor Red
}

function Remove-WorkspaceItem {
  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  if (-not (Test-Path $Path)) {

    if ($VerboseOutput) {
      Write-WarningMessage "Path not found: $Path"
    }

    return
  }

  try {

    if ($DryRun) {
      Write-Host "[DRYRUN] Remove: $Path" -ForegroundColor Magenta
      return
    }

    Remove-Item `
      -LiteralPath $Path `
      -Recurse `
      -Force

    Write-Success "Removed: $Path"
  }
  catch {
    Write-ErrorMessage "Failed to remove: $Path"

    if ($VerboseOutput) {
      Write-Host $_.Exception.Message -ForegroundColor DarkRed
    }
  }
}

# ========================================
# STOP NODE PROCESSES
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " STOPPING NODE PROCESSES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {

  $NodeProcesses = Get-Process node -ErrorAction SilentlyContinue

  if ($null -eq $NodeProcesses) {
    Write-WarningMessage "No node processes found"
  }
  else {

    foreach ($Process in $NodeProcesses) {

      if ($DryRun) {
        Write-Host "[DRYRUN] Stop process: $($Process.Id)" -ForegroundColor Magenta
        continue
      }

      Stop-Process `
        -Id $Process.Id `
        -Force

      Write-Success "Stopped node process: $($Process.Id)"
    }
  }
}
catch {
  Write-ErrorMessage "Failed to stop node processes"

  if ($VerboseOutput) {
    Write-Host $_.Exception.Message -ForegroundColor DarkRed
  }
}

# ========================================
# CLEAN WORKSPACE
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " CLEANING WORKSPACE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$PathsToRemove = @(
  "node_modules",
  ".turbo",
  "dist",
  "coverage",
  ".next"
)

foreach ($Path in $PathsToRemove) {

  Write-Info "Processing: $Path"

  Remove-WorkspaceItem -Path $Path
}

# ========================================
# FINISHED
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " RESET COMPLETED" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Success "Workspace reset finished"