# tools\powershell\Private\Get-CleanupConfiguration.ps1
function Get-CleanupConfiguration {

  [CmdletBinding()]
  param()

  [pscustomobject]@{

    ExcludedDirectories = @(
      '.git'
      '.vscode'
      '.idea'
      'packages\tooling\src\build'
      'packages\tooling\src\commands\build'
    )

    ArtifactDirectories = @(
      '.arch'
      '.arch-cache'
      '.turbo'
      '.cache'
      '.vite'
      '.next'
      '.nx'
      '.parcel-cache'
      'coverage'
      'dist'
      'build'
      'out'
      'storybook-static'
    )

    ProcessNames        = @(
      'node'
      'pnpm'
      'turbo'
      'tsx'
      'vite'
      'jest'
      'vitest'
      'eslint_d'
      'tsserver'
    )
  }
}