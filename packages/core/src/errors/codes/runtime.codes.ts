// packages/core/src/errors/codes/runtime.codes.ts

export const RUNTIME_ERROR_CODES = {
  UNKNOWN_RUNTIME_ERROR: 'ARCH-RT-001',

  COMMAND_EXECUTION_FAILED: 'ARCH-RT-002',
} as const;

export type RuntimeErrorCode = (typeof RUNTIME_ERROR_CODES)[keyof typeof RUNTIME_ERROR_CODES];
