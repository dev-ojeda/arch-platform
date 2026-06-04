# scripts/clean-packages.ps1

[CmdletBinding()]
param(
  [switch]$DryRun,
  [switch]$VerboseOutput
)

$ErrorActionPreference = 'Stop'

# =========================================================
# CONFIGURATION
# =========================================================

$WorkspaceRoot = Resolve-Path '.'

$PackagesPath = Join-Path `
  $WorkspaceRoot `
  'packages'

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

function Remove-Directory {

  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  if (-not (Test-Path $Path)) {

    if ($VerboseOutput) {
      Write-WarningMessage "Directory not found: $Path"
    }

    return
  }

  try {

    if ($DryRun) {

      Write-Host "[DRYRUN] Remove: $Path" `
        -ForegroundColor Magenta

      return
    }

    Remove-Item `
      -LiteralPath $Path `
      -Recurse `
      -Force `
      -ErrorAction Stop

    Write-Success "Removed: $Path"
  }
  catch {

    Write-ErrorMessage "Failed removing: $Path"

    if ($VerboseOutput) {
      Write-Host $_.Exception.Message `
        -ForegroundColor DarkRed
    }
  }
}

# =========================================================
# CLEAN ROOT .turbo
# =========================================================

Write-Section 'Cleaning workspace artifacts'

$TurboPath = Join-Path `
  $WorkspaceRoot `
  '.turbo'

if (Test-Path $TurboPath) {

  Write-Info 'Removing root .turbo'

  Remove-Directory -Path $TurboPath
}
else {

  Write-Info 'Root .turbo not found'
}

# =========================================================
# CLEAN PACKAGE NODE_MODULES
# =========================================================

if (-not (Test-Path $PackagesPath)) {

  Write-ErrorMessage 'packages directory not found'
  exit 1
}

$Packages = Get-ChildItem `
  -Path $PackagesPath `
  -Directory `
  -Force

foreach ($Package in $Packages) {

  $NodeModulesPath = Join-Path `
    $Package.FullName `
    'node_modules'

  if (-not (Test-Path $NodeModulesPath)) {

    if ($VerboseOutput) {
      Write-Info "No node_modules found: $($Package.Name)"
    }

    continue
  }

  Write-Info (
    "Cleaning package node_modules: " +
    $Package.Name
  )

  Remove-Directory `
    -Path $NodeModulesPath
}

# =========================================================
# FINISHED
# =========================================================

Write-Section 'Cleanup completed'

Write-Success 'Workspace artifacts cleaned successfully'