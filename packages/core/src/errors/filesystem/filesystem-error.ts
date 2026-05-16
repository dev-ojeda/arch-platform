import { BaseError }
from '../base/base-error.js'

import type {
  FileSystemErrorCode
}
from './filesystem-error-codes.js'

export abstract class FileSystemnError
extends BaseError {

    readonly code: FileSystemErrorCode

    constructor(
        message: string,
        code: FileSystemErrorCode,
        options?: {
            cause?: unknown
            metadata?: unknown
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