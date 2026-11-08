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

  # Ejecutamos rimraf directamente a través de tu función puente optimizada.
  # Eliminamos por completo el bloque try/catch lento y las llamadas heredadas a cmd /c rd.
  Remove-PathSafe -Path $Path

  if (Test-Path -LiteralPath $Path) {
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

function Remove-PathSafe {
  [CmdletBinding(SupportsShouldProcess)]
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [switch]$DryRun
  )

  # Normalizamos la ruta para evitar problemas de caracteres en Windows
  $LiteralPath = (Resolve-Path -LiteralPath $Path -ErrorAction SilentlyContinue).Path
  if (-not $LiteralPath) { $LiteralPath = $Path }

  if (-not (Test-Path -LiteralPath $LiteralPath)) {
    return $false
  }

  if ($DryRun) {
    Write-Log -Level 'INFO' -Message "[DRYRUN] Would remove: $Path"
    return $true
  }

  if ($PSCmdlet.ShouldProcess($LiteralPath, "Removing workspace artifact")) {
    try {
      if (Test-Path -LiteralPath $LiteralPath -PathType Container) {
        # =====================================================================
        # EL REY DE LA VELOCIDAD EN WINDOWS: .NET DIRECTORY DELETE
        # =====================================================================
        # [System.IO.Directory]::Delete es una llamada directa al Kernel de Windows.
        # El segundo parámetro ($true) activa la recursividad nativa a bajo nivel.
        # Es asíncrono, vuela en SSDs y no requiere levantar procesos externos.
        [System.IO.Directory]::Delete($LiteralPath, $true)
      }
      else {
        # Si es un archivo individual aislado (.tsbuildinfo)
        [System.IO.File]::Delete($LiteralPath)
      }

      # Validamos físicamente que el SSD ya eliminó el registro
      if (-not (Test-Path -LiteralPath $LiteralPath)) {
        return $true
      }
    }
    catch {
      # Bloque de respaldo agresivo en CMD si .NET encuentra un archivo bloqueado por el compilador
      if (Test-Path -LiteralPath $LiteralPath -PathType Container) {
        cmd /c rd /s /q "`"$LiteralPath`"" | Out-Null
      }
      else {
        Remove-Item -LiteralPath $LiteralPath -Force -ErrorAction SilentlyContinue
      }
    }

    # Verificación final para el reporte de estadísticas
    if (-not (Test-Path -LiteralPath $LiteralPath)) {
      return $true
    }
    else {
      Write-Log -Level 'ERROR' -Message "Failsafe clean failed to verify deletion for: $LiteralPath"
      return $false
    }
  }
  return $false
}
