// packages/build-core/src/logging/log-levels.ts

import type { LogLevel } from './log-types.js';

export const LOG_LEVELS: Record<
  LogLevel,
  {
    write: (...args: string[]) => void;
    symbol: string;
  }
> = {
  trace: {
    write: console.debug,
    symbol: '· ',
  },
  info: {
    write: console.log,
    symbol: '',
  },
  success: {
    write: console.log,
    symbol: '✔ ',
  },
  warn: {
    write: console.warn,
    symbol: '▲ ',
  },
  error: {
    write: console.error,
    symbol: '✖ ',
  },
};
