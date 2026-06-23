// packages/testing/src/logging/test-logger.ts

import type { LoggerPort } from '@arch/contracts';

export interface TestLogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';

  message: string;

  meta?: Record<string, unknown>;
}

export class TestLogger implements LoggerPort {
  readonly logs: TestLogEntry[] = [];

  debug(
    message: string,

    meta?: Record<string, unknown>,
  ): void {
    this.logs.push({
      level: 'debug',

      message,

      meta,
    });
  }

  info(
    message: string,

    meta?: Record<string, unknown>,
  ): void {
    this.logs.push({
      level: 'info',

      message,

      meta,
    });
  }

  warn(
    message: string,

    meta?: Record<string, unknown>,
  ): void {
    this.logs.push({
      level: 'warn',

      message,

      meta,
    });
  }

  error(
    message: string,

    meta?: Record<string, unknown>,
  ): void {
    this.logs.push({
      level: 'error',

      message,

      meta,
    });
  }

  clear(): void {
    this.logs.length = 0;
  }
}
