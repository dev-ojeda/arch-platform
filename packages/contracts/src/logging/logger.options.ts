// packages/contracts/src/logging/logger.options.ts

import type { LoggerSource } from './logger.source.js';

export interface LoggerOptions {
  readonly source?: LoggerSource;

  readonly metadata?: Record<string, unknown>;
}
