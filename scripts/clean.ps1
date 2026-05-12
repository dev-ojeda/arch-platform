$targets = @(
    "node_modules",
    "dist",
    ".turbo"
)

$files = @(
    "*.tsbuildinfo"
)

Write-Host "======================================="
Write-Host " Limpiando workspace"
Write-Host "======================================="

foreach ($target in $targets) {
    Get-ChildItem -Path . -Directory -Recurse -Force `
        -Filter $target -ErrorAction SilentlyContinue |
    ForEach-Object {
        Write-Host "[DEL] $($_.FullName)"
        Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
}

foreach ($file in $files) {
    Get-ChildItem -Path . -File -Recurse -Force `
        -Filter $file -ErrorAction SilentlyContinue |
    ForEach-Object {
        Write-Host "[DEL] $($_.FullName)"
        Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "Limpieza finalizada"