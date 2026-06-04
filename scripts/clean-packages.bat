@echo off
setlocal enabledelayedexpansion

REM =========================================================
REM Cleanup pnpm/turbo workspace artifacts
REM =========================================================

echo.
echo =========================================================
echo  Cleaning .turbo and package node_modules
echo =========================================================
echo.

REM =========================================================
REM REMOVE ROOT .turbo
REM =========================================================

if exist ".turbo" (

    echo [INFO] Removing root .turbo

    rmdir /s /q ".turbo"

    echo [ OK ] Removed: .turbo
) else (

    echo [INFO] Root .turbo not found
)

REM =========================================================
REM REMOVE package node_modules
REM =========================================================

for /d %%p in (packages\*) do (

    if exist "%%p\node_modules" (

        echo.
        echo [INFO] Removing: %%p\node_modules

        rmdir /s /q "%%p\node_modules"

        echo [ OK ] Removed: %%p\node_modules
    )
)

REM =========================================================
REM FINISHED
REM =========================================================

echo.
echo =========================================================
echo  Cleanup completed
echo =========================================================
echo.

exit /b 0