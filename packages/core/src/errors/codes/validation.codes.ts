// packages/core/src/errors/codes/validation.codes.ts

export const VALIDATION_ERROR_CODES = {
  INVALID_GENERATOR_DEFINITION: 'ARCH-VAL-001',

  DUPLICATE_OUTPUT_PATH: 'ARCH-VAL-002',

  MISSING_TEMPLATE_VARIABLE: 'ARCH-VAL-003',
} as const;

export type ValidationErrorCode =
  (typeof VALIDATION_ERROR_CODES)[keyof typeof VALIDATION_ERROR_CODES];
