@echo off
setlocal

echo ======================================
echo Creando estructura application/src
echo ======================================

:: Base
set BASE=application\src

:: Crear directorios
mkdir "%BASE%\ports\notification" 2>nul
mkdir "%BASE%\ports\workspace" 2>nul
mkdir "%BASE%\ports\filesystem" 2>nul
mkdir "%BASE%\ports\configuration" 2>nul
mkdir "%BASE%\ports\logging" 2>nul
mkdir "%BASE%\ports\registry" 2>nul
mkdir "%BASE%\use-cases" 2>nul

:: Crear archivos
type nul > "%BASE%\ports\notification\notification.port.ts"
type nul > "%BASE%\ports\notification\index.ts"

type nul > "%BASE%\ports\workspace\workspace.port.ts"
type nul > "%BASE%\ports\workspace\index.ts"

type nul > "%BASE%\ports\filesystem\filesystem.port.ts"
type nul > "%BASE%\ports\filesystem\index.ts"

type nul > "%BASE%\ports\configuration\configuration.port.ts"
type nul > "%BASE%\ports\configuration\index.ts"

type nul > "%BASE%\ports\logging\logger.port.ts"
type nul > "%BASE%\ports\logging\index.ts"

type nul > "%BASE%\ports\registry\template-registry.port.ts"
type nul > "%BASE%\ports\registry\index.ts"

type nul > "%BASE%\ports\index.ts"

echo.
echo ✅ Estructura creada correctamente
pause