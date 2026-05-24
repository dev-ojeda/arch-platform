<#
.SYNOPSIS
    Advanced workspace cleanup utility for pnpm/turbo monorepos.

.DESCRIPTION
    Safely stops development processes and removes:
    - node_modules
    - turbo caches
    - build artifacts
    - coverage
    - tsbuildinfo
    - pnpm cache artifacts

.PARAMETER DryRun
    Simulates cleanup operations without deleting files.

.PARAMETER SkipPnpmStore
    Skips pnpm store pruning.

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

$script:WorkspaceRoot = Resolve-Path (
  Join-Path $PSScriptRoot '..'
)

$script:ProcessesToStop = @(
  'node',
  'pnpm',
  'turbo',
  'tsx',
  'vite',
  'jest',
  'vitest',

  'eslint_d',
  'tsserver',

  'Code',
  'Code - Insiders'
)

$script:DirectoriesToRemove = @(
  '.turbo',
  '.cache',
  '.vite',

  'dist',
  'build',
  'coverage',
  '.next'
)

$script:ExcludedPaths = @(
  '.git',
  '.vscode',
  '.idea'
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

  Write-Host `
    '=================================================' `
    -ForegroundColor Cyan

  Write-Host `
    " $Message" `
    -ForegroundColor Cyan

  Write-Host `
    '=================================================' `
    -ForegroundColor Cyan
}

function Write-Info {

  param(
    [Parameter(Mandatory)]
    [string]$Message
  )

  Write-Host `
    "[INFO] $Message" `
    -ForegroundColor Gray
}

function Write-Success {

  param(
    [Parameter(Mandatory)]
    [string]$Message
  )

  Write-Host `
    "[ OK ] $Message" `
    -ForegroundColor Green
}

function Write-WarningMessage {

  param(
    [Parameter(Mandatory)]
    [string]$Message
  )

  Write-Host `
    "[WARN] $Message" `
    -ForegroundColor Yellow
}

function Write-ErrorMessage {

  param(
    [Parameter(Mandatory)]
    [string]$Message
  )

  Write-Host `
    "[FAIL] $Message" `
    -ForegroundColor Red
}

# =========================================================
# VALIDATION
# =========================================================

function Assert-WorkspaceRoot {

  $workspaceFile = Join-Path `
    $script:WorkspaceRoot `
    'pnpm-workspace.yaml'

  if (-not (Test-Path $workspaceFile)) {

    throw (
      'Workspace validation failed. ' +
      'pnpm-workspace.yaml not found.'
    )
  }
}

# =========================================================
# HELPERS
# =========================================================

function Test-ExcludedPath {

  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  $pathSegments = $Path.Split(
    [IO.Path]::DirectorySeparatorChar
  )

  foreach ($excludedPath in $script:ExcludedPaths) {

    if ($pathSegments -contains $excludedPath) {

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

  for (
    $attempt = 1;
    $attempt -le $MaxRetries;
    $attempt++
  ) {

    try {

      & $ScriptBlock

      return $true
    }
    catch {

      Write-WarningMessage (
        "Attempt $attempt/$MaxRetries failed: " +
        "$($_.Exception.Message)"
      )

      if ($attempt -lt $MaxRetries) {

        Start-Sleep `
          -Seconds $DelaySeconds
      }
    }
  }

  return $false
}

function Remove-WithCmdFallback {

  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  try {

    cmd /c rd /s /q "$Path"

    return $true
  }
  catch {

    return $false
  }
}

function Clear-ReadOnlyAttributes {

  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  try {

    Get-ChildItem `
      -LiteralPath $Path `
      -Recurse `
      -Force `
      -ErrorAction SilentlyContinue |
    ForEach-Object {

      try {

        $_.Attributes = 'Normal'
      }
      catch {
      }
    }

    attrib `
      -R `
      "$Path\*" `
      /S `
      /D `
      2>$null
  }
  catch {

    Write-Verbose (
      "Unable to clear attributes: $Path"
    )
  }
}

function Remove-WorkspaceItem {

  [CmdletBinding(SupportsShouldProcess = $true)]
  param(
    [Parameter(Mandatory)]
    [string]$Path,

    [Parameter(Mandatory)]
    [ValidateSet('File', 'Directory')]
    [string]$ItemType
  )

  if (-not (Test-Path $Path)) {

    Write-Info "Path not found: $Path"

    return
  }

  if ($DryRun) {

    Write-Host `
      "[DRYRUN] Remove $ItemType : $Path" `
      -ForegroundColor Magenta

    return
  }

  if ($PSCmdlet.ShouldProcess(
      $Path,
      "Remove $ItemType"
    )) {

    Clear-ReadOnlyAttributes `
      -Path $Path

    $removed = Invoke-WithRetry -ScriptBlock {

      Remove-Item `
        -LiteralPath $Path `
        -Recurse `
        -Force `
        -ErrorAction Stop
    }

    if (-not $removed) {

      Write-WarningMessage (
        'Trying cmd fallback removal'
      )

      $removed = Remove-WithCmdFallback `
        -Path $Path
    }

    if ($removed) {

      Write-Success "Removed: $Path"
    }
    else {

      Write-ErrorMessage (
        "Failed removing: $Path"
      )
    }
  }
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

  Write-Section `
    'Stopping development processes'

  foreach ($processName in $ProcessNames) {

    try {

      $processes = Get-Process `
        -Name $processName `
        -ErrorAction SilentlyContinue

      if (-not $processes) {

        Write-Info (
          "No running process found: $processName"
        )

        continue
      }

      foreach ($process in $processes) {

        $target = (
          "$($process.ProcessName) " +
          "(PID: $($process.Id))"
        )

        if ($DryRun) {

          Write-Host `
            "[DRYRUN] Stop process: $target" `
            -ForegroundColor Magenta

          continue
        }

        if ($PSCmdlet.ShouldProcess(
            $target,
            'Stop process'
          )) {

          Stop-Process `
            -Id $process.Id `
            -Force `
            -ErrorAction Stop

          Write-Success (
            "Stopped process: $target"
          )
        }
      }
    }
    catch {

      Write-WarningMessage (
        "Unable to stop process '$processName': " +
        "$($_.Exception.Message)"
      )
    }
  }

  Start-Sleep -Seconds 2
}

