@echo off
setlocal EnableDelayedExpansion

title Arch Platform Full Cleanup

echo.
echo ==========================================
echo   FULL CLEANUP WORKSPACE / MONOREPO
echo ==========================================
echo.

:: ==========================================
:: CONTADORES
:: ==========================================

set /a DIRS_REMOVED=0
set /a FILES_REMOVED=0

:: ==========================================
:: DIRECTORIOS A ELIMINAR
:: ==========================================

for %%N in (
    node_modules
    dist
    build
    coverage
    .turbo
    .next
    .cache
    .vite
    .nx
    .parcel-cache
    .swc
) do (

    echo [INFO] Buscando %%N ...

    for /f "delims=" %%D in ('dir /s /b /ad %%N 2^>nul') do (

        echo [DEL] %%D

        rmdir /s /q "%%D" 2>nul

        if not exist "%%D" (
            set /a DIRS_REMOVED+=1
        )
    )

    echo.
)

:: ==========================================
:: ARCHIVOS A ELIMINAR
:: ==========================================

for %%P in (
    *.tsbuildinfo
    .eslintcache
) do (

    echo [INFO] Buscando %%P ...

    for /f "delims=" %%F in ('dir /s /b %%P 2^>nul') do (

        echo [DEL] %%F

        del /f /q "%%F" 2>nul

        if not exist "%%F" (
            set /a FILES_REMOVED+=1
        )
    )

    echo.
)

:: ==========================================
:: LIMPIEZA PNPM STORE
:: ==========================================

where pnpm >nul 2>nul

if %ERRORLEVEL%==0 (
    echo [INFO] Ejecutando pnpm store prune...
    pnpm store prune
    echo.
)

:: ==========================================
:: RESUMEN
:: ==========================================

echo ==========================================
echo   LIMPIEZA FINALIZADA
echo ==========================================
echo.
echo Directorios eliminados: !DIRS_REMOVED!
echo Archivos eliminados:    !FILES_REMOVED!
echo.

pause