@echo off
setlocal

echo ======================================
echo Creando estructura capability-engine
echo ======================================

:: Base
set BASE=packages\capability-engine

:: =========================
:: Directorios
:: =========================

mkdir "%BASE%\src\resolvers" 2>nul
mkdir "%BASE%\src\validation" 2>nul
mkdir "%BASE%\src\composition" 2>nul

:: =========================
:: resolvers
:: =========================

type nul > "%BASE%\src\resolvers\capability-resolver.ts"

:: =========================
:: validation
:: =========================

type nul > "%BASE%\src\validation\dependency-validator.ts"
type nul > "%BASE%\src\validation\incompatibility-validator.ts"

:: =========================
:: composition
:: =========================

type nul > "%BASE%\src\composition\capability-composer.ts"

:: =========================
:: index
:: =========================

type nul > "%BASE%\src\index.ts"

echo.
echo ✅ Estructura capability-engine creada correctamente
pause