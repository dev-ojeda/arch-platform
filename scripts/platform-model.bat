@echo off
setlocal

echo ======================================
echo Creando estructura platform-model
echo ======================================

:: Base
set BASE=packages\platform-model

:: =========================
:: Directorios
:: =========================

mkdir "%BASE%\src\artifacts" 2>nul
mkdir "%BASE%\src\capabilities" 2>nul
mkdir "%BASE%\src\conventions" 2>nul
mkdir "%BASE%\src\patterns" 2>nul
mkdir "%BASE%\src\stacks" 2>nul
mkdir "%BASE%\src\generators" 2>nul
mkdir "%BASE%\src\compatibility" 2>nul
mkdir "%BASE%\src\graph" 2>nul

:: =========================
:: Archivos raíz
:: =========================

type nul > "%BASE%\package.json"
type nul > "%BASE%\tsconfig.json"

:: =========================
:: artifacts
:: =========================

type nul > "%BASE%\src\artifacts\artifact-definition.ts"
type nul > "%BASE%\src\artifacts\artifact-kind.ts"
type nul > "%BASE%\src\artifacts\artifact-role.ts"

:: =========================
:: capabilities
:: =========================

type nul > "%BASE%\src\capabilities\capability-definition.ts"
type nul > "%BASE%\src\capabilities\capability-category.ts"

:: =========================
:: conventions
:: =========================

type nul > "%BASE%\src\conventions\convention-definition.ts"
type nul > "%BASE%\src\conventions\convention-type.ts"
type nul > "%BASE%\src\conventions\naming-convention.ts"
type nul > "%BASE%\src\conventions\folder-convention.ts"

:: =========================
:: patterns
:: =========================

type nul > "%BASE%\src\patterns\pattern-definition.ts"

:: =========================
:: stacks
:: =========================

type nul > "%BASE%\src\stacks\technology-stack.ts"
type nul > "%BASE%\src\stacks\language-definition.ts"
type nul > "%BASE%\src\stacks\framework-definition.ts"

:: =========================
:: generators
:: =========================

type nul > "%BASE%\src\generators\generator-mapping.ts"

:: =========================
:: compatibility
:: =========================

type nul > "%BASE%\src\compatibility\compatibility-rule.ts"

:: =========================
:: graph
:: =========================

type nul > "%BASE%\src\graph\artifact-node.ts"
type nul > "%BASE%\src\graph\artifact-edge.ts"

:: =========================
:: index
:: =========================

type nul > "%BASE%\src\index.ts"

echo.
echo ✅ Estructura platform-model creada correctamente
pause