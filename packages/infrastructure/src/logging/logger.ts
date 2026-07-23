// packages\infrastructure\src\logging\logger.ts
import type { LoggerLevel, LoggerOptions, LoggerPort, LoggerSource } from '@arch/contracts';

import { safeStringify } from '../serialization/safe-stringify.js';

import { LOG_LEVELS } from './log-levels.js';
import { sanitizeMetadata } from './sanitize-metadata.js';
import { getTraceComponent, isTraceEnabled } from './trace-config.js';

export class LoggerFactory {
  createLogger(source: LoggerSource): LoggerPort {
    return {
      trace: (message, options) => {
        this.write('trace', message, this.mergeOptions(source, options));
      },
      debug: (message, options) => {
        this.write('debug', message, this.mergeOptions(source, options));
      },
      info: (message, options) => {
        this.write('info', message, this.mergeOptions(source, options));
      },

      success: (message, options) => {
        this.write('success', message, this.mergeOptions(source, options));
      },

      warn: (message, options) => {
        this.write('warn', message, this.mergeOptions(source, options));
      },

      error: (message, options) => {
        this.write('error', message, this.mergeOptions(source, options));
      },
    };
  }

  private write(level: LoggerLevel, message: string, options: LoggerOptions = {}): void {
    if (level === 'trace') {
      if (!isTraceEnabled()) {
        return;
      }

      const component = getTraceComponent();

      if (component && options.source?.component !== component) {
        return;
      }
    }

    const { source, metadata } = options;

    const timestamp = new Date().toISOString();

    const payloadMetadata =
      source || metadata
        ? sanitizeMetadata({
            ...(source ? { source } : {}),
            ...(metadata ? { metadata } : {}),
          })
        : undefined;

    const formatted = `${message}`;

    const payload = payloadMetadata
      ? `[${timestamp}] ${formatted}\n${safeStringify(payloadMetadata, 2)}`
      : `[${timestamp}] ${formatted}`;

    const { write, symbol } = LOG_LEVELS[level];

    write(`${symbol}${payload}`);
  }

  private mergeOptions(source: LoggerSource, options?: LoggerOptions): LoggerOptions {
    return {
      ...options,
      source: {
        ...source,
        ...options?.source,
      },
    };
  }
}
export const loggerFactory = new LoggerFactory();
