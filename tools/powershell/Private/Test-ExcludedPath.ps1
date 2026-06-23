function Test-ExcludedPath {

  param(
    [string]$Path
  )

  foreach (
    $excluded
    in
    $script:CleanupConfig.ExcludedDirectories
  ) {

    $pattern =
    "(\\|/)$([regex]::Escape($excluded))(\\|/|$)"

    if ($Path -match $pattern) {

      return $true
    }
  }

  return $false
}
