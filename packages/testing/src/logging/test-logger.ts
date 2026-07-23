// packages/testing/src/logging/test-logger.ts

import type { LoggerOptions, LoggerPort } from '@arch/contracts';

export interface TestLogEntry {
  level: 'debug' | 'info' | 'warn' | 'error' | 'trace' | 'success';

  message: string;

  options?: LoggerOptions;
}

export class TestLogger implements LoggerPort {
  readonly logs: TestLogEntry[] = [];
  trace(message: string, options?: LoggerOptions): void {
    this.logs.push({
      level: 'trace',
      message,
      options,
    });
  }

  debug(message: string, options?: LoggerOptions): void {
    this.logs.push({
      level: 'debug',
      message,
      options,
    });
  }
  info(message: string, options?: LoggerOptions): void {
    this.logs.push({
      level: 'info',
      message,
      options,
    });
  }
  success(message: string, options?: LoggerOptions): void {
    this.logs.push({
      level: 'success',
      message,
      options,
    });
  }
  warn(message: string, options?: LoggerOptions): void {
    this.logs.push({
      level: 'warn',
      message,
      options,
    });
  }

  error(message: string, options?: LoggerOptions): void {
    this.logs.push({
      level: 'error',
      message,
      options,
    });
  }
}
