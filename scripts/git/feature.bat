@echo off
setlocal

REM =========================================
REM Git Flow Helper
REM =========================================
REM Uso:
REM   feature.bat start feature/nombre
REM   feature.bat start fix/nombre
REM   feature.bat start chore/nombre
REM   feature.bat start test/nombre
REM   feature.bat start docs/nombre
REM
REM   feature.bat finish feature/nombre
REM   feature.bat finish fix/nombre
REM   feature.bat finish chore/nombre
REM   feature.bat finish test/nombre
REM   feature.bat finish docs/nombre
REM
REM   feature.bat sync
REM   feature.bat cleanup
REM =========================================

set "DEV_BRANCH=dev"
set "COMMAND=%~1"
set "BRANCH_NAME=%~2"

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No estas dentro de un repositorio Git.
    exit /b 1
)

for /f "delims=" %%R in ('git rev-parse --show-toplevel 2^>nul') do set "REPO_ROOT=%%R"
for /f "delims=" %%R in ('git remote get-url origin 2^>nul') do set "ORIGIN_URL=%%R"

if not defined REPO_ROOT (
    echo [ERROR] No se pudo determinar la raiz del repositorio.
    exit /b 1
)

echo [INFO] Repositorio: "%REPO_ROOT%"
if defined ORIGIN_URL (
    echo [INFO] Remoto origin: "%ORIGIN_URL%"
) else (
    echo [WARN] No se pudo determinar el remoto origin.
)

if /I "%COMMAND%"=="start" goto start
if /I "%COMMAND%"=="finish" goto finish
if /I "%COMMAND%"=="sync" goto sync
if /I "%COMMAND%"=="cleanup" goto cleanup
goto usage


REM =========================================
REM START
REM =========================================
:start

if not defined BRANCH_NAME (
    echo [ERROR] Debes indicar el nombre de la rama.
    exit /b 1
)

node "%~dp0validate-branch-name.mjs" "%BRANCH_NAME%"
if errorlevel 1 exit /b 1

git check-ref-format --branch "%BRANCH_NAME%" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Nombre de rama no valido para Git.
    exit /b 1
)

REM Fail closed: never switch branches with pending changes.
for /f "delims=" %%i in ('git status --porcelain') do (
    echo [ERROR] Hay cambios pendientes en el repositorio.
    echo [INFO] Guarda los cambios en un commit o usa stash antes de ejecutar start.
    exit /b 1
)

REM Require origin before any branch-changing or network operation.
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No existe un remoto origin configurado.
    exit /b 1
)

REM Refuse to overwrite an existing local branch.
git show-ref --verify --quiet "refs/heads/%BRANCH_NAME%"
if not errorlevel 1 (
    echo [ERROR] La rama local "%BRANCH_NAME%" ya existe.
    exit /b 1
)

echo.
echo =======================================
echo Sincronizando %DEV_BRANCH%
echo =======================================

git switch "%DEV_BRANCH%"
if errorlevel 1 exit /b 1

git fetch origin
if errorlevel 1 (
    echo [ERROR] No se pudieron actualizar las referencias remotas.
    exit /b 1
)

git pull --ff-only origin "%DEV_BRANCH%"
if errorlevel 1 (
    echo [ERROR] No se pudo sincronizar %DEV_BRANCH%.
    exit /b 1
)

REM Recheck the local branch after synchronization.
git show-ref --verify --quiet "refs/heads/%BRANCH_NAME%"
if not errorlevel 1 (
    echo [ERROR] La rama local "%BRANCH_NAME%" ya existe.
    exit /b 1
)

echo.
echo =======================================
echo Creando rama %BRANCH_NAME%
echo =======================================

git switch -c "%BRANCH_NAME%"
if errorlevel 1 exit /b 1

git push -u origin "%BRANCH_NAME%"
if errorlevel 1 (
    echo [ERROR] No se pudo publicar la rama.
    echo [INFO] La rama local se conserva.
    exit /b 1
)

echo.
echo [OK] Rama creada y publicada correctamente.
exit /b 0


REM =========================================
REM FINISH
REM =========================================
:finish

if not defined BRANCH_NAME (
    echo [ERROR] Debes indicar el nombre de la rama.
    exit /b 1
)

if /I "%BRANCH_NAME%"=="dev" goto protected_branch
if /I "%BRANCH_NAME%"=="main" goto protected_branch
if /I "%BRANCH_NAME%"=="staging" goto protected_branch

node "%~dp0validate-branch-name.mjs" "%BRANCH_NAME%"
if errorlevel 1 exit /b 1

git check-ref-format --branch "%BRANCH_NAME%" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Nombre de rama no valido para Git.
    exit /b 1
)

for /f "delims=" %%i in ('git status --porcelain') do (
    echo [ERROR] Hay cambios pendientes en el repositorio.
    echo [INFO] Guarda los cambios en un commit o usa stash antes de ejecutar finish.
    exit /b 1
)

