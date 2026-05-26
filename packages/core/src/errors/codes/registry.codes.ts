// packages/core/src/errors/codes/registry.codes.ts

export const REGISTRY_ERROR_CODES = {
  GENERATOR_NOT_FOUND: 'ARCH-REG-001',

  DUPLICATE_GENERATOR: 'ARCH-REG-002',

  LANGUAGE_NOT_FOUND: 'ARCH-REG-003',
} as const;

export type RegistryErrorCode = (typeof REGISTRY_ERROR_CODES)[keyof typeof REGISTRY_ERROR_CODES];
