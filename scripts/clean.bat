@echo off
setlocal EnableDelayedExpansion

title Arch Platform Cleanup

echo.
echo ==========================================
echo   LIMPIEZA DE WORKSPACE / MONOREPO
echo ==========================================
echo.

:: Contadores
set /a DIRS_REMOVED=0
set /a FILES_REMOVED=0

:: Carpetas a eliminar
set DIR_TARGETS=node_modules dist .turbo

:: Archivos a eliminar
set FILE_TARGETS=*.tsbuildinfo

:: ==========================================
:: ELIMINAR CARPETAS
:: ==========================================

for %%T in (%DIR_TARGETS%) do (
    echo [INFO] Buscando %%T ...

    for /d /r %%D in (%%T) do (
        echo [DEL] %%D
        rmdir /s /q "%%D" 2>nul

        if not exist "%%D" (
            set /a DIRS_REMOVED+=1
        )
    )

    echo.
)

:: ==========================================
:: ELIMINAR ARCHIVOS
:: ==========================================

for %%F in (%FILE_TARGETS%) do (
    echo [INFO] Buscando %%F ...

    for /r %%X in (%%F) do (
        echo [DEL] %%X
        del /f /q "%%X" 2>nul

        if not exist "%%X" (
            set /a FILES_REMOVED+=1
        )
    )

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