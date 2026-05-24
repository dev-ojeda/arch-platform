@echo off
setlocal enabledelayedexpansion

REM =========================================================
REM CLI Package Structure Generator
REM =========================================================

echo.
echo =========================================================
echo  Creating CLI Package Structure
echo =========================================================
echo.

REM =========================================================
REM ROOT PATHS
REM =========================================================

set "ROOT_DIR=packages\cli"
set "SRC_DIR=%ROOT_DIR%\src"

REM =========================================================
REM CREATE DIRECTORIES
REM =========================================================

echo [INFO] Creating directories...

mkdir "%ROOT_DIR%" 2>nul
mkdir "%SRC_DIR%" 2>nul

mkdir "%SRC_DIR%\commands" 2>nul
mkdir "%SRC_DIR%\services" 2>nul
mkdir "%SRC_DIR%\utils" 2>nul

echo [ OK ] Directories created

REM =========================================================
REM CREATE SOURCE FILES
REM =========================================================

echo.
echo [INFO] Creating TypeScript source files...

type nul > "%SRC_DIR%\index.ts"

type nul > "%SRC_DIR%\commands\build.command.ts"
type nul > "%SRC_DIR%\commands\clean.command.ts"
type nul > "%SRC_DIR%\commands\validate.command.ts"
type nul > "%SRC_DIR%\commands\doctor.command.ts"

type nul > "%SRC_DIR%\services\command-runner.ts"

type nul > "%SRC_DIR%\utils\logger.ts"

echo [ OK ] Source files created

REM =========================================================
REM CREATE CONFIG FILES
REM =========================================================

echo.
echo [INFO] Creating configuration files...

type nul > "%ROOT_DIR%\package.json"
type nul > "%ROOT_DIR%\tsconfig.json"

echo [ OK ] Configuration files created

REM =========================================================
REM FINISHED
REM =========================================================

echo.
echo =========================================================
echo  CLI package structure created successfully
echo =========================================================
echo.

exit /b 0