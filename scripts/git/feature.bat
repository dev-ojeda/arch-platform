@echo off
setlocal enabledelayedexpansion

REM =========================================
REM Git Flow Helper
REM =========================================
REM Uso:
REM
REM feature.bat start feature/nombre
REM feature.bat start fix/nombre
REM feature.bat start refactor/nombre
REM feature.bat start chore/nombre
REM
REM feature.bat finish feature/nombre
REM feature.bat finish fix/nombre
REM feature.bat finish refactor/nombre
REM
REM feature.bat sync
REM feature.bat cleanup
REM =========================================

set DEV_BRANCH=dev

set COMMAND=%1
set BRANCH_NAME=%2

git rev-parse --is-inside-work-tree >nul 2>&1

if errorlevel 1 (
    echo [ERROR] No estas dentro de un repositorio Git
    exit /b 1
)

REM =========================================
REM START
REM =========================================

if /I "%COMMAND%"=="start" (

    if "%BRANCH_NAME%"=="" (
        echo [ERROR] Debes indicar el nombre de la rama.
        exit /b 1
    )

    echo.
    echo =======================================
    echo Sincronizando %DEV_BRANCH%
    echo =======================================

    git checkout %DEV_BRANCH%
    if errorlevel 1 exit /b 1

    git pull origin %DEV_BRANCH%
    if errorlevel 1 exit /b 1

    echo.
    echo =======================================
    echo Creando rama %BRANCH_NAME%
    echo =======================================

    git checkout -b %BRANCH_NAME%
    if errorlevel 1 exit /b 1

    git push -u origin %BRANCH_NAME%
    if errorlevel 1 exit /b 1

    echo.
    echo [OK] Rama creada correctamente.
    exit /b 0
)

REM =========================================
REM FINISH
REM =========================================

if /I "%COMMAND%"=="finish" (

    if "%BRANCH_NAME%"=="" (
        echo [ERROR] Debes indicar el nombre de la rama.
        exit /b 1
    )

    echo.
    echo =======================================
    echo Cambiando a %DEV_BRANCH%
    echo =======================================

    git checkout %DEV_BRANCH%
    if errorlevel 1 exit /b 1

    echo.
    echo =======================================
    echo Eliminando rama local
    echo =======================================

    git branch -d %BRANCH_NAME%

    if errorlevel 1 (
        echo [WARN] Eliminacion segura fallo. Forzando...
        git branch -D %BRANCH_NAME%
    )

    echo.
    echo =======================================
    echo Eliminando rama remota
    echo =======================================

    git push origin --delete %BRANCH_NAME%

    echo.
    echo =======================================
    echo Limpiando referencias remotas
    echo =======================================

    git fetch --prune
    git remote prune origin

    echo.
    echo [OK] Rama eliminada correctamente.
    exit /b 0
)

REM =========================================
REM SYNC
REM =========================================

if /I "%COMMAND%"=="sync" (

    git checkout %DEV_BRANCH%
    if errorlevel 1 exit /b 1

    git pull origin %DEV_BRANCH%
    if errorlevel 1 exit /b 1

    echo.
    echo [OK] Sync completado.
    exit /b 0
)

REM =========================================
REM CLEANUP
REM =========================================

if /I "%COMMAND%"=="cleanup" (

    git fetch --prune
    git remote prune origin

    echo.
    echo [OK] Cleanup completado.
    exit /b 0
)

echo.
echo =======================================
echo Git Flow Helper
echo =======================================
echo.
echo Uso:
echo.
echo   feature.bat start tipo/nombre
echo   feature.bat finish tipo/nombre
echo.
echo Ejemplos:
echo.
echo   feature.bat start feature/cache
echo   feature.bat start fix/output-validator
echo   feature.bat start refactor/build-runtime-bootstrap
echo   feature.bat start chore/update-eslint
echo.
echo   feature.bat finish refactor/build-runtime-bootstrap
echo.
echo   feature.bat sync
echo   feature.bat cleanup