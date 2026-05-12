# ==========================================
# ARCH PLATFORM - DEEP CLEAN
# ==========================================

$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "=========================================="
Write-Host "      ARCH PLATFORM - DEEP CLEAN"
Write-Host "=========================================="
Write-Host ""

# ==========================================
# CONFIGURACION
# ==========================================

$directories = @(
    "node_modules",
    "dist",
    ".turbo",
    ".next",
    "coverage",
    "out",
    "build",
    ".cache",
    ".parcel-cache",
    ".vite",
    ".nx",
    ".svelte-kit"
)

$files = @(
    "*.tsbuildinfo",
    "*.log"
)

# ==========================================
# CONTADORES
# ==========================================

[int]$removedDirs = 0
[int]$removedFiles = 0

# ==========================================
# LIMPIAR DIRECTORIOS
# ==========================================

Write-Host "[INFO] Eliminando directorios..." -ForegroundColor Cyan
Write-Host ""

foreach ($dir in $directories) {

    Get-ChildItem `
        -Path . `
        -Directory `
        -Recurse `
        -Force `
        -Filter $dir |

    ForEach-Object {

        Write-Host "[DEL] $($_.FullName)" -ForegroundColor Yellow

        Remove-Item `
            $_.FullName `
            -Recurse `
            -Force `
            -ErrorAction SilentlyContinue

        if (!(Test-Path $_.FullName)) {
            $removedDirs++
        }
    }
}

Write-Host ""

# ==========================================
# LIMPIAR ARCHIVOS
# ==========================================

Write-Host "[INFO] Eliminando archivos..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $files) {

    Get-ChildItem `
        -Path . `
        -File `
        -Recurse `
        -Force `
        -Filter $file |

    ForEach-Object {

        Write-Host "[DEL] $($_.FullName)" -ForegroundColor DarkYellow

        Remove-Item `
            $_.FullName `
            -Force `
            -ErrorAction SilentlyContinue

        if (!(Test-Path $_.FullName)) {
            $removedFiles++
        }
    }
}

# ==========================================
# LIMPIAR CACHE PNPM
# ==========================================

Write-Host ""
Write-Host "[INFO] Limpiando cache pnpm..." -ForegroundColor Cyan

pnpm store prune

# ==========================================
# LIMPIAR CACHE TURBO
# ==========================================

Write-Host ""
Write-Host "[INFO] Limpiando cache turbo..." -ForegroundColor Cyan

if (Get-Command turbo -ErrorAction SilentlyContinue) {
    turbo daemon clean
}

# ==========================================
# GIT CLEAN OPCIONAL
# ==========================================

Write-Host ""
$gitClean = Read-Host "¿Ejecutar git clean -xfd? (y/n)"

if ($gitClean -eq "y") {

    Write-Host ""
    Write-Host "[WARNING] Ejecutando git clean -xfd" -ForegroundColor Red

    git clean -xfd
}

# ==========================================
# RESUMEN
# ==========================================

Write-Host ""
Write-Host "=========================================="
Write-Host "           LIMPIEZA COMPLETADA"
Write-Host "=========================================="
Write-Host ""
Write-Host "Directorios eliminados : $removedDirs"
Write-Host "Archivos eliminados    : $removedFiles"
Write-Host ""

pause