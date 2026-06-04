# scripts/cleanup/cleanup-dist.ps1

[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [switch]$DryRun,

  [switch]$VerboseOutput,

  [string]$RootPath = '.'
)

Set-StrictMode -Version Latest

$ErrorActionPreference = 'Stop'

# =========================================================
# CONFIGURATION
# =========================================================

$script:ExcludedDirectories = @(
  '.git',
  '.turbo',
  '.pnpm-store',
  '.idea',
  '.vscode',
  'node_modules'
)

# =========================================================
# LOGGER
# =========================================================

function Write-Log {

  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
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
    'INFO'    { 'Cyan' }
    'WARN'    { 'Yellow' }
    'ERROR'   { 'Red' }
    'SUCCESS' { 'Green' }
    'DEBUG'   { 'DarkGray' }
  }

  Write-Host "[$Level] $Message" `
    -ForegroundColor $Color
}

# =========================================================
# HELPERS
# =========================================================

function Resolve-WorkspaceRoot {

  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  try {

    return (
      Resolve-Path `
        -Path $Path `
        -ErrorAction Stop
    ).Path
  }
  catch {

    throw "Root path not found: $Path"
  }
}

function Test-ExcludedPath {

  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  foreach ($ExcludedDirectory in $script:ExcludedDirectories) {

    if ($Path -like "*$ExcludedDirectory*") {
      return $true
    }
  }

  return $false
}

function Get-DistDirectories {

  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [string]$RootDirectory
  )

  return @(
    Get-ChildItem `
      -Path $RootDirectory `
      -Directory `
      -Recurse `
      -Force `
      -ErrorAction SilentlyContinue |
    Where-Object {

      $_.Name -eq 'dist' -and
      -not (
        Test-ExcludedPath `
          -Path $_.FullName
      )
    }
  )
}

function Remove-DistDirectory {

  [CmdletBinding(SupportsShouldProcess = $true)]
  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

  if (-not (Test-Path $Path)) {

    Write-Log `
      -Level WARN `
      -Message "Directory not found: $Path"

    return
  }

  if ($DryRun) {

    Write-Host "[DRYRUN] Remove: $Path" `
      -ForegroundColor Magenta

    return
  }

  if ($PSCmdlet.ShouldProcess($Path, 'Remove dist directory')) {

    Remove-Item `
      -LiteralPath $Path `
      -Recurse `
      -Force `
      -ErrorAction Stop

    Write-Log `
      -Level SUCCESS `
      -Message "Removed: $Path"
  }
}

# =========================================================
# INITIALIZATION
# =========================================================

try {

  $ResolvedRoot = Resolve-WorkspaceRoot `
    -Path $RootPath
}
catch {

  Write-Log `
    -Level ERROR `
    -Message $_.Exception.Message

  exit 1
}

Write-Log `
  -Level INFO `
  -Message 'Starting dist cleanup'

Write-Log `
  -Level DEBUG `
  -Message "Workspace root: $ResolvedRoot"

# =========================================================
# DISCOVERY
# =========================================================

$DistDirectories = @(
  Get-DistDirectories `
    -RootDirectory $ResolvedRoot
)

$DistDirectoryCount = $DistDirectories.Length

if ($DistDirectoryCount -eq 0) {

  Write-Log `
    -Level WARN `
    -Message 'No dist directories found'

  exit 0
}

Write-Log `
  -Level INFO `
  -Message (
    "Found $DistDirectoryCount dist directories"
  )
# =========================================================
# CLEANUP
# =========================================================

$RemovedCount = 0
$FailedCount = 0

foreach ($Directory in $DistDirectories) {

  $TargetPath = $Directory.FullName

  Write-Log `
    -Level DEBUG `
    -Message "Processing: $TargetPath"

  try {

    Remove-DistDirectory `
      -Path $TargetPath

    $RemovedCount++
  }
  catch {

    Write-Log `
      -Level ERROR `
      -Message "Failed removing: $TargetPath"

    Write-Log `
      -Level ERROR `
      -Message $_.Exception.Message

    $FailedCount++
  }
}

# =========================================================
# SUMMARY
# =========================================================

Write-Host ''

Write-Host `
  '--------------------------------------------------' `
  -ForegroundColor DarkGray

Write-Log `
  -Level INFO `
  -Message 'Cleanup Summary'

Write-Host `
  '--------------------------------------------------' `
  -ForegroundColor DarkGray

Write-Host "Removed : $RemovedCount"
Write-Host "Failed  : $FailedCount"

if ($DryRun) {

  Write-Host `
    'Mode    : DRY RUN' `
    -ForegroundColor Magenta
}

Write-Host ''

if ($FailedCount -gt 0) {

  throw 'Dist cleanup completed with errors'
}

Write-Log `
  -Level SUCCESS `
  -Message 'Dist cleanup completed successfully'