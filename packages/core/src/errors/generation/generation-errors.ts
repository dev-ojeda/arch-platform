// packages\core\src\errors\generation\generation-errors.ts

import { BaseError }
from '../base-error.js'

export class GenerationError
extends BaseError {

    constructor(
        message: string,
        options?: {
            cause?: unknown
        }
    ) {

        super(
            message,
            options
        )
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

    readonly outputPath: string

    constructor(
        outputPath: string
    ) {

        super(
            `Invalid output path: ${outputPath}`
        )

        this.outputPath =
            outputPath
    }
}

export class EmptyTemplateError
extends GenerationError {

    readonly outputPath: string

    constructor(
        outputPath: string
    ) {

        super(
            `Invalid output path: ${outputPath}`
        )

        this.outputPath =
            outputPath
    }
}

export class TemplateNotFoundError
extends GenerationError {

    readonly outputPath: string

    constructor(
        outputPath: string
    ) {

        super(
            `Invalid output path: ${outputPath}`
        )

        this.outputPath =
            outputPath
    }
}

export class FileWriteError
extends GenerationError {

    constructor(
        outputPath: string,
        cause?: unknown
    ) {

        super(
            `Failed to write file: ${outputPath}`,
            { cause }
        )
    }
}