// packages/core/src/errors/codes/generation.codes.ts

export const GENERATION_ERROR_CODES = {
  GENERATION_CANCELLED: 'ARCH-GEN-001',

  INVALID_OUTPUT_PATH: 'ARCH-GEN-002',

  EMPTY_TEMPLATE: 'ARCH-GEN-003',

  TEMPLATE_NOT_FOUND: 'ARCH-GEN-004',

  FILE_WRITE_FAILED: 'ARCH-GEN-005',
} as const;

export type GenerationErrorCode =
  (typeof GENERATION_ERROR_CODES)[keyof typeof GENERATION_ERROR_CODES];
