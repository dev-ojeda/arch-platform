@echo off
setlocal enabledelayedexpansion

REM =========================================================
REM Governance Package Structure Generator
REM =========================================================

echo.
echo =========================================================
echo  Creating Governance Package Structure
echo =========================================================
echo.

REM =========================================================
REM ROOT PATHS
REM =========================================================

set "ROOT_DIR=packages\governance"
set "SRC_DIR=%ROOT_DIR%\src"

REM =========================================================
REM CREATE DIRECTORIES
REM =========================================================

echo [INFO] Creating directories...

mkdir "%ROOT_DIR%" 2>nul
mkdir "%SRC_DIR%" 2>nul

mkdir "%SRC_DIR%\rules" 2>nul
mkdir "%SRC_DIR%\diagnostics" 2>nul
mkdir "%SRC_DIR%\boundaries" 2>nul
mkdir "%SRC_DIR%\policies" 2>nul

echo [ OK ] Directories created

REM =========================================================
REM CREATE RULE FILES
REM =========================================================

echo.
echo [INFO] Creating rules files...

type nul > "%SRC_DIR%\rules\dependency-rules.ts"
type nul > "%SRC_DIR%\rules\layer-rules.ts"
type nul > "%SRC_DIR%\rules\package-rules.ts"

echo [ OK ] Rules files created

REM =========================================================
REM CREATE DIAGNOSTICS FILES
REM =========================================================

echo.
echo [INFO] Creating diagnostics files...

type nul > "%SRC_DIR%\diagnostics\diagnostic.ts"
type nul > "%SRC_DIR%\diagnostics\diagnostic-engine.ts"

echo [ OK ] Diagnostics files created

REM =========================================================
REM CREATE BOUNDARIES FILES
REM =========================================================

echo.
echo [INFO] Creating boundaries files...

type nul > "%SRC_DIR%\boundaries\boundary-engine.ts"

echo [ OK ] Boundaries files created

REM =========================================================
REM CREATE POLICY FILES
REM =========================================================

echo.
echo [INFO] Creating policy files...

type nul > "%SRC_DIR%\policies\workspace-policy.ts"

echo [ OK ] Policy files created

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
echo  Governance package structure created successfully
echo =========================================================
echo.

exit /b 0