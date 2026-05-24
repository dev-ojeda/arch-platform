@echo off
setlocal enabledelayedexpansion

REM =========================================================
REM Architecture ADR Structure Generator
REM =========================================================

echo.
echo =========================================================
echo  Creating Architecture Documentation Structure
echo =========================================================
echo.

REM =========================================================
REM ROOT PATHS
REM =========================================================

set "ROOT_DIR=docs\architecture"
set "DECISIONS_DIR=%ROOT_DIR%\decisions"

REM =========================================================
REM CREATE DIRECTORIES
REM =========================================================

echo [INFO] Creating directories...

mkdir "%ROOT_DIR%" 2>nul
mkdir "%DECISIONS_DIR%" 2>nul
mkdir "%DECISIONS_DIR%\accepted" 2>nul
mkdir "%DECISIONS_DIR%\deprecated" 2>nul
mkdir "%DECISIONS_DIR%\proposed" 2>nul

echo [ OK ] Directories created

REM =========================================================
REM CREATE FILES
REM =========================================================

echo.
echo [INFO] Creating markdown files...

type nul > "%ROOT_DIR%\README.md"
type nul > "%ROOT_DIR%\adr-template.md"

type nul > "%ROOT_DIR%\0001-monorepo-architecture.md"
type nul > "%ROOT_DIR%\0002-build-pipeline.md"
type nul > "%ROOT_DIR%\0003-package-boundaries.md"
type nul > "%ROOT_DIR%\0004-runtime-tooling.md"
type nul > "%ROOT_DIR%\0005-dependency-governance.md"
type nul > "%ROOT_DIR%\0006-release-versioning.md"
type nul > "%ROOT_DIR%\0007-testing-strategy.md"
type nul > "%ROOT_DIR%\0008-observability-standards.md"

echo [ OK ] Markdown files created

REM =========================================================
REM FINISHED
REM =========================================================

echo.
echo =========================================================
echo  Architecture structure created successfully
echo =========================================================
echo.

exit /b 0