# =========================================================
# NODE_MODULES CLEANUP
# =========================================================

function Get-WorkspaceNodeModules {

  Get-ChildItem `
    -Path $script:WorkspaceRoot `
    -Directory `
    -Recurse `
    -Force `
    -ErrorAction SilentlyContinue |
  Where-Object {

    $_.Name -eq 'node_modules' -and
    -not (Test-ExcludedPath $_.FullName)
  }
}

function Remove-WorkspaceNodeModules {

  [CmdletBinding(SupportsShouldProcess = $true)]
  param()

  Write-Section `
    'Removing node_modules directories'

  $directories =
  Get-WorkspaceNodeModules

  if (-not $directories) {

    Write-Info (
      'No node_modules directories found'
    )

    return
  }

  foreach ($directory in $directories) {

    Remove-WorkspaceItem `
      -Path $directory.FullName `
      -ItemType Directory
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

  Write-Section `
    'Removing workspace directories'

  foreach ($directoryName in $DirectoryNames) {

    Write-Info `
      "Searching: $directoryName"

    $directories =
    Get-WorkspaceDirectories `
      -DirectoryName $directoryName

    if (-not $directories) {

      Write-Info (
        "No directories found: $directoryName"
      )

      continue
    }

    foreach ($directory in $directories) {

      Remove-WorkspaceItem `
        -Path $directory.FullName `
        -ItemType Directory
    }
  }
}

# =========================================================
# TYPESCRIPT CLEANUP
# =========================================================

function Remove-TypeScriptBuildInfo {

  [CmdletBinding(SupportsShouldProcess = $true)]
  param()

  Write-Section `
    'Removing TypeScript build info'

  $files = Get-ChildItem `
    -Path $script:WorkspaceRoot `
    -Filter '*.tsbuildinfo' `
    -Recurse `
    -Force `
    -ErrorAction SilentlyContinue

  if (-not $files) {

    Write-Info (
      'No TypeScript build info files found'
    )

    return
  }

  foreach ($file in $files) {

    Remove-WorkspaceItem `
      -Path $file.FullName `
      -ItemType File
  }
}

# =========================================================
# PNPM STORE CLEANUP
# =========================================================

function Clear-PnpmStore {

  [CmdletBinding()]
  param()

  if ($SkipPnpmStore) {

    Write-WarningMessage (
      'Skipping pnpm store cleanup'
    )

    return
  }

  Write-Section `
    'Cleaning pnpm store'

  if (-not (
      Get-Command `
        pnpm `
        -ErrorAction SilentlyContinue
    )) {

    Write-WarningMessage (
      'pnpm command not found'
    )

    return
  }

  if ($DryRun) {

    Write-Host `
      '[DRYRUN] pnpm store prune' `
      -ForegroundColor Magenta

    return
  }

  try {

    pnpm store prune

    if ($LASTEXITCODE -eq 0) {

      Write-Success (
        'pnpm store cleaned successfully'
      )
    }
    else {

      Write-WarningMessage (
        "pnpm store prune exited with code: " +
        "$LASTEXITCODE"
      )
    }
  }
  catch {

    Write-WarningMessage (
      "Failed to clean pnpm store: " +
      "$($_.Exception.Message)"
    )
  }
}

# =========================================================
# MAIN
# =========================================================

Write-Section `
  'Starting workspace cleanup'

Assert-WorkspaceRoot

if ($VerboseOutput) {

  $VerbosePreference = 'Continue'

  Write-Verbose (
    "WorkspaceRoot : $script:WorkspaceRoot"
  )

  Write-Verbose (
    "DryRun        : $DryRun"
  )

  Write-Verbose (
    "SkipPnpmStore : $SkipPnpmStore"
  )
}

Stop-WorkspaceProcesses `
  -ProcessNames $script:ProcessesToStop

Remove-WorkspaceNodeModules

Remove-WorkspaceDirectories `
  -DirectoryNames $script:DirectoriesToRemove

Remove-TypeScriptBuildInfo

Clear-PnpmStore

Write-Section `
  'Cleanup completed'

Write-Success `
  'Workspace cleaned successfully'