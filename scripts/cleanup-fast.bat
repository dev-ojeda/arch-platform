@echo off
setlocal EnableDelayedExpansion

title Arch Platform Fast Cleanup

echo.
echo ==========================================
echo   FAST CLEANUP WORKSPACE
echo ==========================================
echo.

:: Contadores
set /a DIRS_REMOVED=0
set /a FILES_REMOVED=0

:: ==========================================
:: DIRECTORIOS
:: ==========================================

for %%N in (dist build .turbo coverage .next .cache .vite .nx) do (

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
:: ARCHIVOS
:: ==========================================

for %%P in (*.tsbuildinfo .eslintcache) do (

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
:: TURBO CACHE
:: ==========================================

if exist ".turbo" (
    echo [INFO] Limpiando cache turbo...
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