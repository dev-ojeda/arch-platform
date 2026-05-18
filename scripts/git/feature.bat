@echo off
setlocal enabledelayedexpansion

REM =========================================
REM Git Feature Flow Helper (Windows BAT)
REM =========================================
REM Uso:
REM
REM feature.bat start feature/nombre
REM feature.bat finish feature/nombre
REM feature.bat sync
REM feature.bat cleanup
REM =========================================

set DEV_BRANCH=dev

set COMMAND=%1
set FEATURE_NAME=%2

REM =========================================
REM Validar Git
REM =========================================

git rev-parse --is-inside-work-tree >nul 2>&1

if errorlevel 1 (
    echo [ERROR] No estas dentro de un repositorio Git
    exit /b 1
)

REM =========================================
REM START FEATURE
REM =========================================

if "%COMMAND%"=="start" (

    if "%FEATURE_NAME%"=="" (
        echo [ERROR] Debes indicar el nombre de la feature
        exit /b 1
    )

    echo.
    echo =======================================
    echo Sincronizando %DEV_BRANCH%
    echo =======================================

    git checkout %DEV_BRANCH%
    git pull origin %DEV_BRANCH%

    echo.
    echo =======================================
    echo Creando feature %FEATURE_NAME%
    echo =======================================

    git checkout -b %FEATURE_NAME%

    git push -u origin %FEATURE_NAME%

    echo.
    echo [OK] Feature creada correctamente
    exit /b 0
)

REM =========================================
REM FINISH FEATURE
REM =========================================

if "%COMMAND%"=="finish" (

    if "%FEATURE_NAME%"=="" (
        echo [ERROR] Debes indicar el nombre de la feature
        exit /b 1
    )

    echo.
    echo =======================================
    echo Cambiando a %DEV_BRANCH%
    echo =======================================

    git checkout %DEV_BRANCH%

    echo.
    echo =======================================
    echo Eliminando branch local
    echo =======================================

    git branch -d %FEATURE_NAME%

    if errorlevel 1 (
        echo [WARN] Eliminacion segura fallo, forzando...
        git branch -D %FEATURE_NAME%
    )

    echo.
    echo =======================================
    echo Eliminando branch remota
    echo =======================================

    git push origin --delete %FEATURE_NAME%

    echo.
    echo =======================================
    echo Limpiando referencias remotas
    echo =======================================

    git fetch --prune

    echo.
    echo [OK] Feature eliminada correctamente
    exit /b 0
)

REM =========================================
REM SYNC
REM =========================================

if "%COMMAND%"=="sync" (

    echo.
    echo =======================================
    echo Sincronizando %DEV_BRANCH%
    echo =======================================

    git checkout %DEV_BRANCH%
    git pull origin %DEV_BRANCH%

    echo.
    echo [OK] Sync completado
    exit /b 0
)

REM =========================================
REM CLEANUP
REM =========================================

if "%COMMAND%"=="cleanup" (

    echo.
    echo =======================================
    echo Limpiando referencias remotas
    echo =======================================

    git fetch --prune
    git remote prune origin

    echo.
    echo [OK] Cleanup completado
    exit /b 0
)

REM =========================================
REM HELP
REM =========================================

echo.
echo =======================================
echo Git Feature Flow Helper
echo =======================================
echo.
echo Uso:
echo.
echo   feature.bat start feature/nombre
echo   feature.bat finish feature/nombre
echo   feature.bat sync
echo   feature.bat cleanup
echo.
