// packages/testing/src/logging/create-test-logger.ts

import type { LoggerPort } from '@arch/contracts';

export function createTestLogger(): LoggerPort {
  return {
    debug(): void {},
    trace(): void {},
    info(): void {},
    warn(): void {},
    error(): void {},
    success(): void {},
  };
}
