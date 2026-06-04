# scripts/cleanup/cleanup-node-modules.ps1

[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [switch]$DryRun,
  [string]$RootPath = '.'
)

$ErrorActionPreference = 'Stop'

Write-Host ''
Write-Host '=================================================' -ForegroundColor Cyan
Write-Host ' Removing node_modules directories' -ForegroundColor Cyan
Write-Host '=================================================' -ForegroundColor Cyan
Write-Host ''

$NodeModulesDirectories = @(
  Get-ChildItem `
    -Path $RootPath `
    -Directory `
    -Recurse `
    -Force `
    -ErrorAction SilentlyContinue |
  Where-Object {
    $_.Name -eq 'node_modules'
  }
)

if ($NodeModulesDirectories.Length -eq 0) {

  Write-Host '[INFO] No node_modules directories found' `
    -ForegroundColor Yellow

  exit 0
}

Write-Host "[INFO] Found $($NodeModulesDirectories.Length) node_modules directories" `
  -ForegroundColor Cyan

foreach ($Directory in $NodeModulesDirectories) {

  $TargetPath = $Directory.FullName

  try {

    if ($DryRun) {

      Write-Host "[DRYRUN] Remove: $TargetPath" `
        -ForegroundColor Magenta

      continue
    }

    Remove-Item `
      -LiteralPath $TargetPath `
      -Recurse `
      -Force `
      -ErrorAction Stop

    Write-Host "[ OK ] Removed: $TargetPath" `
      -ForegroundColor Green
  }
  catch {

    Write-Host "[FAIL] $TargetPath" `
      -ForegroundColor Red

    Write-Host $_.Exception.Message `
      -ForegroundColor DarkRed
  }
}

Write-Host ''
Write-Host '=================================================' -ForegroundColor Cyan
Write-Host ' Cleanup completed' -ForegroundColor Cyan
Write-Host '=================================================' -ForegroundColor Cyan