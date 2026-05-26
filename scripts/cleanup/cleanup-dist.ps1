[CmdletBinding(SupportsShouldProcess)]
param(
  [switch]$DryRun,

  [switch]$VerboseOutput,

  [string]$RootPath = '.'
)

Set-StrictMode -Version Latest

$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------
# CONSTANTS
# ---------------------------------------------------------------------

$ExcludedDirectories = @(
  '.git',
  '.turbo',
  '.pnpm-store',
  '.idea',
  '.vscode',
  'node_modules'
)

# ---------------------------------------------------------------------
# LOGGER
# ---------------------------------------------------------------------

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

# ---------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------

function Test-ExcludedPath {
  param(
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

function Remove-DistDirectory {
  [CmdletBinding(SupportsShouldProcess)]
  param(
    [Parameter(Mandatory)]
    [string]$Path
  )

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

# ---------------------------------------------------------------------
# VALIDATION
# ---------------------------------------------------------------------

try {
  $ResolvedRoot =
  (Resolve-Path -Path $RootPath).Path
}
catch {
  Write-Log `
    -Level ERROR `
    -Message "Root path not found: $RootPath"

  return
}

Write-Log `
  -Level INFO `
  -Message 'Starting dist cleanup'

Write-Log `
  -Level DEBUG `
  -Message "Resolved root: $ResolvedRoot"

# ---------------------------------------------------------------------
# DISCOVERY
# ---------------------------------------------------------------------

$DistDirectories =
Get-ChildItem `
  -Path $ResolvedRoot `
  -Directory `
  -Recurse `
  -Force `
  -Filter 'dist' `
  -ErrorAction SilentlyContinue |
Where-Object {
  -not (
    Test-ExcludedPath `
      -Path $_.FullName
  )
}

if (-not $DistDirectories) {
  Write-Log `
    -Level WARN `
    -Message 'No dist directories found'

  return
}

Write-Log `
  -Level INFO `
  -Message (
  "Found $($DistDirectories.Count) " +
  "dist directories"
)

# ---------------------------------------------------------------------
# CLEANUP
# ---------------------------------------------------------------------

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
      -Message "Failed: $TargetPath"

    Write-Log `
      -Level ERROR `
      -Message $_.Exception.Message

    $FailedCount++
  }
}

# ---------------------------------------------------------------------
# SUMMARY
# ---------------------------------------------------------------------

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