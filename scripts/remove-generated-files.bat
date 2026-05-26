@echo off
setlocal enabledelayedexpansion

REM =========================================================
REM Remove TS build artifacts from packages/*/src
REM =========================================================

echo.
echo =========================================================
echo  Removing TypeScript build artifacts
echo =========================================================
echo.

set FILE_PATTERNS=*.js *.d.ts *.d.ts.map *.js.map

for /d %%p in (packages\*) do (

    if exist "%%p\src" (

        echo.
        echo [INFO] Processing %%p\src

        for %%x in (%FILE_PATTERNS%) do (

            for /r "%%p\src" %%f in (%%x) do (

                del /f /q "%%f"

                echo [ OK ] Removed: %%f
            )
        )
    )
)

echo.
echo =========================================================
echo  Cleanup completed
echo =========================================================
echo.

exit /b 0