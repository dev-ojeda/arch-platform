# tools/powershell/cleanup.ps1

[CmdletBinding()]
param()

Import-Module `
  "$PSScriptRoot\CleanupTools.psd1" `
  -Force

Invoke-WorkspaceCleanup