// packages/build-core/src/logging/logger.ts

import { safeStringify } from '../serialization/safe-stringify.js';

import { LOG_LEVELS } from './log-levels.js';
import type { LogLevel, LogMetadata, LogOptions } from './log-types.js';
import { sanitizeMetadata } from './sanitize-metadata.js';
import {
  TRACE_CACHE_ENABLED,
  TRACE_ENABLED,
  TRACE_HASH_ENABLED,
  type TraceCategory,
} from './trace-config.js';

const ARCH_PREFIX = '[arch]';

function isTraceEnabled(category?: TraceCategory): boolean {
  if (TRACE_ENABLED) {
    return true;
  }

  switch (category) {
    case 'cache':
      return TRACE_CACHE_ENABLED;
    case 'hash':
      return TRACE_HASH_ENABLED;
    default:
      return false;
  }
}
function write(level: LogLevel, message: string, options: LogOptions = {}): void {
  const { prefix = true, metadata } = options;

  const timestamp = new Date().toISOString();

  const cleanMetadata: LogMetadata | undefined = metadata ? sanitizeMetadata(metadata) : undefined;

  const formatted = prefix ? `${ARCH_PREFIX} ${message}` : message;

  const payload = cleanMetadata
    ? `[${timestamp}] ${formatted}\n${safeStringify(cleanMetadata, 2)}`
    : `[${timestamp}] ${formatted}`;

  const { write: writer, symbol } = LOG_LEVELS[level];

  writer(`${symbol}${payload}`);
}

export const logger = {
  trace(message: string, options: LogOptions & { category?: TraceCategory } = {}): void {
    if (!isTraceEnabled(options.category)) {
      return;
    }

    write('trace', message, options);
  },

  info(message: string, options?: LogOptions): void {
    write('info', message, options);
  },

  success(message: string, options?: LogOptions): void {
    write('success', message, options);
  },

  warn(message: string, options?: LogOptions): void {
    write('warn', message, options);
  },

  error(message: string, options?: LogOptions): void {
    write('error', message, options);
  },

  newline(): void {
    process.stdout.write('\n');
  },
};
