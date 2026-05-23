// packages/core/src/errors/registry/registry-errors.ts

import { BaseError } from '../base/base-error.js';

export const REGISTRY_ERROR_CODES = {
  GENERATOR_NOT_FOUND: 'GENERATOR_NOT_FOUND',

  DUPLICATE_GENERATOR: 'DUPLICATE_GENERATOR',

  LANGUAGE_NOT_FOUND: 'LANGUAGE_NOT_FOUND',
} as const;

export type RegistryErrorCode = (typeof REGISTRY_ERROR_CODES)[keyof typeof REGISTRY_ERROR_CODES];

export class RegistryError extends BaseError {
  readonly code: RegistryErrorCode;

  constructor(
    message: string,

    code: RegistryErrorCode,

    options?: {
      cause?: unknown;
      metadata?: unknown;
    },
  ) {
    super(message, options);

    this.code = code;
  }
}

export class GeneratorNotFoundError extends RegistryError {
  readonly generatorId: string;

  constructor(generatorId: string) {
    super(
      `Generator not found: ${generatorId}`,

      REGISTRY_ERROR_CODES.GENERATOR_NOT_FOUND,

      {
        metadata: {
          generatorId,
        },
      },
    );

    this.generatorId = generatorId;
  }
}

export class DuplicateGeneratorError extends RegistryError {
  readonly generatorId: string;

  constructor(generatorId: string) {
    super(
      `Generator already registered: ${generatorId}`,

      REGISTRY_ERROR_CODES.DUPLICATE_GENERATOR,

      {
        metadata: {
          generatorId,
        },
      },
    );

    this.generatorId = generatorId;
  }
}

export class LanguageNotFoundError extends RegistryError {
  readonly languageId: string;

  constructor(languageId: string) {
    super(
      `Language convention not found: ${languageId}`,

      REGISTRY_ERROR_CODES.LANGUAGE_NOT_FOUND,

      {
        metadata: {
          languageId,
        },
      },
    );

    this.languageId = languageId;
  }
}
