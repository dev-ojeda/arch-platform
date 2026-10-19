
$ErrorActionPreference = 'Stop'

$testRoot = Join-Path $env:TEMP 'arch-branch-policy-test'
$work = Join-Path $testRoot 'work'
$expectedRemote = [IO.Path]::GetFullPath(
    (Join-Path $testRoot 'remote.git')
)

if (-not (Test-Path (Join-Path $work 'scripts/git/feature.bat'))) {
    throw "No existe el helper en el clon de pruebas: $work"
}

$actualRemote = git -C $work remote get-url origin
if ($LASTEXITCODE -ne 0) {
    throw 'No se pudo consultar origin.'
}

if ([IO.Path]::GetFullPath($actualRemote.Trim()) -ne $expectedRemote) {
    throw "Prueba abortada: remoto inesperado: $actualRemote"
}

$initialStatus = git -C $work status --porcelain
if ($LASTEXITCODE -ne 0 -or $initialStatus) {
    throw 'El clon debe estar limpio antes de comenzar.'
}

$initialBranch = git -C $work branch --show-current
if ($LASTEXITCODE -ne 0 -or $initialBranch -ne 'dev') {
    throw "La prueba requiere iniciar en dev; rama actual: $initialBranch"
}

Push-Location $work
try {
    & .\scripts\git\feature.bat start feature/test-validation
    $exitCode = $LASTEXITCODE

    if ($exitCode -ne 0) {
        throw "El helper falló con código $exitCode."
    }
}
finally {
    Pop-Location
}

$actualBranch = git -C $work branch --show-current
if ($LASTEXITCODE -ne 0 -or $actualBranch -ne 'feature/test-validation') {
    throw "La rama activa no es la esperada: $actualBranch"
}

git -C $work show-ref --verify --quiet `
    refs/heads/feature/test-validation
if ($LASTEXITCODE -ne 0) {
    throw 'La rama local no existe.'
}

$remoteRefs = git -C $work ls-remote --heads origin feature/test-validation
if ($LASTEXITCODE -ne 0) {
    throw 'No se pudo verificar el remoto temporal.'
}

if (-not $remoteRefs) {
    throw 'La rama no fue publicada en el remoto temporal.'
}

$finalStatus = git -C $work status --porcelain
if ($LASTEXITCODE -ne 0 -or $finalStatus) {
    throw 'El clon terminó con cambios pendientes.'
}

Write-Host '[OK] Prueba positiva superada.'
Write-Host "[OK] Rama local: $actualBranch"
Write-Host "[OK] Rama publicada en el remoto temporal."
Write-Host '[OK] Árbol de trabajo limpio.'
