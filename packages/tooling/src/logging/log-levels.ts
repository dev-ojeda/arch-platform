import type { LogLevel } from './log-types.js';

const ANSI = {
  reset: '\x1b[0m',

  brightCyan: '\x1b[96m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightRed: '\x1b[91m',
} as const;

export const LOG_LEVELS: Record<
  LogLevel,
  {
    write: (...args: string[]) => void;
    symbol: string;
  }
> = {
  trace: {
    write: console.debug,
    symbol: `${ANSI.brightCyan}· ${ANSI.reset}`,
  },

  info: {
    write: console.log,
    symbol: '',
  },

  success: {
    write: console.log,
    symbol: `${ANSI.brightGreen}✔ ${ANSI.reset}`,
  },

  warn: {
    write: console.warn,
    symbol: `${ANSI.brightYellow}▲ ${ANSI.reset}`,
  },

  error: {
    write: console.error,
    symbol: `${ANSI.brightRed}✖ ${ANSI.reset}`,
  },
};
