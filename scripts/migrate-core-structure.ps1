$root = "packages/core/src"

$moves = @{

    # =========================================================
    # GENERATION
    # =========================================================

    "cancellation/assert-not-cancelled.ts" =
    "generation/cancellation/assert-not-cancelled.ts"

    "engine/generation-hooks.ts" =
    "generation/engine/generation-hooks.ts"

    "output/output-path.ts" =
    "generation/output/output-path.ts"

    "security/generation-security.ts" =
    "generation/security/generation-security.ts"

    "transforms/content-transformer.ts" =
    "generation/transforms/content-transformer.ts"

    "variables/build-variables.ts" =
    "generation/variables/build-variables.ts"

    "variables/types.ts" =
    "generation/variables/types.ts"

    # =========================================================
    # PROMPTS
    # =========================================================

    "prompts/prompt-defaults.ts" =
    "prompts/defaults/prompt-defaults.ts"

    "prompts/prompt-resolver.ts" =
    "prompts/resolution/prompt-resolver.ts"

    "prompts/prompt-validator.ts" =
    "prompts/validation/prompt-validator.ts"

    "prompts/prompt-types.ts" =
    "prompts/types/prompt-types.ts"

    "prompts/prompt-errors.ts" =
    "prompts/errors/prompt-errors.ts"

    # =========================================================
    # TEMPLATES
    # =========================================================

    "templates/template-resolver.ts" =
    "templates/resolution/template-resolver.ts"

    "templates/validate-template-variables.ts" =
    "templates/validation/validate-template-variables.ts"

    "templates/is-reserved-template-variable.ts" =
    "templates/reserved/is-reserved-template-variable.ts"

    "templates/language-registry.ts" =
    "templates/language/language-registry.ts"

    # =========================================================
    # REGISTRY
    # =========================================================

    "registry/generator-registry.ts" =
    "registry/generators/generator-registry.ts"

    "languages/language-convention-registry.ts" =
    "registry/languages/language-convention-registry.ts"

    # =========================================================
    # CONVENTIONS
    # =========================================================

    "languages/conventions/typescript.convention.ts" =
    "conventions/languages/typescript/typescript.convention.ts"

    # =========================================================
    # ERRORS
    # =========================================================

    "errors/base-error.ts" =
    "errors/base/base-error.ts"

    # filesystem

    "errors/filesystem/filesystem-error.ts" =
    "errors/filesystem/filesystem-error.ts"

    "errors/filesystem/filesystem-error-codes.ts" =
    "errors/filesystem/filesystem-error-codes.ts"

    "errors/filesystem/filesystem-generator-definition.error.ts" =
    "errors/filesystem/filesystem-generator-definition.error.ts"

    # generation

    "errors/generation/generation-cancelled.error.ts" =
    "errors/generation/generation-cancelled.error.ts"

    "errors/generation/generation-error-codes.ts" =
    "errors/generation/generation-error-codes.ts"

    "errors/generation/generation-errors.ts" =
    "errors/generation/generation-errors.ts"

    # prompts

    "errors/prompts/prompt-errors.ts" =
    "errors/prompts/prompt-errors.ts"

    # registry

    "errors/registry/registry-errors.ts" =
    "errors/registry/registry-errors.ts"

    # runtime

    "errors/runtime/runtime-errors.ts" =
    "errors/runtime/runtime-errors.ts"

    # validation

    "errors/validation/invalid-generator-definition.error.ts" =
    "errors/validation/invalid-generator-definition.error.ts"

    "errors/validation/validation-error-codes.ts" =
    "errors/validation/validation-error-codes.ts"

    "errors/validation/validation-errors.ts" =
    "errors/validation/validation-errors.ts"

    # =========================================================
    # LOGGING
    # =========================================================

    "logging/console-logger.ts" =
    "logging/console-logger.ts"
}

Write-Host ""
Write-Host "========================================="
Write-Host "CORE STRUCTURE MIGRATION"
Write-Host "========================================="
Write-Host ""

foreach ($source in $moves.Keys) {

    $sourcePath = Join-Path $root $source
    $destinationPath = Join-Path $root $moves[$source]

    $destinationDirectory = Split-Path $destinationPath -Parent

    if (-not (Test-Path $sourcePath)) {

        Write-Warning "Missing source: $sourcePath"
        continue
    }

    if (-not (Test-Path $destinationDirectory)) {

        New-Item `
            -ItemType Directory `
            -Path $destinationDirectory `
            -Force | Out-Null
    }

    Move-Item `
        -Path $sourcePath `
        -Destination $destinationPath `
        -Force

    Write-Host "[MOVED] $source"
    Write-Host "         -> $($moves[$source])"
    Write-Host ""
}

Write-Host "========================================="
Write-Host "MIGRATION COMPLETED"
Write-Host "========================================="
Write-Host ""