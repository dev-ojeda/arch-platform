
$ErrorActionPreference = 'Stop'

$testRoot = Join-Path $env:TEMP 'arch-branch-policy-test'
$work = Join-Path $testRoot 'work'

if (-not (Test-Path (Join-Path $work '.git'))) {
    throw "No existe el clon temporal. Ejecuta lab-temp.ps1 primero."
}

$expectedRemote = Join-Path $testRoot 'remote.git'
$actualRemote = git -C $work remote get-url origin

if ($LASTEXITCODE -ne 0 -or
    [IO.Path]::GetFullPath($actualRemote.Trim()) -ne
    [IO.Path]::GetFullPath($expectedRemote)) {
    throw "El remoto del laboratorio no coincide con el esperado: $actualRemote"
}

$repoRoot = (git rev-parse --show-toplevel).Trim()
if ($LASTEXITCODE -ne 0 -or -not $repoRoot) {
    throw 'No se pudo determinar la raíz del repositorio fuente.'
}

$helperDir = Join-Path $work 'scripts/git'
$configDir = Join-Path $work 'config'

New-Item -ItemType Directory -Force $helperDir | Out-Null
New-Item -ItemType Directory -Force $configDir | Out-Null

Copy-Item (Join-Path $repoRoot 'scripts/git/feature.bat') `
    (Join-Path $helperDir 'feature.bat') -Force

Copy-Item (Join-Path $repoRoot 'scripts/git/validate-branch-name.mjs') `
    (Join-Path $helperDir 'validate-branch-name.mjs') -Force

Copy-Item (Join-Path $repoRoot 'config/git-branch-policy.json') `
    (Join-Path $configDir 'git-branch-policy.json') -Force

git -C $work config user.name 'ARCH Test'
if ($LASTEXITCODE -ne 0) { throw 'No se pudo configurar user.name.' }

git -C $work config user.email 'arch-test@example.invalid'
if ($LASTEXITCODE -ne 0) { throw 'No se pudo configurar user.email.' }

git -C $work add scripts/git/feature.bat `
    scripts/git/validate-branch-name.mjs `
    config/git-branch-policy.json

if ($LASTEXITCODE -ne 0) { throw 'No se pudieron preparar los archivos de prueba.' }

git -C $work commit -m 'test: prepare isolated branch policy helper'
if ($LASTEXITCODE -ne 0) { throw 'No se pudieron registrar los archivos de prueba.' }

git -C $work status -sb
if ($LASTEXITCODE -ne 0) { throw 'No se pudo comprobar el estado del clon.' }

$pending = git -C $work status --porcelain
if ($LASTEXITCODE -ne 0 -or $pending) {
    throw 'El clon temporal debe quedar limpio antes de ejecutar las pruebas.'
}

Write-Host '[OK] Helper preparado en el clon temporal.'
Write-Host "[INFO] Repositorio de prueba: $work"
Write-Host "[INFO] Remoto aislado: $actualRemote"
