// packages/core/src/errors/validation/invalid-generator-definition.error.ts

import type { ErrorOptions } from '../base/base-error.js';
import { VALIDATION_ERROR_CODES } from '../codes/validation.codes.js';

import { ValidationError } from './validation-errors.js';

export interface InvalidGeneratorDefinitionMetadata {
  generatorId: string;
}

export class InvalidGeneratorDefinitionError extends ValidationError<InvalidGeneratorDefinitionMetadata> {
  constructor(generatorId: string, options?: ErrorOptions<InvalidGeneratorDefinitionMetadata>) {
    super(
      `Invalid generator definition: ${generatorId}`,

      VALIDATION_ERROR_CODES.INVALID_GENERATOR_DEFINITION,

      {
        ...options,

        metadata: {
          ...options?.metadata,

          generatorId,
        },
      },
    );
  }
}
