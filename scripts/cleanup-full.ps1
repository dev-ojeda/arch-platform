<#
.SYNOPSIS
    Advanced cleanup utility for pnpm/turbo monorepos.

.DESCRIPTION
    Safely stops Node.js-related processes and removes
    monorepo cache/build artifacts.

.PARAMETER DryRun
    Simulates execution without making changes.

.PARAMETER SkipPnpmStore
    Skips pnpm store cleanup.

.PARAMETER VerboseOutput
    Enables verbose logging.

.EXAMPLE
    ./scripts/cleanup-full.ps1

.EXAMPLE
    ./scripts/cleanup-full.ps1 -DryRun

.EXAMPLE
    ./scripts/cleanup-full.ps1 -VerboseOutput
#>

[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [switch]$DryRun,
    [switch]$SkipPnpmStore,
    [switch]$VerboseOutput
)

# =========================================================
# CONFIGURATION
# =========================================================

$ErrorActionPreference = 'Stop'

$script:WorkspaceRoot = Resolve-Path '.'

$script:ProcessesToStop = @(
    'node',
    'pnpm',
    'turbo',
    'tsx',
    'vite',
    'jest',
    'vitest'
)

$script:DirectoriesToRemove = @(
    '.turbo',
    'dist',
    'build',
    '.next',
    '.cache',
    'coverage'
)

$script:ExcludedPaths = @(
    '.git',
    '.vscode',
    '.idea',
    '.pnpm-store'
)

# =========================================================
# LOGGING
# =========================================================

function Write-Section {

    param(
        [Parameter(Mandatory)]
        [string]$Message
    )

    Write-Host ''
    Write-Host '=================================================' -ForegroundColor Cyan
    Write-Host " $Message" -ForegroundColor Cyan
    Write-Host '=================================================' -ForegroundColor Cyan
}

function Write-Info {

    param(
        [Parameter(Mandatory)]
        [string]$Message
    )

    Write-Host "[INFO] $Message" -ForegroundColor Gray
}

function Write-Success {

    param(
        [Parameter(Mandatory)]
        [string]$Message
    )

    Write-Host "[ OK ] $Message" -ForegroundColor Green
}

