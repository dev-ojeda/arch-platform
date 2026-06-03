@echo off
setlocal enabledelayedexpansion

REM =========================================================
REM Application Package Test Structure Generator
REM =========================================================

echo.
echo =========================================================
echo  Creating application package structure
echo =========================================================
echo.

REM =========================================================
REM CONFIGURATION
REM =========================================================

set "ROOT_DIR=packages\application"

set "SRC_DIR=%ROOT_DIR%\src"
set "TEST_DIR=%ROOT_DIR%\test"

REM =========================================================
REM CREATE ROOT DIRECTORIES
REM =========================================================

echo [INFO] Creating root directories...

mkdir "%ROOT_DIR%" 2>nul
mkdir "%SRC_DIR%" 2>nul
mkdir "%TEST_DIR%" 2>nul

echo [ OK ] Root directories created

REM =========================================================
REM CREATE UNIT TEST STRUCTURE
REM =========================================================

echo.
echo [INFO] Creating unit test structure...

mkdir "%TEST_DIR%\unit" 2>nul

mkdir "%TEST_DIR%\unit\runtime" 2>nul
mkdir "%TEST_DIR%\unit\timeline" 2>nul
mkdir "%TEST_DIR%\unit\pipeline" 2>nul
mkdir "%TEST_DIR%\unit\telemetry" 2>nul

echo [ OK ] Unit test structure created

REM =========================================================
REM CREATE INTEGRATION TEST STRUCTURE
REM =========================================================

echo.
echo [INFO] Creating integration test structure...

mkdir "%TEST_DIR%\integration" 2>nul

mkdir "%TEST_DIR%\integration\generation-pipeline" 2>nul
mkdir "%TEST_DIR%\integration\runtime-events" 2>nul
mkdir "%TEST_DIR%\integration\execution" 2>nul

echo [ OK ] Integration test structure created

REM =========================================================
REM CREATE CONTRACT TEST STRUCTURE
REM =========================================================

echo.
echo [INFO] Creating contract test structure...

mkdir "%TEST_DIR%\contracts" 2>nul

type nul > "%TEST_DIR%\contracts\runtime-event-bus.contract.test.ts"
type nul > "%TEST_DIR%\contracts\timeline-aggregator.contract.test.ts"

echo [ OK ] Contract test files created

REM =========================================================
REM CREATE FIXTURES
REM =========================================================

echo.
echo [INFO] Creating fixtures structure...

mkdir "%TEST_DIR%\fixtures" 2>nul

mkdir "%TEST_DIR%\fixtures\generators" 2>nul
mkdir "%TEST_DIR%\fixtures\templates" 2>nul
mkdir "%TEST_DIR%\fixtures\runtime" 2>nul

echo [ OK ] Fixtures structure created

REM =========================================================
REM CREATE HELPERS
REM =========================================================

echo.
echo [INFO] Creating helper files...

mkdir "%TEST_DIR%\helpers" 2>nul

type nul > "%TEST_DIR%\helpers\create-test-runtime.ts"
type nul > "%TEST_DIR%\helpers\create-test-events.ts"

echo [ OK ] Helper files created

REM =========================================================
REM FINISHED
REM =========================================================

echo.
echo =========================================================
echo  Application package structure created successfully
echo =========================================================
echo.

exit /b 0