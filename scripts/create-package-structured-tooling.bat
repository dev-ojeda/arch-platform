@echo off
setlocal

echo ======================================
echo Creando estructura tooling
echo ======================================

:: Base
set BASE=packages\tooling

:: =========================
:: Directorios
:: =========================

mkdir "%BASE%\src\commands" 2>nul
mkdir "%BASE%\src\runtime" 2>nul
mkdir "%BASE%\src\metadata" 2>nul
mkdir "%BASE%\src\package-types" 2>nul

:: =========================
:: commands
:: =========================

type nul > "%BASE%\src\commands\build.ts"
type nul > "%BASE%\src\commands\clean.ts"
type nul > "%BASE%\src\commands\dev.ts"
type nul > "%BASE%\src\commands\typecheck.ts"

:: =========================
:: runtime
:: =========================

type nul > "%BASE%\src\runtime\execute-command.ts"
type nul > "%BASE%\src\runtime\resolve-package-root.ts"
type nul > "%BASE%\src\runtime\resolve-package-metadata.ts"

:: =========================
:: metadata
:: =========================

type nul > "%BASE%\src\metadata\detect-package-type.ts"
type nul > "%BASE%\src\metadata\package-metadata.ts"

:: =========================
:: package-types
:: =========================

type nul > "%BASE%\src\package-types\package-types.ts"

echo.
echo ✅ Estructura tooling creada correctamente
pause