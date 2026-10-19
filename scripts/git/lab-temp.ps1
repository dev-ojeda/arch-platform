$testRoot = Join-Path $env:TEMP "arch-branch-policy-test"

if (Test-Path $testRoot) {
  Remove-Item $testRoot -Recurse -Force
}

$remote = Join-Path $testRoot "remote.git"
$seed = Join-Path $testRoot "seed"
$work = Join-Path $testRoot "work"

New-Item -ItemType Directory -Path $testRoot | Out-Null

git init --bare --initial-branch=dev $remote
if ($LASTEXITCODE -ne 0) { throw "No se pudo crear el remoto temporal" }

git init --initial-branch=dev $seed
if ($LASTEXITCODE -ne 0) { throw "No se pudo crear el repositorio inicial" }

git -C $seed config user.name "ARCH Test"
git -C $seed config user.email "arch-test@example.invalid"

Set-Content (Join-Path $seed "README.md") "# Branch policy test"

git -C $seed add README.md
git -C $seed commit -m "test: initialize isolated repository"
if ($LASTEXITCODE -ne 0) { throw "No se pudo crear el commit inicial" }

git -C $seed remote add origin $remote
git -C $seed push -u origin dev
if ($LASTEXITCODE -ne 0) { throw "No se pudo publicar dev en el remoto temporal" }

git clone $remote $work
if ($LASTEXITCODE -ne 0) { throw "No se pudo clonar el repositorio temporal" }

git -C $work status -sb
git -C $work remote -v
