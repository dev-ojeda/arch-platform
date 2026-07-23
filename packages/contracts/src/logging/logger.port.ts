// packages/contracts/src/logging/logger.port.ts

import type { LoggerOptions } from './logger.options.js';

export interface LoggerPort {
  trace(message: string, options?: LoggerOptions): void;

  debug(message: string, options?: LoggerOptions): void;

  info(message: string, options?: LoggerOptions): void;

  success(message: string, options?: LoggerOptions): void;

  warn(message: string, options?: LoggerOptions): void;

  error(message: string, options?: LoggerOptions): void;
}