function Write-WarningMessage {

    param(
        [Parameter(Mandatory)]
        [string]$Message
    )

    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-ErrorMessage {

    param(
        [Parameter(Mandatory)]
        [string]$Message
    )

    Write-Host "[FAIL] $Message" -ForegroundColor Red
}

# =========================================================
# HELPERS
# =========================================================

function Test-ExcludedPath {

    param(
        [Parameter(Mandatory)]
        [string]$Path
    )

    foreach ($excludedPath in $script:ExcludedPaths) {

        if ($Path -like "*$excludedPath*") {
            return $true
        }
    }

    return $false
}

function Invoke-WithRetry {

    param(
        [Parameter(Mandatory)]
        [scriptblock]$ScriptBlock,

        [int]$MaxRetries = 3,

        [int]$DelaySeconds = 2
    )

    for ($attempt = 1; $attempt -le $MaxRetries; $attempt++) {

        try {

            & $ScriptBlock
            return $true
        }
        catch {

            Write-WarningMessage (
                "Attempt $attempt/$MaxRetries failed: $($_.Exception.Message)"
            )

            if ($attempt -lt $MaxRetries) {
                Start-Sleep -Seconds $DelaySeconds
            }
        }
    }

    return $false
}

# =========================================================
# PROCESS CLEANUP
# =========================================================

function Stop-WorkspaceProcesses {

    [CmdletBinding(SupportsShouldProcess = $true)]
    param(
        [Parameter(Mandatory)]
        [string[]]$ProcessNames
    )

    Write-Section 'Stopping development processes'

    foreach ($processName in $ProcessNames) {

        try {

            $processes = Get-Process `
                -Name $processName `
                -ErrorAction SilentlyContinue

            if (-not $processes) {

                Write-Info "No running process found: $processName"
                continue
            }

            foreach ($process in $processes) {

                $target = (
                    "$($process.ProcessName) " +
                    "(PID: $($process.Id))"
                )

                if ($DryRun) {

                    Write-Host "[DRYRUN] Stop process: $target" `
                        -ForegroundColor Magenta

                    continue
                }

                if ($PSCmdlet.ShouldProcess($target, 'Stop process')) {

                    Stop-Process `
                        -Id $process.Id `
                        -Force `
                        -ErrorAction Stop

                    Write-Success "Stopped process: $target"
                }
            }
        }
        catch {

            Write-WarningMessage (
                "Unable to stop process '$processName': $($_.Exception.Message)"
            )
        }
    }

    # Helps avoid EPERM issues on Windows
    Start-Sleep -Seconds 2
}

# =========================================================
# NODE_MODULES CLEANUP
# =========================================================

function Remove-RootNodeModules {

    [CmdletBinding(SupportsShouldProcess = $true)]
    param()

    Write-Section 'Removing root node_modules'

    $nodeModulesPath = Join-Path `
        $script:WorkspaceRoot `
        'node_modules'

    if (-not (Test-Path $nodeModulesPath)) {

        Write-Info 'Root node_modules not found'
        return
    }

    if ($DryRun) {

        Write-Host "[DRYRUN] Remove directory: $nodeModulesPath" `
            -ForegroundColor Magenta

        return
    }

    if ($PSCmdlet.ShouldProcess($nodeModulesPath, 'Remove directory')) {

        $removed = Invoke-WithRetry -ScriptBlock {

            Remove-Item `
                -LiteralPath $nodeModulesPath `
                -Recurse `
                -Force `
                -ErrorAction Stop
        }

        if ($removed) {

            Write-Success "Removed: $nodeModulesPath"
        }
        else {

            Write-ErrorMessage (
                "Failed removing: $nodeModulesPath"
            )
        }
    }
}

# =========================================================
# DIRECTORY CLEANUP
# =========================================================

function Get-WorkspaceDirectories {

    param(
        [Parameter(Mandatory)]
        [string]$DirectoryName
    )

    Get-ChildItem `
        -Path $script:WorkspaceRoot `
        -Directory `
        -Recurse `
        -Force `
        -ErrorAction SilentlyContinue |
    Where-Object {

        $_.Name -eq $DirectoryName -and
        -not (Test-ExcludedPath $_.FullName) -and
        $_.FullName -notlike '*node_modules*'
    }
}

function Remove-WorkspaceDirectories {

    [CmdletBinding(SupportsShouldProcess = $true)]
    param(
        [Parameter(Mandatory)]
        [string[]]$DirectoryNames
    )

    Write-Section 'Removing workspace directories'

    foreach ($directoryName in $DirectoryNames) {

        Write-Info "Searching: $directoryName"

        $directories = Get-WorkspaceDirectories `
            -DirectoryName $directoryName

        if (-not $directories) {

            Write-Info "No directories found: $directoryName"
            continue
        }

        foreach ($directory in $directories) {

            $targetPath = $directory.FullName

            if ($DryRun) {

                Write-Host "[DRYRUN] Remove directory: $targetPath" `
                    -ForegroundColor Magenta

                continue
            }

            if ($PSCmdlet.ShouldProcess($targetPath, 'Remove directory')) {

                $removed = Invoke-WithRetry -ScriptBlock {

                    Remove-Item `
                        -LiteralPath $targetPath `
                        -Recurse `
                        -Force `
                        -ErrorAction Stop
                }

                if ($removed) {

                    Write-Success "Removed: $targetPath"
                }
                else {

                    Write-ErrorMessage (
                        "Failed removing: $targetPath"
                    )
                }
            }
        }
    }
}

# =========================================================
# PNPM STORE CLEANUP
# =========================================================

function Clear-PnpmStore {

    [CmdletBinding()]
    param()

    if ($SkipPnpmStore) {

        Write-WarningMessage 'Skipping pnpm store cleanup'
        return
    }

    Write-Section 'Cleaning pnpm store'

    if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {

        Write-WarningMessage 'pnpm command not found'
        return
    }

    if ($DryRun) {

        Write-Host '[DRYRUN] pnpm store prune' `
            -ForegroundColor Magenta

        return
    }

    try {

        pnpm store prune

        if ($LASTEXITCODE -eq 0) {

            Write-Success 'pnpm store cleaned successfully'
        }
        else {

            Write-WarningMessage (
                "pnpm store prune exited with code: $LASTEXITCODE"
            )
        }
    }
    catch {

        Write-WarningMessage (
            "Failed to clean pnpm store: $($_.Exception.Message)"
        )
    }
}

# =========================================================
# MAIN
# =========================================================

Write-Section 'Starting workspace cleanup'

if ($VerboseOutput) {

    $VerbosePreference = 'Continue'

    Write-Verbose "WorkspaceRoot : $script:WorkspaceRoot"
    Write-Verbose "DryRun        : $DryRun"
    Write-Verbose "SkipPnpmStore : $SkipPnpmStore"
}

Stop-WorkspaceProcesses `
    -ProcessNames $script:ProcessesToStop

Remove-RootNodeModules

Remove-WorkspaceDirectories `
    -DirectoryNames $script:DirectoriesToRemove

Clear-PnpmStore

Write-Section 'Cleanup completed'

Write-Success 'Workspace cleaned successfully'