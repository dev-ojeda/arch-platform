// packages/core/src/errors/generation-errors.ts

export class GenerationError
extends Error {

    constructor(
        message: string
    ) {

        super(message)

        this.name =
            'GenerationError'
    }
}

export class GenerationCancelledError
extends GenerationError {

    constructor() {

        super(
            'Generation cancelled'
        )

        this.name =
            'GenerationCancelledError'
    }
}

export class InvalidOutputPathError
extends GenerationError {

    constructor(
        outputPath: string
    ) {

        super(
            `Invalid output path: ${outputPath}`
        )

        this.name =
            'InvalidOutputPathError'
    }
}

export class EmptyTemplateError
extends GenerationError {

    constructor(
        templatePath: string
    ) {

        super(
            `Template is empty: ${templatePath}`
        )

        this.name =
            'EmptyTemplateError'
    }
}

export class TemplateNotFoundError
extends GenerationError {

    constructor(
        templatePath: string
    ) {

        super(
            `Template not found: ${templatePath}`
        )

        this.name =
            'TemplateNotFoundError'
    }
}

export class FileWriteError
extends GenerationError {

    constructor(
        outputPath: string,
        cause?: unknown
    ) {

        super(
            `Failed to write file: ${outputPath}`
        )

        this.name =
            'FileWriteError'

        if (cause) {

            ;(
                this as Error & {
                    cause?: unknown
                }
            ).cause = cause
        }
    }
}