$testRoot = Join-Path $env:TEMP "arch-branch-policy-test"
$work = Join-Path $testRoot "work"

Set-Location $work

.\scripts\git\feature.bat start invalid/test-validation

"Exit code: $LASTEXITCODE"
git status -sb
git branch --show-current