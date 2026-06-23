# tools\powershell\Private\Remove-PathSafe.ps1

function New-CleanupStats {

  [CmdletBinding()]
  param()

  [pscustomobject]@{
    FilesRemoved       = 0
    DirectoriesRemoved = 0
    Errors             = 0
  }
}

function Remove-WorkspaceItem {

  [CmdletBinding(
    SupportsShouldProcess = $true
  )]
  param(
    [Parameter(Mandatory)]
    [string]$Path,

    [Parameter(Mandatory)]
    [ValidateSet(
      'File',
      'Directory'
    )]
    [string]$ItemType
  )

  if (-not (Test-Path -LiteralPath $Path)) {

    return 'NotFound'
  }

  if (-not $PSCmdlet.ShouldProcess($Path, "Remove $ItemType")) {

    return 'Skipped'
  }

  try {

    Remove-Item `
      -LiteralPath $Path `
      -Force `
      -Recurse:($ItemType -eq 'Directory') `
      -ErrorAction Stop
  }
  catch {

    if ($ItemType -eq 'Directory') {

      cmd /c rd /s /q "`"$Path`"" | Out-Null
    }
  }

  if (
    Test-Path `
      -LiteralPath $Path
  ) {

    return 'Failed'
  }

  return 'Removed'
}

function Remove-WorkspaceItems {

  [CmdletBinding()]
  param(
    [AllowEmptyCollection()]
    [System.IO.FileSystemInfo[]]$Items = @(),

    [Parameter(Mandatory)]
    [ValidateSet(
      'File',
      'Directory'
    )]
    [string]$ItemType,

    [Parameter(Mandatory)]
    [psobject]$Stats
  )

  foreach ($item in $Items) {

    try {

      $result =
      Remove-WorkspaceItem `
        -Path $item.FullName `
        -ItemType $ItemType `
        -WhatIf:$WhatIfPreference

      switch ($result) {

        'Removed' {

          switch ($ItemType) {

            'File' {
              $Stats.FilesRemoved++
            }

            'Directory' {
              $Stats.DirectoriesRemoved++
            }
          }

          Write-Log `
            "Removed $($item.FullName)" `
            Success
        }

        'Failed' {

          $Stats.Errors++

          Write-Log `
            "Failed to remove $($item.FullName)" `
            Warning
        }

        'Skipped' {

          Write-Log `
            "Skipped $($item.FullName)" `
            Info
        }
      }
    }
    catch {

      $Stats.Errors++

      Write-Log `
        $_.Exception.Message `
        Warning
    }
  }
}

function Get-NodeModulesDirectories {

  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [System.IO.FileSystemInfo[]]$Inventory
  )

  $Inventory |
  Where-Object {

    $_.PSIsContainer -and
    $_.Name -eq 'node_modules' -and
    -not (
      Test-ExcludedPath $_.FullName
    )
  }
}

function Remove-NodeModules {

  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [System.IO.FileSystemInfo[]]$Inventory,

    [Parameter(Mandatory)]
    [psobject]$Stats
  )

  Write-Section 'Removing node_modules'

  Remove-WorkspaceItems `
    -Items (
    Get-NodeModulesDirectories `
      -Inventory $Inventory
  ) `
    -ItemType Directory `
    -Stats $Stats
}

function Get-BuildArtifactDirectories {

  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [System.IO.FileSystemInfo[]]$Inventory
  )

  $Inventory |
  Where-Object {

    $_.PSIsContainer -and
    $_.Name -in $script:CleanupConfig.ArtifactDirectories -and
    -not (
      Test-ExcludedPath $_.FullName
    )
  }
}

function Remove-BuildArtifacts {

  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [System.IO.FileSystemInfo[]]$Inventory,

    [Parameter(Mandatory)]
    [psobject]$Stats
  )

  Write-Section 'Removing build artifacts'

  Remove-WorkspaceItems `
    -Items (
    Get-BuildArtifactDirectories `
      -Inventory $Inventory
  ) `
    -ItemType Directory `
    -Stats $Stats
}

function Get-TsBuildInfoFiles {

  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [System.IO.FileSystemInfo[]]$Inventory
  )

  $Inventory |
  Where-Object {

    -not $_.PSIsContainer -and
    $_.Name -like '*.tsbuildinfo'
  }
}

function Remove-TsBuildInfo {

  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [System.IO.FileSystemInfo[]]$Inventory,

    [Parameter(Mandatory)]
    [psobject]$Stats
  )

  Write-Section 'Removing tsbuildinfo'

  Remove-WorkspaceItems `
    -Items (
    Get-TsBuildInfoFiles `
      -Inventory $Inventory
  ) `
    -ItemType File `
    -Stats $Stats
}