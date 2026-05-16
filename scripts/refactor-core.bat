@echo off
setlocal enabledelayedexpansion

echo.
echo ==========================================
echo         ARCH PLATFORM - CORE REFACTOR
echo ==========================================
echo.

REM =========================================================
REM VALIDATE ROOT
REM =========================================================

if not exist "packages\core\src" (
    echo [ERROR] packages\core\src not found
    pause
    exit /b 1
)

REM =========================================================
REM CREATE STRUCTURE
REM =========================================================

echo ------------------------------------------
echo [1/4] Creating new core structure
echo ------------------------------------------
echo.

powershell ^
    -NoProfile ^
    -ExecutionPolicy Bypass ^
    -File "scripts\create-core-structure.ps1"

if errorlevel 1 (
    echo.
    echo [ERROR] Failed creating structure
    pause
    exit /b 1
)

REM =========================================================
REM MIGRATE FILES
REM =========================================================

echo.
echo ------------------------------------------
echo [2/4] Migrating files
echo ------------------------------------------
echo.

powershell ^
    -NoProfile ^
    -ExecutionPolicy Bypass ^
    -File "scripts\migrate-core-structure.ps1"

if errorlevel 1 (
    echo.
    echo [ERROR] Failed migrating files
    pause
    exit /b 1
)

REM =========================================================
REM GENERATE INDEXES
REM =========================================================

echo.
echo ------------------------------------------
echo [3/4] Generating index.ts files
echo ------------------------------------------
echo.

powershell ^
    -NoProfile ^
    -ExecutionPolicy Bypass ^
    -File "scripts\generate-core-indexes.ps1"

if errorlevel 1 (
    echo.
    echo [ERROR] Failed generating indexes
    pause
    exit /b 1
)

REM =========================================================
REM CLEAN EMPTY DIRECTORIES
REM =========================================================

echo.
echo ------------------------------------------
echo [4/4] Cleaning empty directories
echo ------------------------------------------
echo.

for /f "delims=" %%d in ('dir "packages\core\src" /ad /b /s ^| sort /r') do (
    rd "%%d" 2>nul
)

echo.
echo ==========================================
echo         CORE REFACTOR COMPLETED
echo ==========================================
echo.

echo Suggested next steps:
echo.
echo   1. Run pnpm lint
echo   2. Run pnpm build
echo   3. Run pnpm test
echo   4. Fix import paths
echo   5. Review generated index.ts files
echo.

pause
endlocal