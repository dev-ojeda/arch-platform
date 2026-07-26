// packages/core/src/errors/registry/language-not-found.error.ts

import { REGISTRY_ERROR_CODES } from '../codes/registry.codes.js';

import { RegistryError } from './registry-errors.js';

import type { ErrorOptions } from '../base/base-error.js';

export interface LanguageNotFoundMetadata {
  languageId: string;
}

export class LanguageNotFoundError extends RegistryError<LanguageNotFoundMetadata> {
  constructor(languageId: string, options?: ErrorOptions<LanguageNotFoundMetadata>) {
    super(
      `Language convention not found: ${languageId}`,

      REGISTRY_ERROR_CODES.LANGUAGE_NOT_FOUND,

      {
        ...options,

        metadata: {
          ...options?.metadata,

          languageId,
        },
      },
    );
  }
}
