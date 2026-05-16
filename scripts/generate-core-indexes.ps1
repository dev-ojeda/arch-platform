function Get-ExportStatement {
  param(
      [string]$RelativePath
  )

  return "export * from './$RelativePath'"
}

function New-IndexFile {
  param(
      [string]$Directory
  )

  Write-Host ""
  Write-Host "Processing: $Directory"

  $exports = @()

  # =========================================================
  # EXPORT FILES
  # =========================================================

  $files = Get-ChildItem `
      -Path $Directory `
      -File `
      -Filter *.ts |
  Where-Object {
      $_.Name -ne "index.ts"
  } |
  Sort-Object Name

  foreach ($file in $files) {

      $name = [System.IO.Path]::GetFileNameWithoutExtension(
          $file.Name
      )

      $exports += Get-ExportStatement $name
  }

  # =========================================================
  # EXPORT DIRECTORIES
  # =========================================================

  $directories = Get-ChildItem `
      -Path $Directory `
      -Directory |
  Sort-Object Name

  foreach ($dir in $directories) {

      $exports += Get-ExportStatement $dir.Name
  }

  # =========================================================
  # CREATE INDEX
  # =========================================================

  $indexPath = Join-Path $Directory "index.ts"

  if ($exports.Count -eq 0) {

      Set-Content `
          -Path $indexPath `
          -Value "// Auto-generated index"

      Write-Host "[EMPTY ] $indexPath"

      return
  }

  $content = @(
      "// Auto-generated index"
      ""
      $exports
      ""
  )

  Set-Content `
      -Path $indexPath `
      -Value $content

  Write-Host "[INDEX ] $indexPath"
}

# =============================================================
# ROOT
# =============================================================

$root = "packages/core/src"

Write-Host ""
Write-Host "========================================="
Write-Host "GENERATING CORE INDEX FILES"
Write-Host "========================================="
Write-Host ""

# =============================================================
# GENERATE FOR ALL DIRECTORIES
# =============================================================

$directories = Get-ChildItem `
  -Path $root `
  -Directory `
  -Recurse |
Sort-Object FullName

foreach ($directory in $directories) {

  New-IndexFile `
      -Directory $directory.FullName
}

# =============================================================
# ROOT INDEX
# =============================================================

New-IndexFile `
  -Directory $root

Write-Host ""
Write-Host "========================================="
Write-Host "INDEX GENERATION COMPLETED"
Write-Host "========================================="
Write-Host ""