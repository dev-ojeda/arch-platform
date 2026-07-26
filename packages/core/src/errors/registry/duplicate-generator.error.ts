// packages/core/src/errors/registry/duplicate-generator.error.ts

import { REGISTRY_ERROR_CODES } from '../codes/registry.codes.js';

import { RegistryError } from './registry-errors.js';

import type { ErrorOptions } from '../base/base-error.js';

export interface DuplicateGeneratorMetadata {
  generatorId: string;
}

export class DuplicateGeneratorError extends RegistryError<DuplicateGeneratorMetadata> {
  constructor(generatorId: string, options?: ErrorOptions<DuplicateGeneratorMetadata>) {
    super(
      `Generator already registered: ${generatorId}`,

      REGISTRY_ERROR_CODES.DUPLICATE_GENERATOR,

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
