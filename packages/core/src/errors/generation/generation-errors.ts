// packages/core/src/errors/generation/generation-errors.ts

import { BaseError }
from '../base/base-error.js'
import type { GenerationErrorCode } from './generation-error-codes.js'


export abstract class GenerationError
extends BaseError<
    GenerationErrorCode
> {

    readonly code: GenerationErrorCode

    constructor(
        message: string,
        code: GenerationErrorCode,
        options?: {
            cause?: unknown
        }
    ) {

        super(
            message,
            options
        )

        this.code =
            code
    }
}


