$root = "packages/core/src"

$directories = @(
    "generation",
    "generation/cancellation",
    "generation/engine",
    "generation/output",
    "generation/security",
    "generation/transforms",
    "generation/variables",
    "generation/__tests__",

    "prompts",
    "prompts/defaults",
    "prompts/resolution",
    "prompts/validation",
    "prompts/types",
    "prompts/errors",
    "prompts/__tests__",

    "templates",
    "templates/resolution",
    "templates/validation",
    "templates/reserved",
    "templates/language",
    "templates/internal",

    "registry",
    "registry/generators",
    "registry/languages",
    "registry/errors",

    "conventions",
    "conventions/languages",
    "conventions/languages/typescript",

    "errors",
    "errors/base",
    "errors/filesystem",
    "errors/generation",
    "errors/prompts",
    "errors/registry",
    "errors/runtime",
    "errors/validation",

    "logging",
    "internal"
)

foreach ($dir in $directories) {
    $path = Join-Path $root $dir

    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "[CREATED] $path"
    }
    else {
        Write-Host "[EXISTS ] $path"
    }
}