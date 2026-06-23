# tools\powershell\Private\Get-WorkspaceProcesses.ps1
function Get-WorkspaceProcesses {

  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [string]$WorkspaceRoot
  )

  $excludedNames = @(
    'pwsh'
    'powershell'
    'conhost'
  )

  Get-CimInstance Win32_Process |
  Where-Object {

    $_.ProcessId -ne $PID -and
    $_.CommandLine -and
    $_.CommandLine.Contains($WorkspaceRoot) -and
    $_.Name -notin $excludedNames -and
    $_.Name -in $script:CleanupConfig.ProcessNames
  }
}

function Stop-WorkspaceProcesses {

  [CmdletBinding(
    SupportsShouldProcess = $true
  )]

  param(
    [Parameter(Mandatory)]
    [string]$WorkspaceRoot
  )

  Write-Section `
    'Stopping workspace processes'

  $processes =
  Get-WorkspaceProcesses `
    -WorkspaceRoot $WorkspaceRoot

  foreach ($process in $processes) {

    if (
      $PSCmdlet.ShouldProcess(
        "$($process.Name) [$($process.ProcessId)]",
        'Stop Process'
      )
    ) {

      try {

        Stop-Process `
          -Id $process.ProcessId `
          -Force

        Write-Log `
          "$($process.Name) stopped" `
          Success
      }
      catch {

        Write-Log `
          $_.Exception.Message `
          Warning
      }
    }
  }
}