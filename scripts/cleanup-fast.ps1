# scripts/cleanup-fast.ps1

$ErrorActionPreference = "SilentlyContinue"

$directories = @(
    "dist",
    "build",
    "coverage",
    ".turbo",
    ".next",
    ".cache",
    ".vite",
    ".nx",
    ".parcel-cache",
    ".swc"
)

$files = @(
    "*.tsbuildinfo",
    ".eslintcache"
)

$removedDirectories = 0
$removedFiles = 0

Write-Host ""
Write-Host "======================================="
Write-Host " FAST CLEANUP WORKSPACE"
Write-Host "======================================="
Write-Host ""

# =======================================
# DIRECTORIOS
# =======================================

foreach ($directory in $directories) {

    Write-Host "[INFO] Searching: $directory"

    Get-ChildItem `
        -Path . `
        -Directory `
        -Recurse `
        -Force `
        -Filter $directory |

    ForEach-Object {

        Write-Host "[DEL] $($_.FullName)"

        Remove-Item `
            $_.FullName `
            -Recurse `
            -Force

        $removedDirectories++
    }

    Write-Host ""
}

# =======================================
# ARCHIVOS
# =======================================

foreach ($pattern in $files) {

    Write-Host "[INFO] Searching: $pattern"

    Get-ChildItem `
        -Path . `
        -File `
        -Recurse `
        -Force `
        -Filter $pattern |

    ForEach-Object {

        Write-Host "[DEL] $($_.FullName)"

        Remove-Item `
            $_.FullName `
            -Force

        $removedFiles++
    }

    Write-Host ""
}

# =======================================
# RESUMEN
# =======================================

Write-Host "======================================="
Write-Host " CLEANUP FINISHED"
Write-Host "======================================="
Write-Host ""

Write-Host "Directories removed: $removedDirectories"
Write-Host "Files removed:       $removedFiles"

Write-Host ""