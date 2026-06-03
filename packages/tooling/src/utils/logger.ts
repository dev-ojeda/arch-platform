// packages\tooling\src\utils\logger.ts

import { safeStringify } from './safe-stringify.js';
import { sanitizeMetadata } from './sanitize-metadata.js';
import type { LogLevel } from './type-variable.js';
import { LOG_LEVELS } from './type-variable.js';

type LogMetadata = Readonly<Record<string, unknown>>;
interface LogOptions {
  readonly prefix?: boolean;

  readonly metadata?: LogMetadata;
}
const ARCH_PREFIX = '[arch]';

function write(level: LogLevel, message: string, options: LogOptions = {}): void {
  const { prefix = true, metadata } = options;

  const timestamp = new Date().toISOString();

  const sanitizedMetadata = sanitizeMetadata(metadata);

  const formattedMessage = prefix ? `${ARCH_PREFIX} ${message}` : message;

  const payload = sanitizedMetadata
    ? `[${timestamp}] ${formattedMessage}\n${safeStringify(sanitizedMetadata, 2)}`
    : `[${timestamp}] ${formattedMessage}`;

  const { write: writer, symbol } = LOG_LEVELS[level];

  writer(`${symbol}${payload}`);
}

export const logger = {
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
