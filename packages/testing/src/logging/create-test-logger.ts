// packages/testing/src/logging/create-test-logger.ts

import type { LoggerPort } from '@arch/contracts/logging';

export function createTestLogger(): LoggerPort {
  return {
    debug(): void {},

    info(): void {},

    warn(): void {},

    error(): void {},
  };
}
