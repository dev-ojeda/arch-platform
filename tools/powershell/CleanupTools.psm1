# tools/powershell/CleanupTools.psm1

$privateScripts =
Get-ChildItem `
  "$PSScriptRoot\Private\*.ps1" |
Sort-Object Name

foreach ($script in $privateScripts) {

  . $script.FullName
}

$script:CleanupConfig =
Get-CleanupConfiguration

$publicScripts =
Get-ChildItem `
  "$PSScriptRoot\Public\*.ps1" |
Sort-Object Name

foreach ($script in $publicScripts) {

  . $script.FullName
}

Export-ModuleMember `
  -Function $publicScripts.BaseName