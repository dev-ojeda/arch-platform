import { FILESYSTEM_ERROR_CODES } from './filesystem-error-codes.js'
import { FileSystemnError } from './filesystem-error.js'

export class FileSystemGeneratorDefinitionError
    extends FileSystemnError {

    constructor(
        generatorId: string
    ) {

        super(
            `Invalid generator definition: ${generatorId}`,

            FILESYSTEM_ERROR_CODES
                .INVALID_PATH,

            {
                metadata: {
                    generatorId
                }
            }
        )
    }
}