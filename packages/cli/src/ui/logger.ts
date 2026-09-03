// packages/cli/src/ui/logger.ts

import { safeStringify } from './safe-stringify.js';
import { sanitizeMetadata } from './sanitize-metadata.js';
import type { LogLevel } from './type-variable.js';
import { LOG_LEVELS } from './type-variable.js';

interface LogMetadata {
  readonly [key: string]: unknown;
}
interface LogOptions {
  prefix?: boolean;

  metadata?: LogMetadata;
}
const ARCH_PREFIX = '[arch]';

const ANSI = {
  reset: '\x1b[0m',

  // Text
  dim: '\x1b[2m',
  bold: '\x1b[1m',

  // Foreground
  gray: '\x1b[90m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Bright foreground
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
} as const;

function colorize(color: string, value: string): string {
  return `${color}${value}${ANSI.reset}`;
}

function colorizeMetadata(value: string): string {
  return value
    .replace(/"([^"]+)":/g, `${ANSI.cyan}"$1"${ANSI.reset}:`)
    .replace(/"([^"]*)"/g, `${ANSI.green}"$1"${ANSI.reset}`)
    .replace(/\b(true|false)\b/g, `${ANSI.yellow}$1${ANSI.reset}`)
    .replace(/\bnull\b/g, `${ANSI.magenta}null${ANSI.reset}`)
    .replace(/(?<!["\w])(-?\d+(?:\.\d+)?)(?!["\w])/g, `${ANSI.brightYellow}$1${ANSI.reset}`);
}

function write(level: LogLevel, message: string, options: LogOptions = {}): void {
  const { prefix = true, metadata } = options;

  const timestamp = new Date().toISOString();

  const cleanMetadata: LogMetadata | undefined = metadata ? sanitizeMetadata(metadata) : undefined;

  const formattedPrefix = prefix ? `${colorize(ANSI.dim, ARCH_PREFIX)} ` : '';

  const formattedMessage = (() => {
    switch (level) {
      case 'trace':
        return colorize(ANSI.brightCyan, message);

      case 'info':
        return colorize(ANSI.white, message);

      case 'success':
        return colorize(ANSI.brightGreen, message);

      case 'warn':
        return colorize(ANSI.brightYellow, message);

      case 'error':
        return colorize(ANSI.brightRed, message);

      default:
        return message;
    }
  })();

  const formattedTimestamp = colorize(ANSI.gray, `[${timestamp}]`);

  const payload = cleanMetadata
    ? `${formattedTimestamp} ${formattedPrefix}${formattedMessage}\n${colorizeMetadata(
        safeStringify(cleanMetadata, 2),
      )}`
    : `${formattedTimestamp} ${formattedPrefix}${formattedMessage}`;

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
