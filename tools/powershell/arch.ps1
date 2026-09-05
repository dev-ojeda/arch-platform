$ErrorActionPreference = 'Stop'

$workspaceRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$cliEntry = Join-Path $workspaceRoot 'packages/cli/dist/bin.js'

Push-Location $workspaceRoot

try {
    if (-not (Test-Path -LiteralPath $cliEntry -PathType Leaf)) {
        & pnpm exec turbo run build --filter=@arch-platform/cli...

        if ($LASTEXITCODE -ne 0) {
            exit $LASTEXITCODE
        }
    }

    & node (Join-Path $workspaceRoot 'packages/cli/bin/arch.js') @args

    exit $LASTEXITCODE
}
finally {
    Pop-Location
}