git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No existe un remoto origin configurado.
    exit /b 1
)

echo.
echo =======================================
echo Actualizando referencias remotas
echo =======================================

git fetch --prune origin
if errorlevel 1 (
    echo [ERROR] No se pudieron actualizar las referencias.
    exit /b 1
)

echo.
echo =======================================
echo Sincronizando %DEV_BRANCH%
echo =======================================

git switch "%DEV_BRANCH%"
if errorlevel 1 exit /b 1

git pull --ff-only origin "%DEV_BRANCH%"
if errorlevel 1 (
    echo [ERROR] No se pudo actualizar %DEV_BRANCH%.
    exit /b 1
)

echo.
echo =======================================
echo Verificando integracion de la rama local
echo =======================================

git merge-base --is-ancestor "refs/heads/%BRANCH_NAME%" "refs/remotes/origin/%DEV_BRANCH%"
if errorlevel 1 (
    echo [ERROR] La rama local no esta integrada en origin/%DEV_BRANCH%.
    echo [INFO] No se eliminara ninguna rama.
    exit /b 1
)

echo.
echo =======================================
echo Verificando rama remota
echo =======================================

git show-ref --verify --quiet "refs/remotes/origin/%BRANCH_NAME%"
if not errorlevel 1 goto check_remote_integration

echo [INFO] La rama remota ya no existe.
goto delete_local


:check_remote_integration

git merge-base --is-ancestor "refs/remotes/origin/%BRANCH_NAME%" "refs/remotes/origin/%DEV_BRANCH%"
if errorlevel 1 (
    echo [ERROR] La rama remota no esta integrada en origin/%DEV_BRANCH%.
    echo [INFO] No se eliminara ninguna rama.
    exit /b 1
)

echo.
echo =======================================
echo Eliminando rama remota
echo =======================================

git push origin --delete "%BRANCH_NAME%"
if errorlevel 1 (
    echo [ERROR] No se pudo eliminar la rama remota.
    echo [INFO] La rama local se conserva.
    exit /b 1
)

:delete_local

echo.
echo =======================================
echo Eliminando rama local de forma segura
echo =======================================

git branch -d "%BRANCH_NAME%"
if errorlevel 1 (
    echo [ERROR] No se pudo eliminar la rama local.
    echo [INFO] No se forzara el borrado.
    exit /b 1
)

git fetch --prune origin
if errorlevel 1 (
    echo [WARN] La rama se elimino, pero fallo la limpieza de referencias.
    exit /b 1
)

echo.
echo [OK] Rama local y remota limpiadas de forma segura.
exit /b 0


:protected_branch
echo [ERROR] La rama %BRANCH_NAME% esta protegida por este script.
echo [INFO] No se eliminara.
exit /b 1


REM =========================================
REM SYNC
REM =========================================
:sync

REM Never switch branches when the worktree is dirty.
for /f "delims=" %%i in ('git status --porcelain') do (
    echo [ERROR] Hay cambios pendientes en el repositorio.
    echo [INFO] Guarda los cambios en un commit o usa stash antes de ejecutar sync.
    exit /b 1
)

git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No existe un remoto origin configurado.
    exit /b 1
)

echo.
echo =======================================
echo Sincronizando %DEV_BRANCH%
echo =======================================

git switch "%DEV_BRANCH%"
if errorlevel 1 exit /b 1

git fetch origin
if errorlevel 1 exit /b 1

git pull --ff-only origin "%DEV_BRANCH%"
if errorlevel 1 (
    echo [ERROR] No se pudo sincronizar %DEV_BRANCH%.
    exit /b 1
)

echo.
echo [OK] Sync completado.
exit /b 0


REM =========================================
REM CLEANUP
REM =========================================
:cleanup

git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No existe un remoto origin configurado.
    exit /b 1
)

git fetch --prune origin
if errorlevel 1 (
    echo [ERROR] Fallo la actualizacion de referencias remotas.
    exit /b 1
)

echo.
echo [OK] Referencias remotas obsoletas eliminadas.
echo [INFO] Este comando no elimina ramas existentes en GitHub.
exit /b 0


REM =========================================
REM USAGE
REM =========================================
:usage

echo.
echo =======================================
echo Git Flow Helper
echo =======================================
echo.
echo Uso:
echo   feature.bat start tipo/nombre
echo   feature.bat finish tipo/nombre
echo   feature.bat sync
echo   feature.bat cleanup
echo.
echo Ejemplos:
echo   feature.bat start feature/cache
echo   feature.bat start fix/output-validator
echo   feature.bat start test/branch-policy
echo   feature.bat start docs/branch-policy
echo   feature.bat start chore/update-eslint
echo   feature.bat finish chore/manage-pnpm-cache
echo.
exit /b 1
