# tools\powershell\Public\Invoke-WorkspaceCleanup.ps1

function Invoke-WorkspaceCleanup {

  [CmdletBinding()]
  param()

  $stats =
  New-CleanupStats

  $workspaceRoot =
  Get-WorkspaceRoot `
    -StartPath $PWD.Path

  Stop-WorkspaceProcesses `
    -WorkspaceRoot $workspaceRoot

  Start-Sleep -Seconds 2

  $inventory =
  Get-WorkspaceInventory `
    -WorkspaceRoot $workspaceRoot

  Remove-NodeModules `
    -Inventory $inventory `
    -Stats $stats

  Remove-BuildArtifacts `
    -Inventory $inventory `
    -Stats $stats

  Remove-TsBuildInfo `
    -Inventory $inventory `
    -Stats $stats

  Write-Section 'Summary'

  Write-Log "Files removed: $($stats.FilesRemoved)"
  Write-Log "Directories removed: $($stats.DirectoriesRemoved)"

  Write-Log `
    "Errors: $($stats.Errors)" `
  $(if ($stats.Errors -gt 0) { 'Warning' } else { 'Success' })

  $stats
}