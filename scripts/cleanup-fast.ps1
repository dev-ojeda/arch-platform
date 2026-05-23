# scripts/cleanup-full.ps1

[CmdletBinding()]
param(
    [switch]$DryRun,
    [switch]$SkipPnpmStore,
    [switch]$VerboseOutput
)

Set-StrictMode -Version Latest

$ErrorActionPreference = "Stop"

# =============================================================================
# CONFIGURATION
# =============================================================================

$Stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

$RootPath = (Resolve-Path ".").Path

if ($RootPath.Length -lt 5) {
    throw "Unsafe root path detected: $RootPath"
}

$DirectoriesToDelete = @(
    "node_modules",
    ".pnpm",
    "dist",
    "build",
    "coverage",
    ".turbo",
    ".next",
    ".cache",
    ".vite",
    ".nx",
    ".parcel-cache",
    ".swc"
)

$FilesToDelete = @(
    "*.tsbuildinfo",
    ".eslintcache",
    "pnpm-lock.yaml"
)

$ExcludedPaths = @(
    ".git",
    ".idea",
    ".vscode"
)

# =============================================================================
# STATE
# =============================================================================

$script:Stats = @{
    RemovedDirectories = 0
    RemovedFiles       = 0
    FailedItems        = [System.Collections.Generic.List[string]]::new()
}

# =============================================================================
# UI HELPERS
# =============================================================================

function Write-Section {
    param(
        [Parameter(Mandatory)]
        [string]$Message
    )

    $Separator = "=" * 72

    Write-Host ""
    Write-Host $Separator -ForegroundColor Cyan
    Write-Host " $Message" -ForegroundColor Cyan
    Write-Host $Separator -ForegroundColor Cyan
    Write-Host ""
}

function Write-Info {
    param([string]$Message)

    Write-Host "[INFO] $Message" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Message)

    Write-Host "[ OK ] $Message" -ForegroundColor Green
}

function Write-WarningMessage {
    param([string]$Message)

    Write-Host "[WARN] $Message" -ForegroundColor DarkYellow
}

function Write-ErrorMessage {
    param([string]$Message)

    Write-Host "[ERR ] $Message" -ForegroundColor Red
}

function Write-VerboseMessage {
    param([string]$Message)

    if ($VerboseOutput) {
        Write-Host "[VERB] $Message" -ForegroundColor DarkGray
    }
}

# =============================================================================
# HELPERS
# =============================================================================

function Test-ExcludedPath {
    param(
        [Parameter(Mandatory)]
        [string]$Path
    )

    foreach ($Excluded in $ExcludedPaths) {

        if ($Path -match [regex]::Escape($Excluded)) {
            return $true
        }
    }

    return $false
}

function Get-WorkspaceItems {

    Write-Info "Scanning workspace..."

    Get-ChildItem `
        -Path $RootPath `
        -Recurse `
        -Force `
        -ErrorAction SilentlyContinue |
    Where-Object {

        $Item = $_

        if (Test-ExcludedPath -Path $Item.FullName) {

            Write-VerboseMessage "Excluded: $($Item.FullName)"

            return $false
        }

        if ($Item.PSIsContainer) {
            return $Item.Name -in $DirectoriesToDelete
        }

        foreach ($Pattern in $FilesToDelete) {

            if ($Item.Name -like $Pattern) {
                return $true
            }
        }

        return $false
    }
}

function Remove-WorkspaceItem {
    param(
        [Parameter(Mandatory)]
        [System.IO.FileSystemInfo]$Item
    )

    try {

        if ($DryRun) {
            Write-Host "[DRYRUN] $($Item.FullName)" -ForegroundColor Magenta
            return
        }

        Remove-Item `
            -LiteralPath $Item.FullName `
            -Force `
            -Recurse `
            -ErrorAction Stop

        if ($Item.PSIsContainer) {
            $script:Stats.RemovedDirectories++
        }
        else {
            $script:Stats.RemovedFiles++
        }

        Write-Success $Item.FullName
    }
    catch {

        $script:Stats.FailedItems.Add($Item.FullName)

        Write-ErrorMessage "Failed to remove: $($Item.FullName)"

        if ($VerboseOutput) {
            Write-Host $_.Exception.Message -ForegroundColor DarkRed
        }
    }
}

function Invoke-WorkspaceCleanup {

    Write-Section "REMOVING WORKSPACE ARTIFACTS"

    $Items = Get-WorkspaceItems

    foreach ($Item in $Items) {
        Remove-WorkspaceItem -Item $Item
    }
}

function Invoke-PnpmStorePrune {

    if ($SkipPnpmStore) {

        Write-WarningMessage "Skipping pnpm store prune"

        return
    }

    Write-Section "PNPM STORE"

    if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {

        Write-WarningMessage "pnpm command not found"

        return
    }

    try {

        Write-Info "Running: pnpm store prune"

        if ($DryRun) {
            Write-Host "[DRYRUN] pnpm store prune" -ForegroundColor Magenta
        }
        else {
            pnpm store prune
        }

        Write-Success "pnpm store prune completed"
    }
    catch {

        Write-ErrorMessage "pnpm store prune failed"

        if ($VerboseOutput) {
            Write-Host $_.Exception.Message -ForegroundColor DarkRed
        }
    }
}

function Show-Summary {

    Write-Section "CLEANUP FINISHED"

    Write-Host "Directories removed : $($Stats.RemovedDirectories)"
    Write-Host "Files removed       : $($Stats.RemovedFiles)"
    Write-Host "Failed items        : $($Stats.FailedItems.Count)"
    Write-Host "Elapsed time        : $($Stopwatch.Elapsed)"
    Write-Host ""

    if ($Stats.FailedItems.Count -gt 0) {

        Write-WarningMessage "Items that could not be removed:"

        foreach ($Item in $Stats.FailedItems) {
            Write-Host " - $Item"
        }

        Write-Host ""
    }

    Write-Success "Workspace cleanup completed"
}

# =============================================================================
# START
# =============================================================================

Write-Section "FULL CLEANUP WORKSPACE / MONOREPO"

Write-Info "Root path: $RootPath"

if ($DryRun) {
    Write-WarningMessage "DryRun enabled. No files will be deleted."
}

Invoke-WorkspaceCleanup

Invoke-PnpmStorePrune

Show-Summary