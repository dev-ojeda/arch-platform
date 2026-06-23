# tools\powershell\Private\Get-WorkspaceRoot.ps1
function Get-WorkspaceRoot {

  [CmdletBinding()]
  param(
    [Parameter(Mandatory)]
    [string]$StartPath
  )

  $current =
  Get-Item `
    -LiteralPath $StartPath `
    -ErrorAction Stop

  while ($null -ne $current) {

    if (
      Test-Path (
        Join-Path `
          $current.FullName `
          'pnpm-workspace.yaml'
      )
    ) {

      return $current.FullName
    }

    $current = $current.Parent
  }

  throw 'Unable to locate pnpm workspace.'
}