import { GENERATION_ERROR_CODES } from "./generation-error-codes.js";
import { GenerationError } from "./generation-errors.js";

export class GenerationCancelledError
extends GenerationError {

    constructor() {

        super(
            'Generation cancelled',
            GENERATION_ERROR_CODES
                .GENERATION_CANCELLED
        )
    }
}