// packages/core/src/errors/registry/generator-not-found.error.ts

import type { ErrorOptions } from '../base/base-error.js';
import { REGISTRY_ERROR_CODES } from '../codes/registry.codes.js';

import { RegistryError } from './registry-errors.js';

export interface GeneratorNotFoundMetadata {
  generatorId: string;
}

export class GeneratorNotFoundError extends RegistryError<GeneratorNotFoundMetadata> {
  constructor(generatorId: string, options?: ErrorOptions<GeneratorNotFoundMetadata>) {
    super(
      `Generator not found: ${generatorId}`,

      REGISTRY_ERROR_CODES.GENERATOR_NOT_FOUND,

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
