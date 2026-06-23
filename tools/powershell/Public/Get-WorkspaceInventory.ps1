function Get-WorkspaceInventory {

  param(
    [string]$WorkspaceRoot
  )

  Get-ChildItem `
    -Path $WorkspaceRoot `
    -Force `
    -Recurse `
    -ErrorAction SilentlyContinue
}