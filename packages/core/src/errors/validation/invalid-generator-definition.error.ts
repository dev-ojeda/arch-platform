import { VALIDATION_ERROR_CODES } from './validation-error-codes.js';
import { ValidationError } from './validation-errors.js';

export class InvalidGeneratorDefinitionError extends ValidationError {
  constructor(generatorId: string) {
    super(
      `Invalid generator definition: ${generatorId}`,

      VALIDATION_ERROR_CODES.INVALID_GENERATOR_DEFINITION,

      {
        metadata: {
          generatorId,
        },
      },
    );
  }
}
