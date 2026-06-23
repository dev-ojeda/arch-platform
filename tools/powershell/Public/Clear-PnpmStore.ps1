function Clear-PnpmStore {

  Write-Section `
    'Cleaning pnpm store'

  if (
    -not (
      Get-Command `
        pnpm `
        -ErrorAction SilentlyContinue
    )
  ) {

    Write-Log `
      'pnpm not found' `
      Warning

    return
  }

  pnpm store prune

  if ($LASTEXITCODE -eq 0) {

    Write-Log `
      'pnpm store cleaned' `
      Success
  }
}